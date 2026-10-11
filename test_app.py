import json, os, socket, subprocess, tempfile, time, unittest, urllib.request, urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parent
class ReportingTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        with socket.socket() as s:s.bind(('127.0.0.1',0));self.port=s.getsockname()[1]
        self.env=dict(os.environ, PORT=str(self.port), LINDA_DB=self.tmp.name+'/reports.sqlite3');self.start()
    def start(self):
        self.proc=subprocess.Popen(['python3','app.py'],cwd=ROOT,env=self.env,stdout=subprocess.DEVNULL)
        for _ in range(100):
            try:self.request('/health');return
            except OSError:time.sleep(.02)
        raise RuntimeError('Server did not start')
    def tearDown(self):self.proc.terminate();self.proc.wait();self.tmp.cleanup()
    def request(self,path,method='GET',data=None,key=None,origin=None):
        headers={'Content-Type':'application/json'}
        if key:headers['Authorization']='Bearer '+key
        if origin:headers['Origin']=origin
        req=urllib.request.Request(f'http://127.0.0.1:{self.port}'+path,method=method,data=json.dumps(data).encode() if data is not None else None,headers=headers)
        try:r=urllib.request.urlopen(req)
        except urllib.error.HTTPError as e:r=e
        return r.code,json.load(r)
    def test_complete_report_lifecycle(self):
        body={'category':'harassment','summary':'Fictional unwanted messages','evidence':'Fictional date note','consent':False}
        self.assertEqual(self.request('/api/reports','POST',body)[0],400)
        body['consent']=True
        self.assertEqual(self.request('/api/reports','POST',body,origin='https://evil.example')[0],403)
        body['category']=[];self.assertEqual(self.request('/api/reports','POST',body)[0],400);body['category']='harassment'
        code,report=self.request('/api/reports','POST',body);self.assertEqual(code,201)
        path='/api/reports/'+report['id'];key=report['access_key']
        self.assertEqual(self.request(path)[0],404)
        self.assertEqual(self.request(path,key='wrong')[0],404)
        self.assertEqual(self.request(path,'DELETE',key='wrong')[0],404)
        self.proc.terminate();self.proc.wait();self.start()
        code,saved=self.request(path,key=key);self.assertEqual(code,200);self.assertEqual(saved['summary'],body['summary']);self.assertNotIn('token_hash',saved)
        self.assertEqual(self.request(path,'DELETE',key=key)[0],200)
        self.assertEqual(self.request(path,key=key)[0],404)
if __name__=='__main__':unittest.main()
