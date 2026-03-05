# Expo Router Migration - Quick Reference

## 📦 Files Changed/Created

### Created Files

```
app/
├── _layout.tsx                          # Root layout with auth routing
├── welcome.tsx                          # Welcome screen wrapper
├── login.tsx                            # Login screen wrapper
├── register.tsx                         # Register screen wrapper
├── add-by-code.tsx                      # Add by code screen wrapper
├── scan-qr.tsx                          # QR scanner screen wrapper
├── (tabs)/
│   ├── _layout.tsx                      # Tab layout configuration
│   ├── index.tsx                        # Home tab
│   ├── collection.tsx                   # Collection tab
│   ├── profile.tsx                      # Profile tab
│   └── admin.tsx                        # Admin tab (conditional)
└── card/
    └── [id].tsx                         # Dynamic card detail route
```

### Modified Files

- ✏️ `App.js` - Removed AppNavigator, kept only AuthProvider
- ✏️ `package.json` - Removed React Navigation packages
- ✏️ `tsconfig.json` - Updated to extend `expo/tsconfig`
- ✏️ `src/screens/WelcomeScreen.js` - Changed to use `useRouter`
- ✏️ `src/screens/LoginScreen.js` - Changed to use `useRouter`
- ✏️ `src/screens/RegisterScreen.js` - Changed to use `useRouter`

### Deleted/Deprecated

- ❌ `src/navigation/AppNavigator.js` - No longer needed

---

## 🔗 Navigation Examples

### Basic Navigation

```javascript
import { useRouter } from "expo-router";

export default function MyScreen() {
  const router = useRouter();

  return (
    <Button
      title="Go to Login"
      onPress={() => router.push("/login")}
    />
  );
}
```

### Navigate with Params

```javascript
// Navigate to card detail
router.push(`/card/${cardId}`);

// Access in target screen
const { id } = useLocalSearchParams();
```

### Go Back

```javascript
router.back();
// or
router.dismissAll(); // Close all modals
```

### Replace Stack

```javascript
// Replace current route instead of pushing
router.replace("/home");
```

---

## 🏗️ Route Structure Map

```
Authentication State
    ├─ User NOT logged in (user === null)
    │   ├─ /welcome      → WelcomeScreen
    │   ├─ /login        → LoginScreen
    │   └─ /register     → RegisterScreen
    │
    └─ User logged in (user !== null)
        ├─ /(tabs)                  → Tab Navigation
        │   ├─ index (home)         → HomeScreen
        │   ├─ collection           → MyCollectionScreen
        │   ├─ profile              → ProfileScreen
        │   └─ admin (if admin)     → AdminScreen
        │
        ├─ /card/[id]               → CardDetailScreen
        ├─ /add-by-code             → AddByCodeScreen (Modal)
        └─ /scan-qr                 → QRScannerAddScreen (Modal)
```

---

## 🔑 Key Concepts

### 1. Layout Groups (Parentheses)
The `(tabs)` folder doesn't appear in URLs—it just groups related screens with shared layout:

```
app/(tabs)/index.tsx       → /(tabs)
app/(tabs)/profile.tsx     → /(tabs)
app/(tabs)/_layout.tsx     → Defines navigation (Tabs)
```

### 2. Dynamic Routes (Square Brackets)
Routes with `[id]` match any value:

```
app/card/[id].tsx  matches:
  /card/1
  /card/abc123
  /card/any-value
```

Access the value:
```typescript
const { id } = useLocalSearchParams();
```

### 3. Root Layout Auth Check
The `app/_layout.tsx` checks `user` state and conditionally renders:

```typescript
{!user ? (
  // Show auth screens
) : (
  // Show main app
)}
```

When `login()` is called in AuthContext, this re-evaluates and automatically shows the main app!

### 4. Conditional Tab Rendering
Admin tab only appears if user is admin:

```typescript
{user?.role === 'admin' && (
  <Tabs.Screen name="admin" ... />
)}
```

---

## 📋 Testing Checklist

Before deploying, verify:

