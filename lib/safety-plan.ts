// Transparent, rule-based safety plan. Steps come from what the person chose;
// nothing here predicts risk or severity.
import { platformLabel, type CategoryId, type OngoingId, type PlatformId } from './catalog'

export type PlanStep = { id: string; title: string; detail: string }

const FIRST: PlanStep[] = [
  {
    id: 'safe-now',
    title: 'Check you are safe right now',
    detail:
      'If you are in danger or feel at risk of harm, go somewhere safe and contact a trusted adult or local emergency services first. Everything else can wait.',
  },
  {
    id: 'trusted-person',
    title: 'Tell someone you trust',
    detail:
      'A parent, carer, teacher, counsellor or another adult you trust can help you decide what to do next. You do not have to handle this alone.',
  },
]

const BY_CATEGORY: Record<CategoryId, PlanStep[]> = {
  harassment: [
    {
      id: 'limit-contact',
      title: 'Limit who can reach you',
      detail:
        'Mute, restrict or block the accounts involved. Set your profile to private and review who can message, tag or mention you.',
    },
    {
      id: 'record-harassment',
      title: 'Keep a simple record',
      detail:
        'Note dates, usernames and links in your evidence notes. Screenshots of messages can help, but only take them if it feels safe.',
    },
    {
      id: 'report-platform',
      title: 'Report it to the platform',
      detail:
        'Use the report option on the messages or the account. The person you report is usually not told who reported them.',
    },
  ],
  impersonation: [
    {
      id: 'report-impersonation',
      title: 'Report the fake account',
      detail:
        'Most platforms have a specific “pretending to be me” report. Friends can report it too, which can speed things up.',
    },
    {
      id: 'warn-contacts',
      title: 'Let your contacts know',
      detail:
        'Tell friends and family the account is fake so they do not accept requests or send money or information.',
    },
    {
      id: 'secure-own',
      title: 'Secure your real account',
      detail: 'Change your password, turn on two-step verification and check which devices are signed in.',
    },
  ],
  extortion: [
    {
      id: 'do-not-pay',
      title: 'Do not pay or send anything more',
      detail: 'Paying or sending more rarely makes it stop. Stop replying, but do not delete the conversation yet.',
    },
    {
      id: 'not-your-fault',
      title: 'Remember: this is not your fault',
      detail: 'The person threatening you is the one doing wrong. You will not get in trouble for asking for help.',
    },
    {
      id: 'preserve-extortion',
      title: 'Save the details, then block',
      detail: 'Write down the account name, profile link and what was demanded. Then block and report the account.',
    },
    {
      id: 'report-extortion',
      title: 'Report the threat',
      detail: 'Report the account to the platform. A trusted adult can help you report to the police if you decide to.',
    },
  ],
  images: [
    {
      id: 'no-share',
      title: 'Do not forward or save the images',
      detail:
        'Even as evidence, do not save or forward intimate images. Write down where they appeared — links, usernames and dates — instead.',
    },
    {
      id: 'request-removal',
      title: 'Ask for the content to be removed',
      detail:
        'Report it to the platform as intimate images shared without consent. Platforms usually treat these reports as a priority.',
    },
    {
      id: 'not-your-fault-images',
      title: 'This is not your fault',
      detail: 'Sharing someone’s private images without consent is abuse. You deserve support, not blame.',
    },
  ],
  account: [
    {
      id: 'change-passwords',
      title: 'Change your passwords',
      detail:
        'Start with your email account, then any account that shares the same password. Use a different password for each one.',
    },
    {
      id: 'two-step',
      title: 'Turn on two-step verification',
      detail: 'Use an authenticator app or a text-message code so a password alone is not enough to get in.',
    },
    {
      id: 'review-devices',
      title: 'Sign out devices you do not recognise',
      detail:
        'Check the list of signed-in devices and connected apps and remove anything unfamiliar. Check your recovery email and phone number too.',
    },
  ],
  other: [
    {
      id: 'write-down',
      title: 'Write down what happened',
      detail: 'Use your notes to record dates, usernames and what happened so it is easier to explain later.',
    },
    {
      id: 'platform-tools',
      title: 'Use the platform’s safety tools',
      detail: 'Look for block, mute, restrict and report options in the app’s settings or on the content itself.',
    },
  ],
}

const LAST: PlanStep = {
  id: 'look-after-yourself',
  title: 'Look after yourself',
  detail:
    'Online harm can be upsetting. Take breaks, do something calming and keep talking to people you trust. Come back to this plan whenever you need it.',
}

const NAMED_APPS = new Set<PlatformId>(['whatsapp', 'facebook', 'instagram', 'tiktok', 'snapchat', 'x', 'telegram'])

export type PlanInput = { category: CategoryId; platform: PlatformId; ongoing: OngoingId }

export function buildSafetyPlan({ category, platform, ongoing }: PlanInput): PlanStep[] {
  const steps = [...FIRST, ...BY_CATEGORY[category]]
  if (ongoing === 'yes') {
    steps.push({
      id: 'take-a-break',
      title: 'Take a break if you need to',
      detail:
        'You can mute notifications or temporarily deactivate an account while you get support. Your notes stay here.',
    })
  }
  if (NAMED_APPS.has(platform)) {
    const name = platformLabel(platform)
    steps.push({
      id: 'platform-help',
      title: `Find ${name}’s safety settings`,
      detail: `Open ${name} → Settings → Help, Privacy or Safety to find its blocking and reporting guides. Only use the official app or website.`,
    })
  }
  steps.push(LAST)
  return steps
}
