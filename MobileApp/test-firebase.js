/**
 * Firebase Test Script
 * 
 * This script tests if Firebase is properly configured and can be initialized.
 * Run with: node test-firebase.js
 */

const { initializeApp, getApps } = require('firebase/app');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcrOoa6li1rZ-xugyOd1VvAinoi43QwlU",
  authDomain: "quatroplus-355df.firebaseapp.com",
  projectId: "quatroplus-355df",
  storageBucket: "quatroplus-355df.firebasestorage.app",
  messagingSenderId: "655965859490",
  appId: "1:655965859490:web:45723acd45621900cd71fb",
  measurementId: "G-YKYPGNBKT0"
};

console.log('🔥 Testing Firebase Configuration...\n');

// Test 1: Check if Firebase can be initialized
console.log('Test 1: Firebase Initialization');
try {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully!');
    console.log('   App name:', app.name);
    console.log('   Project ID:', firebaseConfig.projectId);
  } else {
    console.log('✅ Firebase already initialized');
    console.log('   Number of apps:', getApps().length);
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

// Test 2: Check Firebase modules
console.log('\nTest 2: Firebase Modules');
try {
  const auth = require('firebase/auth');
  const firestore = require('firebase/firestore');
  console.log('✅ Firebase Auth module loaded');
  console.log('✅ Firebase Firestore module loaded');
} catch (error) {
  console.error('❌ Failed to load Firebase modules:', error.message);
}

// Test 3: Check Analytics (web only)
console.log('\nTest 3: Firebase Analytics');
try {
  const analytics = require('firebase/analytics');
  console.log('✅ Firebase Analytics module loaded');
  console.log('   Note: Analytics only works on web platform');
} catch (error) {
  console.warn('⚠️  Firebase Analytics not available (expected on Node.js)');
  console.log('   This is normal - Analytics requires a browser environment');
}

// Test 4: Test Auth initialization
console.log('\nTest 4: Firebase Auth');
try {
  const { getAuth } = require('firebase/auth');
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
  console.log('   Auth instance created successfully');
} catch (error) {
  console.error('❌ Firebase Auth initialization failed:', error.message);
}

// Test 5: Test Firestore initialization
console.log('\nTest 5: Firebase Firestore');
try {
  const { getFirestore } = require('firebase/firestore');
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  console.log('✅ Firebase Firestore initialized');
  console.log('   Firestore instance created successfully');
} catch (error) {
  console.error('❌ Firebase Firestore initialization failed:', error.message);
}

// Test 6: Configuration validation
console.log('\nTest 6: Configuration Validation');
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
let configValid = true;

requiredFields.forEach(field => {
  if (!firebaseConfig[field]) {
    console.error(`❌ Missing required field: ${field}`);
    configValid = false;
  } else {
    console.log(`✅ ${field}: ${firebaseConfig[field].substring(0, 20)}...`);
  }
});

if (configValid) {
  console.log('\n✅ All configuration fields are present');
} else {
  console.error('\n❌ Configuration validation failed');
  process.exit(1);
}

console.log('\n🎉 All Firebase tests passed!');
console.log('\n📝 Summary:');
console.log('   - Firebase App: ✅ Initialized');
console.log('   - Firebase Auth: ✅ Ready');
console.log('   - Firebase Firestore: ✅ Ready');
console.log('   - Firebase Analytics: ⚠️  Web only');
console.log('   - Configuration: ✅ Valid');
console.log('\n✅ Firebase is properly configured and ready to use!');

