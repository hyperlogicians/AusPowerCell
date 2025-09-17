# AusPowerCell - Valves Control App

A modern React Native app built with Expo for controlling and monitoring industrial valves. Features a beautiful iOS-inspired UI with tablet-first design.

## Features

- **Modern UI**: iOS-inspired design with smooth animations and haptic feedback
- **Tablet-First**: Optimized for Samsung tablets with responsive mobile support
- **Real-time Control**: Valve monitoring and control with optimistic updates
- **Offline Support**: Queue commands when connectivity is lost
- **Audit Logging**: Complete activity tracking and timeline view
- **User Management**: Role-based access with activity monitoring
- **Settings**: Comprehensive app configuration including emergency controls

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Expo Router** for navigation
- **NativeWind** (TailwindCSS) for styling
- **React Native Reanimated** for animations
- **Expo Haptics** for tactile feedback

## Project Structure

```
app/
├── (auth)/                 # Authentication screens
│   ├── login.tsx          # Login page
│   └── signup.tsx         # Signup page
├── (tabs)/                # Main app screens
│   ├── index.tsx          # Dashboard
│   ├── audit-logs.tsx     # Audit logs timeline
│   ├── users.tsx          # User management
│   └── settings.tsx       # App settings
└── _layout.tsx            # Root layout

components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   ├── Card.tsx           # Card container
│   ├── Input.tsx          # Form input
│   ├── Switch.tsx         # iOS-style toggle switch
│   └── GradientBackground.tsx # App background
├── ValveCard.tsx          # Valve control component
├── AlertBanner.tsx        # Alert/notification banner
└── LogItem.tsx            # Audit log item

lib/
└── utils.ts               # Utility functions
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on device:**
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

## Key Components

### ValveCard
Interactive card component for valve control with:
- Real-time status indicators
- Toggle switches for open/close
- Quick percentage controls (0%, 25%, 50%, 75%, 100%)
- Alert displays
- Optimistic UI updates

### AlertBanner
Contextual alert system with:
- Multiple alert types (offline, timeout, mismatch, warning, info)
- Dismissible notifications
- Timestamp display
- Color-coded styling

### LogItem
Timeline-style audit log display with:
- User action tracking
- Success/failure status
- Detailed information
- IP address logging
- Timeline visualization

## Design Features

- **Light theme** with linear gradient background (#516679 → #B3BAC0)
- **Glass morphism** UI elements with backdrop blur
- **Smooth animations** using React Native Reanimated
- **Haptic feedback** for all interactions
- **Responsive layout** optimizing for tablets first
- **iOS-style controls** throughout the app

## Authentication

The app includes complete authentication flow with:
- Clean login/signup forms
- Form validation with error states
- Smooth transitions between screens
- Mock authentication (replace with real API)

## Data Management

- **Optimistic updates** for immediate UI feedback
- **Offline queue** for commands when connectivity is lost
- **Real-time status** indicators
- **Mock data** included for development

## Customization

The app is highly customizable through:
- TailwindCSS configuration (`tailwind.config.js`)
- Theme colors and gradients
- Component variants and sizes
- Animation timing and easing

## Production Deployment

Before deploying to production:

1. Replace mock authentication with real API
2. Implement actual valve control endpoints
3. Add real-time WebSocket connections
4. Configure push notifications
5. Add proper error handling and retry logic
6. Implement offline data persistence
7. Add proper security measures

## License

Private project for AusPowerCell.