- [ ] App starts without errors: `npm start`
- [ ] Web runs correctly: press `w` in dev terminal
- [ ] Welcome screen appears when not logged in
- [ ] Can navigate to Login screen
- [ ] Can navigate to Register screen
- [ ] Login creates user and shows Home tab
- [ ] Can navigate between tabs (Home, Collection, Profile)
- [ ] Admin tab appears only for admin users
- [ ] Can navigate to card details via dynamic route
- [ ] Add by Code screen opens as modal
- [ ] QR Scanner opens as modal
- [ ] Back button works on modals
- [ ] Logout clears user and returns to Welcome
- [ ] Can refresh browser on web without navigation issues
- [ ] TypeScript compilation has no errors

---

## 🛠️ Common Tasks

### Add a New Screen

1. Create file in `app/` directory
2. Export default component
3. Use `useRouter()` for navigation

```typescript
// app/new-feature.tsx
import { useRouter } from "expo-router";

export default function NewFeature() {
  const router = useRouter();
  
  return (
    <View>
      <Button
        title="Go Back"
        onPress={() => router.back()}
      />
    </View>
  );
}
```

### Add a New Tab

1. Create new file in `app/(tabs)/`
2. Add `<Tabs.Screen>` in `app/(tabs)/_layout.tsx`

```typescript
// app/(tabs)/new-tab.tsx
export default function NewTab() {
  return <View>{/* content */}</View>;
}

// Then in _layout.tsx:
<Tabs.Screen
  name="new-tab"
  options={{
    title: "New Tab",
    tabBarIcon: ({ color }) => (
      <Ionicons name="icon-name" size={24} color={color} />
    ),
  }}
/>
```

### Add a Dynamic Route

1. Create folder: `app/entity/`
2. Create file: `app/entity/[id].tsx`
3. Access param: `const { id } = useLocalSearchParams()`

```typescript
// app/entity/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function EntityDetail() {
  const { id } = useLocalSearchParams();
  
  // Fetch entity with ID
  useEffect(() => {
    loadEntity(id);
  }, [id]);
  
  return <View>{/* display entity */}</View>;
}
```

### Change Navigation Flow

Edit `app/_layout.tsx` to add/remove screens:

```typescript
{!user ? (
  <Stack.Group>
    <Stack.Screen name="welcome" />
    <Stack.Screen name="login" />
    <Stack.Screen name="register" />
    {/* Add new auth screens here */}
  </Stack.Group>
) : (
  <Stack.Group>
    <Stack.Screen name="(tabs)" />
    {/* Add new app screens here */}
  </Stack.Group>
)}
```

---

## 📚 Important Files Reference

| File | Purpose | Edit? |
|------|---------|-------|
| `app/_layout.tsx` | Root auth routing | ⚠️ Careful |
| `app/(tabs)/_layout.tsx` | Tab configuration | ✅ Often |
| `src/auth/AuthContext.js` | Auth logic | ✅ Often |
| `src/screens/*.js` | Screen components | ✅ Often |
| `App.js` | App wrapper | ❌ Rarely |
| `package.json` | Dependencies | ✅ When adding packages |
| `tsconfig.json` | TypeScript config | ❌ Rarely |

---

## 🐛 Debugging Tips

### See all routes
In development, Expo Router lists all available routes in console

### Enable route history
```javascript
// In app/_layout.tsx
import { useNavigationContainerRef } from '@react-navigation/native';
const navigationRef = useNavigationContainerRef();

// Now you can inspect navigationRef in console
```

### Check route params
```typescript
const params = useLocalSearchParams();
console.log('Route params:', params);
```

### Log navigation events
```typescript
import { useEffect } from 'react';

useEffect(() => {
  console.log('Screen mounted');
  return () => console.log('Screen unmounted');
}, []);
```

---

## 📞 Support

If you encounter issues:

1. **Check the MIGRATION_GUIDE.md** for detailed explanations
2. **Verify all files were created** in the `app/` directory
3. **Clear Expo cache:** `rm -rf .expo && npm start`
4. **Check TypeScript errors:** `npm run lint`
5. **Read console logs** - Expo gives helpful error messages

---

## ✅ Migration Completion Status

- ✅ React Navigation removed
- ✅ Expo Router installed and configured
- ✅ File-based routing structure created
- ✅ Authentication-aware routing implemented
- ✅ All screens converted to route files
- ✅ Dynamic routes configured
- ✅ Tab navigation set up
- ✅ Web support enabled
- ✅ TypeScript configuration updated
- ✅ Documentation complete

**Ready to deploy!** 🚀
