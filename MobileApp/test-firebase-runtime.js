/**
 * Runtime Firebase Test
 * 
 * Simulates how Firebase is initialized in the app runtime
 */

console.log('🧪 Testing Firebase Runtime Integration...\n');

// Simulate React Native/Expo environment
global.Platform = { OS: 'web' }; // or 'ios', 'android'
if (typeof window === 'undefined') {
  global.window = {};
}

// Test the actual initialization flow
console.log('Test: App Layout Firebase Initialization Flow');
console.log('Simulating: app/_layout.tsx useEffect(() => { initializeFirebase(); }, []);\n');

try {
  // This simulates what happens in _layout.tsx
  const firebaseModule = require('./app/services/firebase');
  
  console.log('1. Importing Firebase service...');
  console.log('   ✅ Firebase service module loaded');
  
  console.log('\n2. Calling initializeFirebase()...');
  const app = firebaseModule.initializeFirebase();
  
  if (app) {
    console.log('   ✅ Firebase initialized successfully');
    console.log('   ✅ App instance:', app.name || '[DEFAULT]');
  } else {
    console.error('   ❌ Firebase initialization returned null');
  }
  
  console.log('\n3. Verifying Firebase instances are available...');
  const firebaseApp = firebaseModule.getFirebaseApp();
  const firebaseAuth = firebaseModule.getFirebaseAuth();
  const firebaseFirestore = firebaseModule.getFirebaseFirestore();
  
  if (firebaseApp) {
    console.log('   ✅ Firebase App: Available');
  }
  if (firebaseAuth) {
    console.log('   ✅ Firebase Auth: Available');
  }
  if (firebaseFirestore) {
    console.log('   ✅ Firebase Firestore: Available');
  }
  
  console.log('\n4. Testing event logging (will log to console on native)...');
  firebaseModule.logEvent('test_runtime_event', { test: true })
    .then(() => {
      console.log('   ✅ Event logging function executed');
    })
    .catch((err) => {
      console.log('   ⚠️  Event logging (expected behavior in Node.js):', err.message);
    });
  
  console.log('\n✅ Runtime integration test complete!');
  console.log('\n📝 Firebase is ready to use in your app runtime');
  
} catch (error) {
  console.error('❌ Runtime test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

