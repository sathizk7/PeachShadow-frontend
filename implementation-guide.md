# Implementation Guide: Dynamic Layout Menu System

## Overview
This implementation provides a complete solution for rendering dynamic layout menus from database tables via API, with role-based permissions and hierarchical structure support.

## 🚀 Implementation Steps

### 1. Database Setup

#### A. Create the Database Tables
Execute the SQL scripts in `database-models.md` to create:
- `menu_items` - Core menu structure
- `user_roles` - User roles for permissions  
- `menu_permissions` - Role-based menu access
- Update `users` table with role reference

#### B. Seed Initial Data
```sql
-- Example data insertion
INSERT INTO user_roles (id, role_name, description) VALUES 
('admin', 'Administrator', 'Full system access'),
('user', 'User', 'Limited access');

INSERT INTO menu_items (id, label, icon, link, sort_order, is_header) VALUES
('menu-header', 'Menu', NULL, NULL, 0, true),
('dashboard', 'Dashboards', 'ri-dashboard-2-line', '/#', 1, false),
('analytics', 'Analytics', NULL, '/dashboard-analytics', 1, false);

-- Set parent relationships
UPDATE menu_items SET parent_id = 'dashboard' WHERE id = 'analytics';
```

### 2. Backend Implementation

#### A. Install Dependencies (if not already present)
```bash
cd Katahdin/backend
npm install mongoose express jsonwebtoken
```

#### B. Create Models and Controllers
Copy the implementation from `backend-api-plan.md`:
- Create `models/MenuItem.js`
- Create `controllers/menuController.js` 
- Create `routes/menuRoutes.js`

#### C. Register Routes
Add to `Katahdin/backend/api/index.js`:
```javascript
const menuRoutes = require('../routes/menuRoutes');
app.use('/v1/menus', menuRoutes);
```

### 3. Frontend Implementation

#### A. Install New Service and Hook
The following files are already created:
- `src/services/menuService.ts` - API service layer
- `src/hooks/useDynamicMenu.ts` - Basic hook implementation
- `src/hooks/useDynamicMenuRedux.ts` - Redux-integrated hook
- `src/slices/menu/reducer.ts` - Redux state management

#### B. Update Redux Store
The `src/slices/index.ts` has been updated to include the menu reducer.

#### C. Update Layout Component
Choose one of these approaches:

**Option 1: Basic Hook (Simpler)**
```typescript
// In your layout components, replace static menu with:
import Navdata from './DynamicLayoutMenuData';
```

**Option 2: Redux Integration (Recommended)**
Update `src/Layouts/LayoutMenuData.tsx`:
```typescript
import React from "react";
import { useDynamicMenuRedux } from "../hooks/useDynamicMenuRedux";

const Navdata = () => {
    const { menuItems, loading, error, clearError } = useDynamicMenuRedux();

    if (loading) {
        return (
            <React.Fragment>
                <div className="text-center p-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    if (error) {
        return (
            <React.Fragment>
                <div className="alert alert-danger m-3" role="alert">
                    <h6>Menu Loading Error</h6>
                    <p>{error}</p>
                    <button className="btn btn-sm btn-outline-danger" onClick={clearError}>
                        Retry
                    </button>
                </div>
            </React.Fragment>
        );
    }

    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
```

### 4. Configuration Updates

#### A. API URL Configuration
Ensure `src/config.ts` points to your backend:
```typescript
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

#### B. Authentication Integration
The system automatically uses `getLoggedinUser()` from your existing auth system.

## 🔧 Usage Examples

### Admin Menu Management

Create an admin panel to manage menus:

```typescript
import { useDispatch } from 'react-redux';
import { createMenuItem, updateMenuItem, deleteMenuItem } from '../slices/menu/reducer';

const AdminMenuPanel = () => {
  const dispatch = useDispatch();

  const handleCreateMenu = (menuData) => {
    dispatch(createMenuItem(menuData));
  };

  const handleUpdateMenu = (id, menuData) => {
    dispatch(updateMenuItem({ id, data: menuData }));
  };

  const handleDeleteMenu = (id) => {
    dispatch(deleteMenuItem(id));
  };

  // Your admin UI here
};
```

### Role-Based Access

```sql
-- Grant dashboard access to admin role only
INSERT INTO menu_permissions (menu_item_id, role_id, can_view) 
VALUES ('dashboard', 'admin', true);

-- Grant basic access to user role
INSERT INTO menu_permissions (menu_item_id, role_id, can_view) 
VALUES ('profile', 'user', true);
```

## 🎯 Key Features

✅ **Hierarchical Menu Structure** - Unlimited nesting levels
✅ **Role-Based Permissions** - Control access by user roles  
✅ **Real-time Updates** - Changes reflect immediately
✅ **Redux Integration** - Centralized state management
✅ **Fallback Handling** - Graceful error states
✅ **Type Safety** - Full TypeScript support
✅ **Performance Optimized** - Efficient API calls and rendering

## 🔄 Migration from Static to Dynamic

1. **Backup Current Menu**: Keep `LayoutMenuData.tsx` as `LayoutMenuData.backup.tsx`
2. **Test Implementation**: Use `DynamicLayoutMenuData.tsx` initially  
3. **Gradual Migration**: Replace one menu section at a time
4. **Verify Permissions**: Test with different user roles

## 🛠️ Troubleshooting

### Common Issues

**1. Menu not loading**
- Check API_URL in config.ts
- Verify backend server is running
- Check browser network tab for API errors

**2. Permission errors**
- Ensure user has valid role_id
- Check menu_permissions table data
- Verify JWT token includes user role

**3. Redux state issues**
- Check if Menu reducer is registered in store
- Verify dispatch calls are working
- Use Redux DevTools for debugging

### Debug Mode
Add to development:
```typescript
// In menuService.ts, add logging
console.log('Fetching menus for user:', userId);
console.log('Menu API response:', response);
```

## 📈 Performance Considerations

- **Caching**: Implement Redis caching for frequent menu queries
- **Pagination**: For large menu systems, consider pagination
- **Lazy Loading**: Load submenu items on demand
- **Memoization**: Use React.memo for menu components

This implementation provides a robust foundation for dynamic menu management that can scale with your application needs.