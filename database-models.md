# Database Models for Dynamic Layout Menu System

## 1. MenuItems Table

```sql
CREATE TABLE menu_items (
    id VARCHAR(36) PRIMARY KEY,
    parent_id VARCHAR(36) NULL,
    label VARCHAR(255) NOT NULL,
    icon VARCHAR(100) NULL,
    link VARCHAR(255) NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_header BOOLEAN DEFAULT false,
    badge_name VARCHAR(50) NULL,
    badge_color VARCHAR(20) NULL,
    sub_items VARCHAR(100) NULL,
    permissions TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active)
);
```

## 2. UserRoles Table

```sql
CREATE TABLE user_roles (
    id VARCHAR(36) PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 3. MenuPermissions Table

```sql
CREATE TABLE menu_permissions (
    id VARCHAR(36) PRIMARY KEY,
    menu_item_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    can_view BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_menu_role (menu_item_id, role_id),
    INDEX idx_menu_item_id (menu_item_id),
    INDEX idx_role_id (role_id)
);
```

## 4. Users Table (Extension)

```sql
-- Add to existing users table or create if not exists
ALTER TABLE users ADD COLUMN role_id VARCHAR(36) NULL;
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES user_roles(id);
```

## Sample Data Structure

```javascript
// Example menu structure in JSON format
[
    {
        id: "dashboard",
        parent_id: null,
        label: "Dashboards",
        icon: "ri-dashboard-2-line",
        link: "/#",
        sort_order: 1,
        is_active: true,
        is_header: false,
        badge_name: null,
        badge_color: null,
        sub_items: "dashboard-submenu",
        permissions: ["admin", "user"]
    },
    {
        id: "analytics",
        parent_id: "dashboard",
        label: "Analytics",
        icon: null,
        link: "/dashboard-analytics",
        sort_order: 1,
        is_active: true,
        is_header: false,
        badge_name: null,
        badge_color: null,
        sub_items: null,
        permissions: ["admin"]
    },
    {
        id: "menu-header",
        parent_id: null,
        label: "Menu",
        icon: null,
        link: null,
        sort_order: 0,
        is_active: true,
        is_header: true,
        badge_name: null,
        badge_color: null,
        sub_items: null,
        permissions: ["admin", "user"]
    }
]
```