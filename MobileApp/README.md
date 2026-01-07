# QuattroPlus Mobile App

A modern, feature-rich mobile lottery application built with React Native and Expo. QuattroPlus allows users to scan lottery tickets, play interactive slot machine games, and win prizes through an engaging user experience.

## 📱 Overview

QuattroPlus is a cross-platform mobile application that digitizes the lottery ticket experience. Users can scan physical lottery tickets using OCR technology, enter their lucky numbers, and play an animated slot machine game to determine if they've won prizes.

## ✨ Features

### Core Functionality
- **🔐 Secure Authentication**: JWT-based authentication with secure token storage
- **📷 OCR Ticket Scanning**: Extract ticket data (number, stake, CRC, Detaillant) from images using backend OCR
- **🎰 Interactive Slot Machine Game**: Animated 4-reel slot machine with smooth animations and visual effects
- **🎁 Gift Management**: View available prizes organized by range (A, B, C) with stock information
- **📊 Ticket Management**: Create, validate, and play lottery tickets with backend integration
- **🏆 Win Detection**: Automatic win detection with confetti animations and result screens

### User Experience
- **🎨 Modern UI/UX**: Beautiful gradient backgrounds, neon buttons, and smooth animations
- **📱 Responsive Design**: Adapts to different screen sizes and orientations
- **⚡ Smooth Animations**: React Native Reanimated for performant animations
- **🎉 Visual Feedback**: Confetti effects, pulsing buttons, and winning animations
- **🌙 Dark Theme**: Elegant dark color scheme with neon accents

### Technical Features
- **🔒 Secure Storage**: Expo SecureStore for sensitive data (tokens, credentials)
- **🌐 API Integration**: RESTful API communication with backend services
- **📸 Image Processing**: Image picker and manipulation for OCR scanning
- **🔄 Real-time Validation**: Ticket number validation and duplicate checking
- **📱 Cross-platform**: Works on iOS, Android, and Web

## 🛠️ Tech Stack

### Core Technologies
- **React Native** (0.81.5) - Mobile framework
- **Expo** (~54.0.29) - Development platform and tooling
- **TypeScript** (~5.9.2) - Type-safe JavaScript
- **Expo Router** (~6.0.19) - File-based routing system

### Key Dependencies
- **@react-navigation/native** - Navigation library
- **axios** - HTTP client for API requests
- **expo-secure-store** - Secure token storage
- **expo-image-picker** - Image selection for OCR
- **expo-image-manipulator** - Image processing
- **react-native-mlkit-ocr** - OCR capabilities (optional)
- **react-native-reanimated** - High-performance animations
- **expo-linear-gradient** - Gradient backgrounds
- **lottie-react-native** - Lottie animations
- **@lottiefiles/dotlottie-react** - DotLottie animations

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Expo CLI** - Development and build tools

## 📁 Project Structure

```
MobileApp/
├── app/                          # Main application directory
│   ├── _layout.tsx              # Root layout with navigation
│   ├── index.tsx                # Entry point (redirects to Login)
│   ├── components/              # Reusable UI components
│   │   ├── AnimatedIcon.tsx
│   │   ├── Button.tsx
│   │   ├── MicroConfetti.tsx
│   │   ├── NeonButton.tsx
│   │   ├── NextButton.tsx
│   │   ├── OcrButton.tsx
│   │   ├── WinningAnimation.tsx
│   │   └── condition.tsx
│   ├── screens/                 # Application screens
│   │   ├── _layout.tsx          # Screen layout
│   │   ├── Login.tsx            # Authentication screen
│   │   ├── InfoScreen.tsx       # Ticket input and OCR
│   │   ├── Quattro.tsx          # Number selection screen
│   │   ├── Game.tsx             # Slot machine game screen
│   │   └── Result.tsx           # Game result screen
│   ├── services/                # Business logic and API services
│   │   ├── AuthService.ts       # Authentication operations
│   │   ├── GameService.ts       # Game and ticket operations
│   │   ├── GiftService.ts       # Gift/prize management
│   │   ├── OcrService.ts        # OCR image processing
│   │   └── config.ts            # API configuration
│   ├── navigation/              # Navigation utilities
│   │   ├── NavigationService.ts
│   │   └── types.ts
│   └── theme/                   # Theme configuration
│       └── colors.ts            # Color palette
├── assets/                      # Static assets
│   ├── images/                  # Image assets
│   │   ├── quatro-logo.png
│   │   ├── Quatro-logo-2.png
│   │   ├── quattro_icon.png
│   │   └── LN-logo.png
│   └── animations/              # Animation files
│       └── confetti.json
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── eslint.config.js             # ESLint configuration
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (for macOS) or **Android Emulator** (for Android development)
- **Expo Go** app (optional, for testing on physical devices)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend/MobileApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Edit `app/services/config.ts` and set your API base URL:
   ```typescript
   export const API_BASE_URL = 'https://your-api-url.com/api';
   ```
   
   Or use the environment variable from `app.json`:
   ```json
   "extra": {
     "API_BASE_URL": "https://server.quattroplus.ma/api"
   }
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **Physical Device**: Scan the QR code with Expo Go app

