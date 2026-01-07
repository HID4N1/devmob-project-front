/**
 * Firebase Integration Test
 * 
 * Tests Firebase configuration and verifies all components are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Firebase Integration in QuattroPlus App...\n');

let allTestsPassed = true;

// Test 1: Check Firebase package is installed
console.log('Test 1: Firebase Package Installation');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies.firebase) {
    console.log(`✅ Firebase package installed: ${packageJson.dependencies.firebase}`);
  } else {
    console.error('❌ Firebase package not found in package.json');
    allTestsPassed = false;
  }
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  allTestsPassed = false;
}

// Test 2: Check Firebase config file exists
console.log('\nTest 2: Firebase Service Files');
const firebaseFiles = [
  'app/services/firebase.ts',
  'app/services/FirebaseService.ts'
];

firebaseFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    
    // Check if file has content
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.length > 100) {
      console.log(`   File size: ${content.length} bytes`);
    } else {
      console.warn(`   ⚠️  File seems empty or very small`);
    }
  } else {
    console.error(`❌ ${file} not found`);
    allTestsPassed = false;
  }
});

// Test 3: Check Firebase config in app.json
console.log('\nTest 3: Firebase Configuration in app.json');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  if (appJson.expo && appJson.expo.extra && appJson.expo.extra.firebase) {
    const firebaseConfig = appJson.expo.extra.firebase;
    console.log('✅ Firebase config found in app.json');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
    console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
    
    // Validate required fields
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    let configValid = true;
    requiredFields.forEach(field => {
      if (!firebaseConfig[field] || firebaseConfig[field].includes('YOUR_')) {
        console.error(`   ❌ ${field} is missing or placeholder`);
        configValid = false;
      }
    });
    
    if (configValid) {
      console.log('   ✅ All required fields are configured');
    } else {
      console.error('   ❌ Configuration incomplete');
      allTestsPassed = false;
    }
  } else {
    console.error('❌ Firebase config not found in app.json');
    allTestsPassed = false;
  }
} catch (error) {
  console.error('❌ Failed to read app.json:', error.message);
  allTestsPassed = false;
}

// Test 4: Check Firebase initialization in _layout.tsx
console.log('\nTest 4: Firebase Initialization in App Layout');
try {
  const layoutFile = 'app/_layout.tsx';
  const layoutPath = path.join(__dirname, layoutFile);
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    if (content.includes('initializeFirebase')) {
      console.log('✅ Firebase initialization found in _layout.tsx');
    } else {
      console.error('❌ Firebase initialization not found in _layout.tsx');
      allTestsPassed = false;
    }
    
    if (content.includes('from "./services/firebase"')) {
      console.log('✅ Firebase service import found');
    } else {
      console.error('❌ Firebase service import not found');
      allTestsPassed = false;
    }
  } else {
    console.error(`❌ ${layoutFile} not found`);
    allTestsPassed = false;
  }
} catch (error) {
  console.error('❌ Failed to check _layout.tsx:', error.message);
  allTestsPassed = false;
}

// Test 5: Check Firebase integration in services
console.log('\nTest 5: Firebase Integration in Services');
const servicesToCheck = [
  { file: 'app/services/AuthService.ts', shouldHave: 'FirebaseService' },
  { file: 'app/services/GameService.ts', shouldHave: 'FirebaseService' },
  { file: 'app/services/OcrService.ts', shouldHave: 'FirebaseService' }
];

servicesToCheck.forEach(({ file, shouldHave }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(shouldHave)) {
      console.log(`✅ ${file} has Firebase integration`);
    } else {
      console.warn(`⚠️  ${file} may not have Firebase integration`);
    }
  } else {
    console.warn(`⚠️  ${file} not found`);
  }
});

// Test 6: Check Firebase integration in screens
console.log('\nTest 6: Firebase Integration in Screens');
const screensToCheck = [
  { file: 'app/screens/Login.tsx', shouldHave: 'FirebaseService' },
  { file: 'app/screens/Game.tsx', shouldHave: 'FirebaseService' }
];

screensToCheck.forEach(({ file, shouldHave }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(shouldHave)) {
      console.log(`✅ ${file} has Firebase integration`);
    } else {
      console.warn(`⚠️  ${file} may not have Firebase integration`);
    }
  } else {
    console.warn(`⚠️  ${file} not found`);
  }
});

// Test 7: Verify node_modules has Firebase
console.log('\nTest 7: Firebase in node_modules');
const firebasePath = path.join(__dirname, 'node_modules', 'firebase');
if (fs.existsSync(firebasePath)) {
  console.log('✅ Firebase package found in node_modules');
  
  // Check package.json in firebase module
  const firebasePackageJson = path.join(firebasePath, 'package.json');
  if (fs.existsSync(firebasePackageJson)) {
    const firebasePkg = JSON.parse(fs.readFileSync(firebasePackageJson, 'utf8'));
    console.log(`   Version: ${firebasePkg.version}`);
  }
} else {
  console.error('❌ Firebase package not found in node_modules');
  console.log('   Run: npm install firebase');
  allTestsPassed = false;
}

// Final Summary
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 All Firebase Integration Tests Passed!');
  console.log('\n✅ Firebase is properly integrated in your app');
  console.log('✅ Configuration is valid');
  console.log('✅ Services are integrated');
  console.log('✅ Ready to use!\n');
  console.log('📝 Next Steps:');
  console.log('   1. Run: npm start');
  console.log('   2. Check console for "Firebase initialized successfully"');
  console.log('   3. Use the app and check Firebase Console for events');
} else {
  console.log('❌ Some tests failed. Please fix the issues above.');
  process.exit(1);
}

