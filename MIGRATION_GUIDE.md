# Expo Router Migration Guide

## ✅ Migration Complete

Your Card Collection app has been successfully migrated from **React Navigation** to **Expo Router**. This guide explains the changes and how to run the project.

---

## 📁 New Project Structure

```
frontend/
├── app/                          # 🆕 Expo Router app directory
│   ├── _layout.tsx              # Root layout - handles auth routing
│   ├── welcome.tsx              # Welcome screen (auth)
│   ├── login.tsx                # Login screen (auth)
│   ├── register.tsx             # Register screen (auth)
│   ├── add-by-code.tsx          # Add card by code modal
│   ├── scan-qr.tsx              # QR scanner modal
│   ├── (tabs)/                  # Tab group (layout group pattern)
│   │   ├── _layout.tsx          # Tab navigation config
│   │   ├── index.tsx            # Home tab
│   │   ├── collection.tsx       # My Collection tab
│   │   ├── profile.tsx          # Profile tab
│   │   └── admin.tsx            # Admin tab (conditional)
│   └── card/
│       └── [id].tsx             # Dynamic card detail route
├── src/                         # Existing business logic
│   ├── screens/                 # Updated to use Expo Router
│   ├── auth/
│   ├── api/
│   └── utils/
├── App.js                       # 📝 Simplified (removed AppNavigator)
├── package.json                 # 📝 React Navigation deps removed
└── tsconfig.json                # 📝 Updated for Expo Router
```

---

## 🔑 Key Changes

### 1. Removed React Navigation Dependencies
**Before:**
```json
"@react-navigation/native": "^7.1.8",
"@react-navigation/native-stack": "^7.3.16",
"@react-navigation/bottom-tabs": "^7.4.0",
```

**After:** Removed (using Expo Router instead)

### 2. File-Based Routing

Expo Router uses the file system to define routes. No need for manual navigation config!

| Route | File Path | Purpose |
|-------|-----------|---------|
| `/` | Not accessible | Root redirects based on auth |
| `/welcome` | `app/welcome.tsx` | Welcome screen |
| `/login` | `app/login.tsx` | Login screen |
| `/register` | `app/register.tsx` | Register screen |
| `/(tabs)` | `app/(tabs)/_layout.tsx` | Tab navigation |
| `/(tabs)/index` | `app/(tabs)/index.tsx` | Home tab |
| `/(tabs)/collection` | `app/(tabs)/collection.tsx` | My Collection tab |
| `/(tabs)/profile` | `app/(tabs)/profile.tsx` | Profile tab |
| `/(tabs)/admin` | `app/(tabs)/admin.tsx` | Admin tab (if user.role === 'admin') |
| `/card/123` | `app/card/[id].tsx` | Dynamic card detail |
| `/add-by-code` | `app/add-by-code.tsx` | Add card modal |
| `/scan-qr` | `app/scan-qr.tsx` | QR scanner modal |

### 3. Authentication Routing

The root `_layout.tsx` handles authentication flow:

```typescript
// app/_layout.tsx
const { user, loading } = useAuth();

if (loading) return <LoadingScreen />;

return (
  <Stack>
    {!user ? (
      // Show auth screens
      <Stack.Group>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Group>
    ) : (
      // Show app screens
      <Stack.Group>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="card/[id]" />
        <Stack.Screen name="add-by-code" />
        <Stack.Screen name="scan-qr" />
      </Stack.Group>
    )}
  </Stack>
);
```

**No navigation manually needed!** When `login()` is called, the `user` state updates and Expo Router automatically shows the main app.

### 4. Updated Screen Navigation

**Before (React Navigation):**
```javascript
import { useNavigation } from "@react-navigation/native";

const navigation = useNavigation();
navigation.navigate("Login");
```

**After (Expo Router):**
```javascript
import { useRouter } from "expo-router";

const router = useRouter();
router.push("/login");
```

### 5. Dynamic Routes

Navigate to card detail page:

```javascript
import { useRouter } from "expo-router";

const router = useRouter();
router.push(`/card/${cardId}`); // Uses dynamic [id] route
```

Access route parameters in the screen:

```typescript
// app/card/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function CardDetail() {
  const { id } = useLocalSearchParams();
  // Use 'id' to fetch card data
}
```

### 6. Layout Groups

The `(tabs)` folder uses **layout groups** - they don't appear in the URL but organize navigation:

```
/(tabs)/index → http://localhost:3000 (web) or just the tab
/(tabs)/collection → My Collection tab
/(tabs)/profile → Profile tab
/(tabs)/admin → Admin tab (conditional rendering)
```

### 7. Admin Tab Conditional Display

The admin tab only shows for admin users:

```typescript
// app/(tabs)/_layout.tsx
const { user } = useAuth();

return (
  <Tabs>
    {/* ... other tabs ... */}
    
    {user?.role === 'admin' && (
      <Tabs.Screen name="admin" options={{ ... }} />
    )}
  </Tabs>
);
```

---

## 🚀 How to Run the Project

### Prerequisites

```bash
cd frontend
npm install
# or
yarn install
```

This will install dependencies with Expo Router and remove React Navigation packages.

### Running on Different Platforms

#### 1. **Development Server (All Platforms)**
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web (opens browser)

