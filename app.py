"""Local-first reporting prototype. No reports are sent to an organization."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from datetime import datetime, timezone
import hashlib, json, os, secrets, sqlite3

ROOT = Path(__file__).resolve().parent
DB = Path(os.getenv('LINDA_DB', str(ROOT / 'data' / 'reports.sqlite3')))
CATEGORIES = {'harassment', 'impersonation', 'extortion', 'privacy', 'other'}

def connect():
    DB.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    db = sqlite3.connect(DB)
    db.row_factory = sqlite3.Row
    db.execute('CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL, category TEXT NOT NULL, summary TEXT NOT NULL, evidence TEXT NOT NULL, created TEXT NOT NULL)')
    os.chmod(DB, 0o600)
    return db

def digest(token):
    return hashlib.sha256(token.encode()).hexdigest()

def safety_plan(category):
    # User-selected category; this does not predict severity or diagnose risk.
    extra = {
        'harassment': 'Review who can contact you and tag you on the platform.',
        'impersonation': 'Use the platform’s impersonation report and secure your own account.',
        'extortion': 'Speak with a trusted support person before responding to demands.',
        'privacy': 'Review account access and remove unwanted sharing permissions when safe.',
        'other': 'Write down what happened and choose a trusted person to help you decide next steps.'
    }
    return ['If you feel unsafe, seek help from a trusted person or verified local service.', 'Save dates and links only when safe. Do not upload private images here.', extra[category], 'Use the platform’s reporting and blocking options when safe.']

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # Report contents and access keys must not appear in logs.
    def send(self, status, data):
        raw = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers(); self.wfile.write(raw)
    def body(self):
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            raise ValueError('Use application/json')
        size = int(self.headers.get('Content-Length', '0'))
        if not 0 < size <= 16000: raise ValueError('Request is too large or empty')
        result = json.loads(self.rfile.read(size))
        if not isinstance(result, dict): raise ValueError('JSON object required')
        return result
    def same_origin(self):
        origin = self.headers.get('Origin')
        return not origin or urlparse(origin).netloc == self.headers.get('Host')
    def authorized(self, report_id):
        header = self.headers.get('Authorization', '')
        token = header[7:] if header.startswith('Bearer ') else ''
        with connect() as db: row = db.execute('SELECT * FROM reports WHERE id=?', (report_id,)).fetchone()
        return row if row and secrets.compare_digest(row['token_hash'], digest(token)) else None
    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/health': return self.send(200, {'status': 'ok'})
        if path.startswith('/api/reports/'):
            row = self.authorized(path.rsplit('/', 1)[-1])
            if not row: return self.send(404, {'error': 'Report unavailable. Check your ID and access key.'})
            result = {k: row[k] for k in ['id', 'category', 'summary', 'evidence', 'created']}
            result['status'] = 'Saved privately on this prototype server; not sent to a support organization'
            result['plan'] = safety_plan(row['category'])
            return self.send(200, result)
        if path not in ['/', '/app.js', '/styles.css']: return self.send(404, {'error': 'Not found'})
        file = {'/': 'index.html', '/app.js': 'app.js', '/styles.css': 'styles.css'}[path]
        self.send_response(200)
        self.send_header('Content-Type', {'/': 'text/html; charset=utf-8', '/app.js': 'text/javascript', '/styles.css': 'text/css'}[path])
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
        self.send_header('Cache-Control', 'no-store')
        self.end_headers(); self.wfile.write((ROOT / file).read_bytes())
    def do_POST(self):
        if not self.same_origin(): return self.send(403, {'error': 'Cross-origin request rejected'})
        if self.path != '/api/reports': return self.send(404, {'error': 'Not found'})
        try:
            body = self.body()
            category, summary, evidence = body.get('category'), body.get('summary'), body.get('evidence', '')
            if body.get('consent') is not True: raise ValueError('Consent is required to save a report')
            if not isinstance(category, str) or category not in CATEGORIES: raise ValueError('Choose a valid category')
            if not isinstance(summary, str) or not 10 <= len(summary.strip()) <= 2000: raise ValueError('Summary must be 10–2000 characters')
            if not isinstance(evidence, str) or len(evidence) > 3000: raise ValueError('Evidence notes must be at most 3000 characters')
            report_id, token = secrets.token_urlsafe(12), secrets.token_urlsafe(32)
            created = datetime.now(timezone.utc).isoformat()
            with connect() as db:
                db.execute('INSERT INTO reports VALUES (?,?,?,?,?,?)', (report_id, digest(token), category, summary.strip(), evidence.strip(), created))
            return self.send(201, {'id': report_id, 'access_key': token, 'category': category, 'summary': summary.strip(), 'evidence': evidence.strip(), 'created': created, 'plan': safety_plan(category), 'status': 'Saved privately. No organization has received this report.'})
        except (ValueError, TypeError) as error: return self.send(400, {'error': str(error)})
    def do_DELETE(self):
        if not self.same_origin(): return self.send(403, {'error': 'Cross-origin request rejected'})
        if not self.path.startswith('/api/reports/'): return self.send(404, {'error': 'Not found'})
        report_id = self.path.rsplit('/', 1)[-1]
        if not self.authorized(report_id): return self.send(404, {'error': 'Report unavailable'})
        with connect() as db: db.execute('DELETE FROM reports WHERE id=?', (report_id,))
        self.send(200, {'deleted': True})

if __name__ == '__main__':
    with connect(): pass
    server = ThreadingHTTPServer(('127.0.0.1', int(os.getenv('PORT', '8000'))), Handler)
    print('Linda Mtoto: http://127.0.0.1:%s' % server.server_port)
    server.serve_forever()
