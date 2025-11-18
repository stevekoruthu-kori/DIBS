# 🔐 DIBS Authentication System

## Overview
Premium login page with neon cyber-streetwear design, integrated with `useAuth()` hook.

---

## 🎯 Features Implemented

### ✅ Authentication Context (`AuthContext.jsx`)
```javascript
import { useAuth } from './context/AuthContext';

const { login, logout, user, isAuthenticated, loading } = useAuth();
```

#### Available Methods:
- **`login(credentials)`** - Authenticate user
  - Accepts: `{ email, phone, name }`
  - Returns: `{ success: true/false, user, error }`
  - Saves user to localStorage
  
- **`logout()`** - Clear user session
  - Removes user data
  - Clears localStorage
  
- **`signup(credentials)`** - Register new user
  - Same as login for now (ready for backend)
  
- **`isAuthenticated`** - Boolean, true if user logged in
- **`user`** - Current user object
- **`loading`** - Loading state

---

## 🎨 Login Page Design

### Premium Features:
1. **Animated Background**
   - Rotating gradient orbs (cyan & pink)
   - Cyberpunk grid overlay
   - 15-20s animation cycles

2. **Glassmorphism Card**
   - Frosted glass effect with backdrop blur
   - Rainbow gradient glow border
   - Premium shadow layers

3. **Dual Login Methods**
   - Toggle between Phone & Email
   - Smooth tab transitions
   - Neon cyan active state

4. **Form Fields**
   - Name input (optional)
   - Phone/Email input (required)
   - Real-time validation
   - Neon cyan focus states

5. **Premium CTA Button**
   - Animated gradient background (3s cycle)
   - Glow effect on hover
   - Loading state with spinning ⚡
   - "ENTER LIVE DROP" text

6. **Social Login**
   - Google & Apple quick login
   - Glass button style
   - Instant authentication

7. **Error Handling**
   - Animated error messages
   - Neon pink warning style
   - Clear user feedback

---

## 🔌 Integration Guide

### How It Works:

1. **App Startup**
   - `AuthProvider` wraps entire app
   - Checks localStorage for existing session
   - Auto-restores user if found

2. **Login Flow**
   ```javascript
   // User clicks login button
   const result = await login({ 
     phone: '+1234567890',
     email: 'user@example.com',
     name: 'John Doe'
   });
   
   if (result.success) {
     // Redirects to landing page automatically
     console.log('Logged in:', result.user);
   }
   ```

3. **Protected Routes**
   ```javascript
   // App checks isAuthenticated
   if (!isAuthenticated) {
     return <LoginPage />; // Show login
   }
   
   // User is logged in, show main app
   return <LandingPage />;
   ```

4. **User Badge**
   - Top-right corner shows user avatar + name
   - Logout button (🚪) visible
   - Persists across all screens

---

## 🚀 Usage Examples

### Example 1: Phone Login
```javascript
const { login } = useAuth();

await login({
  phone: '+1 (555) 123-4567',
  name: 'Alex Street'
});
```

### Example 2: Email Login
```javascript
const { login } = useAuth();

await login({
  email: 'alex@dibs.com',
  name: 'Alex Street'
});
```

### Example 3: Check Auth Status
```javascript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log(`Welcome back, ${user.name}!`);
}
```

### Example 4: Logout
```javascript
const { logout } = useAuth();

<button onClick={logout}>
  Sign Out
</button>
```

---

## 🔥 What Happens When You Click Login Button

```javascript
// 1. User fills form and clicks "ENTER LIVE DROP"
handleLogin() {
  // 2. Validates form data
  if (!formData.phone && !formData.email) {
    setError('Please enter contact info');
    return;
  }
  
  // 3. Calls useAuth().login()
  const result = await login({
    phone: formData.phone,
    email: formData.email,
    name: formData.name
  });
  
  // 4. If success:
  if (result.success) {
    // - User saved to state
    // - User saved to localStorage
    // - onLoginSuccess() callback fires
    // - App re-renders and shows Landing Page
  }
}
```

---

## 📦 File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Authentication logic & provider
├── screens/
│   └── LoginPage.jsx            # Premium login UI
└── App_Neon.jsx                 # Main app with auth check
```

---

## 🎯 Current Flow

```
App Starts
    ↓
Check isAuthenticated
    ↓
┌─────────────────┐
│ NOT Authenticated │ → Show LoginPage
└─────────────────┘       ↓
                    User Enters Info
                          ↓
                    Clicks "ENTER LIVE DROP"
                          ↓
                    login() called
                          ↓
                    ✅ Success
                          ↓
                    Redirect to Landing Page
                          ↓
┌─────────────────┐
│ IS Authenticated  │ → Show Main App
└─────────────────┘       ↓
                    User badge visible (top-right)
                    Can access all screens
```

---

## 🔮 Ready for Backend Integration

### Replace Mock Auth with Firebase:

```javascript
// In AuthContext.jsx
const login = async (credentials) => {
  try {
    // Replace this mock with real Firebase auth
    const userCredential = await signInWithPhoneNumber(
      auth, 
      credentials.phone
    );
    
    const userData = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      phone: userCredential.user.phoneNumber,
      name: credentials.name
    };
    
    setUser(userData);
    return { success: true, user: userData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 🎨 Design Specifications

### Colors:
- **Primary Button**: Neon Cyan (#00F0FF)
- **Error State**: Neon Pink (#FF007A)
- **Success State**: Electric Mint (#00FF85)
- **Background**: Black (#000000) with gradient orbs

### Animations:
- Background orbs: 15-20s rotation cycles
- Card entrance: Spring animation (0.9 scale → 1.0)
- Button: 3s gradient slide
- Loading: 1s spinning lightning bolt

### Typography:
- Headings: Urbanist (font-black, 900 weight)
- Body: Inter (regular to bold)
- Inputs: Inter (400 weight)

---

## ✅ What You Have Now

✅ **Premium login page** with neon aesthetic
✅ **useAuth() hook** ready to use anywhere
✅ **Persistent sessions** (localStorage)
✅ **Protected routes** (auto-redirect to login)
✅ **User badge** with logout button
✅ **Loading states** and error handling
✅ **Social login buttons** (Google, Apple)
✅ **Mobile-optimized** form design
✅ **Backend-ready** structure

---

## 🎮 Test Instructions

1. **Refresh browser** at http://localhost:3000
2. **You'll see login page** automatically
3. **Enter any name** (e.g., "Alex")
4. **Enter phone or email** (can be fake for testing)
5. **Click "ENTER LIVE DROP"**
6. **Watch loading animation** (1 second)
7. **You're now logged in!** See your badge in top-right
8. **Click 🚪 to logout** and return to login page

---

**Status**: ✅ AUTHENTICATION COMPLETE
**Integration**: Ready for Firebase/backend
**Security**: localStorage + context API