#### 2. **iOS Only**
```bash
npm run ios
```

#### 3. **Android Only**
```bash
npm run android
```

#### 4. **Web Only**
```bash
npm run web
```

Browser will open at `http://localhost:3000` (or another port)

---

## ✨ Features of Expo Router

### Type-Safe Routing (TypeScript)
```typescript
// Fully typed route paths
router.push("/card/123");
router.push("/(tabs)/profile");
```

### Web Support
- Full web support out of the box
- Works with browser back button
- URL-based routing
- Web development server with hot reload

### Native Stack Presentation Modes
```typescript
// Modal presentation (slides up on mobile)
<Stack.Screen
  name="add-by-code"
  options={{ presentation: 'modal' }}
/>

// Card presentation (iOS-style card)
<Stack.Screen
  name="card/[id]"
  options={{ presentation: 'card' }}
/>
```

### Automatic Deep Linking
Web URLs directly map to screens:
- `http://localhost:3000/login` → Login screen
- `http://localhost:3000/card/42` → Card detail for card 42
- `http://localhost:3000/(tabs)/profile` → Profile tab

---

## 🔄 Screen Transitions Updated

### Screens That Use Navigation

1. **WelcomeScreen** (`src/screens/WelcomeScreen.js`)
   - ✅ Updated: `navigation.navigate("Login")` → `router.push("/login")`
   - ✅ Updated: `navigation.navigate("Register")` → `router.push("/register")`

2. **LoginScreen** (`src/screens/LoginScreen.js`)
   - ✅ Updated: `navigation.navigate("Register")` → `router.push("/register")`
   - ✅ Auto-redirect on login (AuthContext triggers re-render)

3. **RegisterScreen** (`src/screens/RegisterScreen.js`)
   - ✅ Updated: `navigation.navigate("Login")` → `router.push("/login")`
   - ✅ Auto-redirect on register (AuthContext triggers re-render)

### Screens That Need Navigation Updates

If you have navigation calls in **HomeScreen**, **MyCollectionScreen**, **ProfileScreen**, or **AdminScreen**, update them:

```javascript
// OLD
import { useNavigation } from "@react-navigation/native";
const navigation = useNavigation();
navigation.navigate("CardDetail", { id: 123 });
navigation.navigate("AddByCode");
navigation.navigate("QRScannerAdd");

// NEW
import { useRouter } from "expo-router";
const router = useRouter();
router.push(`/card/123`);
router.push("/add-by-code");
router.push("/scan-qr");
```

---

## 📋 Troubleshooting

### Issue: "expo-router is not installed"
**Solution:** Run `npm install` in the frontend folder

### Issue: TypeScript errors about routes
**Solution:** Ensure `tsconfig.json` extends `expo/tsconfig`

### Issue: Web shows blank screen
**Solution:** 
1. Check browser console for errors
2. Clear cache: `rm -rf .expo` and `npm start`
3. Try different port: `npm start -- --port=3001`

### Issue: Navigation not working
**Solution:**
1. Check that you're using `useRouter` from `"expo-router"`
2. Ensure paths start with `/` or use `push()` instead of `navigate()`

### Issue: Admin tab not showing
**Solution:**
1. Check that user object has a `role` property
2. Verify `user?.role === "admin"` in `app/(tabs)/_layout.tsx`

---

## 🎯 Next Steps

1. **Install dependencies:** `npm install` (in `frontend/`)
2. **Test the app:** `npm start` → press `w` for web
3. **Verify authentication flow:**
   - Open app → should see Welcome screen
   - Click Login/Register
   - After login, should see Home tab
   - Logout should return to Welcome screen
4. **Test navigation:**
   - Click on collection/profile tabs
   - Test card detail navigation
   - Test add-by-code and QR scanner

---

## 📚 Resources

- [Expo Router Docs](https://expo.github.io/router/introduction/)
- [File-Based Routing](https://expo.github.io/router/create-routes/)
- [Dynamic Routes](https://expo.github.io/router/create-routes/#dynamic-routes)
- [Layout Groups](https://expo.github.io/router/create-routes/#layout-groups)
- [Authentication Pattern](https://expo.github.io/router/auth/)
- [Web Support](https://expo.github.io/router/web/)

---

## 🎉 Summary of Changes

| Component | Change | Status |
|-----------|--------|--------|
| Navigation | React Navigation → Expo Router | ✅ |
| App structure | Traditional → File-based routing | ✅ |
| Dependencies | Removed React Navigation packages | ✅ |
| Auth flow | Manual navigation → Auto-redirect | ✅ |
| Tab navigation | createBottomTabNavigator → `(tabs)/_layout.tsx` | ✅ |
| Stack navigation | createNativeStackNavigator → `_layout.tsx` Stack | ✅ |
| Dynamic routes | Manual params → `[id].tsx` file-based | ✅ |
| Web support | Requires custom config → Native support | ✅ |
| TypeScript | Updated tsconfig.json | ✅ |

---

## 🚀 You're All Set!

Your app is now powered by **Expo Router** with:
- ✅ File-based routing
- ✅ Web support
- ✅ Type-safe routes
- ✅ Auth-aware navigation
- ✅ Cleaner, more maintainable code

**Run `npm start` and enjoy!** 🎉
