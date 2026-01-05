# Aadhaar VC Event Entry System

A responsive web application to manage event entry by scanning Aadhaar Verifiable Credential (VC) QR codes.

## Features

- **Home Page**: Simple interface with a "Scan Aadhaar VC QR" button.
- **QR Scanner**: Built-in camera-based QR code scanner.
- **Verification**: Immediate feedback on scan (Verified vs. Invalid).
- **Privacy First**: 
    - No Aadhaar numbers are stored.
    - No personal data is extracted or stored.
    - Only verification status and timestamp are recorded.
- **Admin Dashboard**: Real-time view of total entries and entry logs.
- **Responsive Design**: Works perfectly on mobile and desktop.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Firebase Firestore (with LocalStorage fallback for demo)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **QR Scanning**: html5-qrcode

## Getting Started

### Prerequisites

- Node.js installed

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Firebase Setup (Optional)

To enable persistent data storage across sessions:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
2. Create a Firestore database.
3. Register a web app in your Firebase project.
4. Copy your Firebase configuration.
5. Update `src/firebase.ts` with your credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Privacy & Security

This application is designed to respect user privacy. It does not extract or store any sensitive information from the Aadhaar QR code. It only verifies the validity of the credential and logs the event (Status + Time).
