# Backend API Implementation Plan for Dynamic Menus

## API Endpoints Structure

### 1. Menu Routes (`/v1/menus`)

```javascript
// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getMenusByUser, 
    getAllMenus, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    getMenuHierarchy 
} = require('../controllers/menuController');

// Public routes
router.get('/user/:userId', getMenusByUser);           // Get menus for specific user based on role
router.get('/hierarchy', getMenuHierarchy);           // Get full menu hierarchy

// Admin routes (require admin role)
router.get('/', getAllMenus);                         // Get all menu items
router.post('/', createMenuItem);                     // Create new menu item
router.put('/:id', updateMenuItem);                   // Update menu item
router.delete('/:id', deleteMenuItem);                // Delete menu item

module.exports = router;
```

### 2. Menu Controller (`controllers/menuController.js`)

```javascript
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Get menus for a specific user based on their role
exports.getMenusByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get user with role
        const user = await User.findById(userId).populate('role_id');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get menu items based on user role permissions
        const menuItems = await MenuItem.aggregate([
            // Match active menu items
            { $match: { is_active: true } },
            
            // Lookup permissions
            {
                $lookup: {
                    from: 'menu_permissions',
                    localField: '_id',
                    foreignField: 'menu_item_id',
                    as: 'permissions'
                }
            },
            
            // Filter by user role permissions
            {
                $match: {
                    $or: [
                        { permissions: { $size: 0 } }, // Public menus
                        { 'permissions.role_id': user.role_id._id, 'permissions.can_view': true }
                    ]
                }
            },
            
            // Sort by sort_order
            { $sort: { sort_order: 1 } }
        ]);

        // Build hierarchical structure
        const hierarchy = buildMenuHierarchy(menuItems);
        
        res.json({
            success: true,
            data: hierarchy
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Build hierarchical menu structure
function buildMenuHierarchy(items) {
    const itemMap = new Map();
    const roots = [];

    // Create map of all items
    items.forEach(item => {
        itemMap.set(item.id, { ...item, subItems: [] });
    });

    // Build hierarchy
    items.forEach(item => {
        if (item.parent_id) {
            const parent = itemMap.get(item.parent_id);
            if (parent) {
                parent.subItems.push(itemMap.get(item.id));
            }
        } else {
            roots.push(itemMap.get(item.id));
        }
    });

    return roots;
}

// Get full menu hierarchy (admin use)
exports.getMenuHierarchy = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ is_active: true })
            .sort({ sort_order: 1 });
        
        const hierarchy = buildMenuHierarchy(menuItems);
        
        res.json({
            success: true,
            data: hierarchy
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Create new menu item
exports.createMenuItem = async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        
        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!menuItem) {
            return res.status(404).json({ 
                success: false, 
                message: 'Menu item not found' 
            });
        }
        
        res.json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findByIdAndDelete(id);
        
        if (!menuItem) {
            return res.status(404).json({ 
                success: false, 
                message: 'Menu item not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
```

### 3. Mongoose Models

```javascript
// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        default: null
    },
    label: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
    },
    sort_order: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_header: {
        type: Boolean,
        default: false
    },
    badge_name: {
        type: String,
        default: null
    },
    badge_color: {
        type: String,
        default: null
    },
    sub_items: {
        type: String,
        default: null
    },
    permissions: [{
        type: String
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

menuItemSchema.index({ parent_id: 1 });
menuItemSchema.index({ sort_order: 1 });
menuItemSchema.index({ is_active: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
```

### 4. Integration with existing auth system

```javascript
// Modify existing auth middleware to include role-based menu access
// middleware/authMiddleware.js (addition to existing)

const getMenusForUser = async (userId) => {
    const response = await fetch(`${API_URL}/v1/menus/user/${userId}`);
    return response.json();
};

module.exports = {
    // existing exports...
    getMenusForUser
};
```