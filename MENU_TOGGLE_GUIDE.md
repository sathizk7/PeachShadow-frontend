# Menu Toggle Implementation Guide

## 🔧 Configuration Options

The menu toggle system provides multiple ways to switch between dynamic and static menus:

### 1. Environment Variables (Build Time)

Add to your `.env` file:

```env
# Enable dynamic menu by default
REACT_APP_USE_DYNAMIC_MENU=true

# Enable fallback to static menu if dynamic fails
REACT_APP_FALLBACK_TO_STATIC=true
```

### 2. Runtime Configuration (Development/Admin)

Enable runtime toggling for development or admin users.

## 📋 Implementation Options

### Option 1: Simple Configuration Toggle (Recommended)

Replace your existing `LayoutMenuData` import with the unified version:

```typescript
// In your layout component (e.g., src/Layouts/VerticalLayout.tsx)
import UnifiedMenuData from './UnifiedMenuData';

// Use instead of:
// import Navdata from './LayoutMenuData';

const VerticalLayout = () => {
  return (
    <div>
      {/* Your layout structure */}
      <UnifiedMenuData />
    </div>
  );
};
```

### Option 2: Context-Based Toggle (Advanced)

For runtime control and admin settings:

```typescript
// In your App.tsx or root component
import { MenuConfigProvider } from './contexts/MenuConfigContext';

function App() {
  return (
    <MenuConfigProvider enableRuntimeToggle={true}>
      {/* Your app content */}
      <Routes>
        {/* Your routes */}
      </Routes>
    </MenuConfigProvider>
  );
}

// In your layout component
import ContextualMenuData from './ContextualMenuData';

const VerticalLayout = () => {
  return (
    <div>
      <ContextualMenuData />
    </div>
  );
};
```

### Option 3: Admin Control Panel

Add menu configuration to your admin panel:

```typescript
// In your admin settings page
import { MenuToggle } from '../components/MenuToggle';
import { MenuConfigProvider } from '../contexts/MenuConfigContext';

const AdminSettings = () => {
  return (
    <MenuConfigProvider enableRuntimeToggle={true}>
      <div className="row">
        <div className="col-md-6">
          <MenuToggle variant="card" />
        </div>
        <div className="col-md-6">
          {/* Other settings */}
        </div>
      </div>
    </MenuConfigProvider>
  );
};
```

## 🎛️ MenuToggle Component Variants

### Card Variant (Default)
```typescript
<MenuToggle variant="card" className="mb-4" />
```

### Inline Variant
```typescript
<MenuToggle 
  variant="inline" 
  className="d-flex justify-content-end" 
  showLabels={true}
  size="sm"
/>
```

### Dropdown Variant
```typescript
<MenuToggle 
  variant="dropdown" 
  className="me-2"
  size="md"
/>
```

## 🔄 Migration Strategies

### 1. Gradual Migration (Safest)

Start with environment variable control:

```env
# .env.local (for testing)
REACT_APP_USE_DYNAMIC_MENU=false
REACT_APP_FALLBACK_TO_STATIC=true
```

Then gradually enable:
1. Test with fallback enabled
2. Enable dynamic menu for testing
3. Deploy with dynamic menu as default

### 2. A/B Testing

Use feature flags or user roles:

```typescript
// Custom hook for feature flags
const useFeatureFlag = (flag: string) => {
  // Your feature flag logic
  return flags[flag] || false;
};

const ConditionalMenuData = () => {
  const isDynamicMenuEnabled = useFeatureFlag('dynamic-menu');
  
  return isDynamicMenuEnabled ? 
    <UnifiedMenuData /> : 
    <Navdata />; // Static fallback
};
```

## 🛠️ Development Tools

### Debug Mode Indicators

In development mode, the components show small indicators:
- 🟢 "Dynamic Menu" when dynamic menu is active
- 🔵 "Static Menu" when static menu is used by choice
- 🔴 "Static Menu (Fallback)" when dynamic menu failed

### localStorage Persistence

When runtime toggle is enabled, settings persist across sessions:

```javascript
// Check current settings
console.log(localStorage.getItem('menuConfig'));

// Reset settings
localStorage.removeItem('menuConfig');
```

## 📊 Monitoring & Analytics

Add usage tracking:

```typescript
// In your analytics service
const trackMenuType = (menuType: 'static' | 'dynamic' | 'fallback') => {
  // Your analytics implementation
  analytics.track('menu_type_used', { type: menuType });
};

// Use in your menu components
useEffect(() => {
  if (isUsingDynamicMenu) {
    trackMenuType(error ? 'fallback' : 'dynamic');
  } else {
    trackMenuType('static');
  }
}, [isUsingDynamicMenu, error]);
```

## 🔍 Testing

Test different configurations:

```bash
# Test static menu
REACT_APP_USE_DYNAMIC_MENU=false npm start

# Test dynamic menu
REACT_APP_USE_DYNAMIC_MENU=true npm start

# Test fallback behavior (with backend stopped)
REACT_APP_USE_DYNAMIC_MENU=true REACT_APP_FALLBACK_TO_STATIC=true npm start
```

## ⚡ Performance Considerations

### 1. Bundle Size
The static menu is always included as fallback, so no bundle size increase.

### 2. Network Requests
Dynamic menu only makes API calls when enabled.

### 3. Memory Usage
Redux state only loads when dynamic menu is active.

## 🚨 Error Handling

The system provides multiple fallback levels:
1. **Dynamic Menu Error** → Show error message with retry
2. **Fallback Enabled** → Switch to static menu automatically  
3. **Network Issues** → Graceful degradation with indicators
4. **Invalid Data** → Type-safe error boundaries

## 📈 Production Deployment

### Environment Configuration

```env
# Production .env
REACT_APP_USE_DYNAMIC_MENU=true
REACT_APP_FALLBACK_TO_STATIC=true
REACT_APP_API_URL=https://your-api.com
```

### Health Checks

Monitor menu system health:

```typescript
// Menu health endpoint
GET /v1/menus/health

// Response
{
  "status": "healthy",
  "menuCount": 25,
  "lastUpdate": "2025-12-18T15:30:00Z"
}
```

## 🎯 Best Practices

1. **Always enable fallback in production**
2. **Test error scenarios thoroughly**
3. **Monitor menu load performance**
4. **Use environment variables for default configuration**
5. **Provide admin controls for runtime toggling**
6. **Log menu type usage for analytics**
7. **Cache dynamic menu data appropriately**

This implementation provides a robust, flexible system that can adapt to different deployment scenarios while maintaining excellent user experience! 🎉