## ⚙️ Configuration

### API Configuration

The API base URL can be configured in two ways:

1. **Local Development** (`app/services/config.ts`):
   ```typescript
   export const API_BASE_URL = 'http://192.168.x.x:8000/api';
   ```

2. **Production** (`app.json`):
   ```json
   "extra": {
     "API_BASE_URL": "https://server.quattroplus.ma/api"
   }
   ```

### App Configuration

Key settings in `app.json`:
- **App Name**: QuattroPlus
- **Package Name**: `ma.quattroplus.mobile` (Android)
- **Scheme**: `quattroplus`
- **Orientation**: Portrait
- **New Architecture**: Enabled

### Environment Variables

The app uses Expo Constants to access configuration:
```typescript
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_BASE_URL;
```

## 📖 Usage Guide

### User Flow

1. **Login Screen**
   - Enter username and password
   - Authentication tokens are stored securely
   - Redirects to InfoScreen upon success

2. **Info Screen**
   - Enter ticket number manually (minimum 25 characters)
   - Or scan ticket using OCR button (📷 Scan)
   - Enter stake amount (minimum 5 MAD)
   - Option to select "Quattro Plus" if stake ≥ 7.5 MAD
   - Accept terms and conditions
   - View available gifts/prizes
   - Continue to number selection

3. **Quattro Screen**
   - Enter 4 digits (1-9) for your lucky numbers
   - Use "🎲 Flash" button for random numbers
   - Continue to game screen

4. **Game Screen**
   - Animated 4-reel slot machine
   - Click "Lancer le tirage" to start
   - 10-second spinning animation
   - Results revealed sequentially
   - Automatic redirect to result screen

5. **Result Screen**
   - Display winning numbers
   - Show win/loss status
   - Display prize information if won
   - Options to share or play again

### OCR Scanning

The OCR feature allows users to scan lottery tickets to automatically extract:
- **Ticket Number** (`external_ticket_number`)
- **Stake** (`stake`)
- **CRC** (Check code)
- **Detaillant** (Retailer information)

**How it works:**
1. Tap the "📷 Scan" button
2. Select image from gallery or take a photo
3. Image is sent to backend OCR API
4. Extracted data populates the form fields

## 🔧 Services

### AuthService
Handles authentication operations:
- `login(username, password)` - User authentication
- `getProfile()` - Fetch user profile and agent info
- `logout()` - Clear stored tokens

**Token Storage:**
- Access tokens stored in Expo SecureStore
- Automatic token inclusion in API requests

### GameService
Manages game and ticket operations:
- `createTicket(ticketNumber, agentId, numbers, stake, ...)` - Create new ticket
- `playTicket(ticketId)` - Play the game and get results
- `updateTicket(ticketId, phoneNumber)` - Update ticket information

### GiftService
Fetches available prizes:
- `fetchGifts()` - Get all available gifts with stock information
- Gifts organized by range (A, B, C)
- Includes stock quantity tracking

