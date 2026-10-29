/** Sanity checks for lead extraction and scoring. Run: npx tsx scripts/check-extraction.ts */
import { dedupeKey, extractLead, normalisePhone, shouldRequestContact } from '../api/_lib/leadIntelligence.js';

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) failures += 1;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}${pass ? '' : `\n      expected ${JSON.stringify(expected)}\n      actual   ${JSON.stringify(actual)}`}`);
}

// --- phone normalisation
check('phone +91 with spaces', normalisePhone('+91 98765 43210'), '9876543210');
check('phone with 0 prefix', normalisePhone('09876543210'), '9876543210');
check('phone rejects landline-style leading digit', normalisePhone('1234567890'), undefined);
check('phone rejects short', normalisePhone('98765'), undefined);

// --- the critical case: the bot quotes the agency's own number
const withAgencyReply = extractLead([
  { role: 'user', content: 'how much for a website?' },
  { role: 'assistant', content: 'Reach us on +91 97870-97006 or wedigitaldude@gmail.com' },
]);
check('does NOT capture agency phone from bot reply', withAgencyReply.phone, undefined);
check('does NOT capture agency email from bot reply', withAgencyReply.email, undefined);

// --- a realistic hot lead
const hot = extractLead([
  { role: 'user', content: 'Hi, I run a bakery in Poonamallee. I need an online store ASAP.' },
  { role: 'assistant', content: 'Happy to help! What is your budget?' },
  { role: 'user', content: 'Budget is around 75,000. My number is 9876543210, please call me.' },
]);
check('hot: phone extracted', hot.phone, '9876543210');
check('hot: services detected', hot.services, ['ecommerce']);
check('hot: budget captured', hot.budgetHint, '75,000');
check('hot: timeline captured', hot.timelineHint?.toLowerCase(), 'asap');
check('hot: temperature', hot.temperature, 'hot');
check('hot: is lead worthy', hot.isLeadWorthy, true);
console.log(`      score ${hot.score}, signals: ${hot.signals.map((s) => s.key).join(', ')}`);

// --- Tanglish pricing question, no contact
const tanglish = extractLead([{ role: 'user', content: 'Website panna mudiyuma? Evlo aagum?' }]);
check('tanglish: service detected', tanglish.services, ['web_development']);
check('tanglish: pricing signal present', tanglish.signals.some((s) => s.key === 'pricing'), true);
check('tanglish: thin enquiry not lead worthy', tanglish.isLeadWorthy, false);

// --- business type vs company name
const typeOnly = extractLead([{ role: 'user', content: 'I run a bakery in Poonamallee' }]);
check('a business type is not stored as a company name', typeOnly.company, undefined);
check('business type captured', typeOnly.businessType, 'bakery in Poonamallee');

const namedCompany = extractLead([{ role: 'user', content: 'I run Sweet Treats and need a website' }]);
check('a real company name is captured', namedCompany.company, 'Sweet Treats');

// --- a browsing visitor
const cold = extractLead([{ role: 'user', content: 'what services do you offer' }]);
check('cold: temperature', cold.temperature, 'cold');
check('cold: no contact', Boolean(cold.phone || cold.email), false);

// --- capture-card values win over text extraction
const provided = extractLead([{ role: 'user', content: 'call me on 9000000001' }], {
  name: 'Priya',
  phone: '9876543210',
  services: ['video'],
});
check('provided name wins', provided.name, 'Priya');
check('provided phone wins over text', provided.phone, '9876543210');
check('provided service merged with detected', provided.services.includes('video'), true);

// --- capture trigger
check('trigger on pricing', shouldRequestContact([{ role: 'user', content: 'how much?' }]), true);
check('no trigger on greeting', shouldRequestContact([{ role: 'user', content: 'hi' }]), false);
check(
  'no trigger once phone already shared',
  shouldRequestContact([{ role: 'user', content: 'call me 9876543210, how much?' }]),
  false,
);
check(
  'trigger after 3 messages regardless',
  shouldRequestContact([
    { role: 'user', content: 'hi' },
    { role: 'user', content: 'ok' },
    { role: 'user', content: 'tell me more' },
  ]),
  true,
);

// --- dedupe keys
check('dedupe prefers phone', dedupeKey('a@b.com', '+91 98765 43210'), 'phone:9876543210');
check('dedupe falls back to email', dedupeKey('A@B.com', undefined), 'email:a@b.com');
check('dedupe null without contact', dedupeKey(undefined, undefined), null);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
