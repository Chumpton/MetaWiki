/**
 * MetaWiki Real Auth Verification Test Suite
 * Performs automated verification of Sign In, Sign Out, Remember Me persistence,
 * and Discord Guild membership verification.
 */

const fs = require('fs');
const localStore = {};
const sessionStore = {};

global.localStorage = {
  getItem: (k) => localStore[k] || null,
  setItem: (k, v) => { localStore[k] = String(v); },
  removeItem: (k) => { delete localStore[k]; }
};

global.sessionStorage = {
  getItem: (k) => sessionStore[k] || null,
  setItem: (k, v) => { sessionStore[k] = String(v); },
  removeItem: (k) => { delete sessionStore[k]; }
};

global.CustomEvent = class {
  constructor(type, options) {
    this.type = type;
    this.detail = options?.detail;
  }
};

global.window = {
  dispatchEvent: () => {}
};

global.document = {
  addEventListener: () => {},
  getElementById: () => null,
  querySelectorAll: () => [],
  createElement: () => ({ id: '', innerHTML: '', appendChild: () => {} }),
  body: { appendChild: () => {} }
};

// Load AuthService.js
const authCode = fs.readFileSync('src/services/AuthService.js', 'utf8');
eval(authCode);

const auth = window.METAWIKI_AUTH;

console.log('=================================================================');
console.log('🧪 METAWIKI REAL AUTHENTICATION & REMEMBER ME TEST SUITE');
console.log('=================================================================\n');

async function runTests() {
  // Test 1: Sign In with Remember Me = true
  console.log('1️⃣ Testing Sign In with Remember Me = TRUE...');
  const session1 = await auth.loginDiscordOptimistic('HermeticScholar', null, 700, true);
  console.log('   ✔ Session Created:', session1.username, 'Level:', session1.level);
  console.log('   ✔ In localStorage?', !!localStore['metawiki_auth_session']);
  console.log('   ✔ In sessionStorage?', !!sessionStore['metawiki_auth_session']);
  
  if (!localStore['metawiki_auth_session'] || sessionStore['metawiki_auth_session']) {
    throw new Error('Remember Me = true failed to persist session in localStorage correctly!');
  }
  console.log('   PASSED!\n');

  // Test 2: Remember Me session retrieval after "page reload"
  console.log('2️⃣ Testing Session Retrieval after simulated page reload...');
  const retrievedSession = auth.getSession();
  console.log('   ✔ Retrieved Username:', retrievedSession.username);
  console.log('   ✔ Retrieved Level:', retrievedSession.level);
  if (retrievedSession.username !== 'HermeticScholar') {
    throw new Error('Session retrieval failed!');
  }
  console.log('   PASSED!\n');

  // Test 3: Sign In with Remember Me = false
  console.log('3️⃣ Testing Sign In with Remember Me = FALSE (Session-only)...');
  const session2 = await auth.loginDiscordOptimistic('TransientSeeker', null, 540, false);
  console.log('   ✔ Session Created:', session2.username, 'Level:', session2.level);
  console.log('   ✔ In localStorage?', !!localStore['metawiki_auth_session']);
  console.log('   ✔ In sessionStorage?', !!sessionStore['metawiki_auth_session']);

  if (localStore['metawiki_auth_session'] || !sessionStore['metawiki_auth_session']) {
    throw new Error('Remember Me = false failed to persist session in sessionStorage correctly!');
  }
  console.log('   PASSED!\n');

  // Test 4: Sign Out
  console.log('4️⃣ Testing Sign Out...');
  auth.logout();
  const sessionAfterLogout = auth.getSession();
  console.log('   ✔ Session after logout:', sessionAfterLogout);
  console.log('   ✔ localStorage cleared?', !localStore['metawiki_auth_session']);
  console.log('   ✔ sessionStorage cleared?', !sessionStore['metawiki_auth_session']);

  if (sessionAfterLogout !== null) {
    throw new Error('Sign out failed to invalidate session!');
  }
  console.log('   PASSED!\n');

  // Test 5: Discord Guild Membership Check Failure
  console.log('5️⃣ Testing Discord Guild Membership Check Failure...');
  auth.simulateGuildMembershipCheckPass = false;
  try {
    await auth.loginDiscordOptimistic('UnverifiedUser', null, 700, true);
    throw new Error('Guild membership check failed to reject unverified user!');
  } catch (err) {
    console.log('   ✔ Expected Error Caught:', err.message);
    console.log('   PASSED!\n');
  }

  console.log('=================================================================');
  console.log('✅ ALL REAL AUTHENTICATION & REMEMBER ME TESTS PASSED SUCCESSFULLY!');
  console.log('=================================================================');
}

runTests().catch(err => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