### OcrService
Processes ticket images:
- `processTicketImage(imageUri)` - Extract ticket data from image
- Sends image to backend OCR endpoint
- Returns parsed ticket information

## 🎨 Components

### NeonButton
Custom button component with neon glow effect:
- Multiple variants (blue, green, etc.)
- Pulsing animations
- Icon support

### OcrButton
Button for OCR scanning:
- Image picker integration
- Image processing
- Data extraction callback

### WinningAnimation
Celebration animations for wins:
- Confetti effects
- Lottie animations
- Micro-confetti particles

### NextButton
Styled navigation button:
- Color variants
- Loading states
- Disabled states

## 🌐 API Integration

### Authentication Endpoints
- `POST /auth/login/` - User login
- `GET /auth/profile/` - Get user profile

### Game Endpoints
- `POST /games/tickets/` - Create ticket
- `POST /games/tickets/{id}/play/` - Play game
- `PATCH /games/tickets/{id}/` - Update ticket
- `GET /games/tickets/check_external_ticket/` - Check ticket existence
- `POST /games/tickets/extract_ticket_data/` - OCR extraction

### Gift Endpoints
- `GET /games/gifts/` - Fetch available gifts

### Request Format
All authenticated requests include:
```typescript
headers: {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
}
```

## 🎮 Game Mechanics

### Slot Machine
- **4 Reels**: Each reel displays digits 1-9
- **Spinning Duration**: 10 seconds
- **Deceleration**: Staggered stop animation (300ms intervals)
- **Result Display**: Winning numbers highlighted with golden border

### Win Detection
- Backend determines winning numbers
- Compares player numbers with winning combination
- Returns win status and prize information

### Animations
- Continuous reel spinning (loop animation)
- Smooth deceleration to target numbers
- Pulsing effects on winning numbers
- Confetti burst on win

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm start

# Start for specific platform
npm run ios          # iOS Simulator
npm run android      # Android Emulator
npm run web          # Web browser

# Linting
npm run lint

# Reset project (moves code to app-example)
npm run reset-project
```

### Development Tips

1. **Hot Reload**: Changes automatically reload in development
2. **Debugging**: Use React Native Debugger or Chrome DevTools
3. **Type Checking**: TypeScript provides compile-time error checking
4. **Linting**: ESLint enforces code quality

### Code Style
- TypeScript strict mode enabled
- ESLint with Expo config
- Functional components with hooks
- Service-based architecture

## 📦 Building & Deployment

### Development Build

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

4. **Build for Android**
   ```bash
   eas build --platform android
   ```

### Production Build

Update `app.json` with production settings:
- Update API URLs
- Configure app icons and splash screens
- Set version numbers
- Configure update channels

### OTA Updates

The app supports Over-The-Air updates via Expo Updates:
- Configured in `app.json`
- Update URL: `https://u.expo.dev/{projectId}`
- Runtime version policy: `appVersion`

## 🔒 Security

### Token Management
- Access tokens stored in Expo SecureStore
- Tokens automatically included in API requests
- Secure logout clears all stored credentials

### Data Validation
- Ticket number validation (minimum 25 characters)
- Stake validation (minimum 5 MAD)
- Duplicate ticket checking
- Age verification checkbox

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check `config.ts` for correct API URL
   - Verify network connectivity
   - Check backend server status

2. **OCR Not Working**
   - Ensure image permissions are granted
   - Check backend OCR service availability
   - Verify image format (JPEG recommended)

3. **Animation Performance**
   - Use native driver where possible
   - Optimize animation complexity
   - Test on physical devices

4. **Build Errors**
   - Clear cache: `expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check Expo SDK version compatibility

## 📝 License

This project is private and proprietary.

## 👥 Team

- **Owner**: diyaeeddine
- **Project ID**: 602e1d16-fa3b-4cde-86a9-4356e16625f2

## 📞 Support

For issues, questions, or contributions, please contact the development team.

---

**Built with ❤️ using React Native and Expo**
