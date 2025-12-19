# Layout Testing Guide for Dynamic Menu Implementation

## 🧪 Testing All Layout Types with Dynamic/Static Menus

### **Layout Types Available:**
1. **Vertical Layout** (default) - `LAYOUT_TYPES.VERTICAL`
2. **Horizontal Layout** - `LAYOUT_TYPES.HORIZONTAL` 
3. **Two Column Layout** - `LAYOUT_TYPES.TWOCOLUMN`

### **How to Switch Layouts:**

**Method 1: Via Layout Settings (in UI)**
1. Go to the right sidebar settings panel (gear icon)
2. Under "Layout" section, select:
   - **Vertical** (sidebar layout)
   - **Horizontal** (top navbar layout)  
   - **Two Column** (icon sidebar + details sidebar)

**Method 2: Programmatically (for testing)**
```javascript
// Open browser console and run:
// Switch to Horizontal
dispatch(changeLayout('horizontal'));

// Switch to Vertical  
dispatch(changeLayout('vertical'));

// Switch to Two Column
dispatch(changeLayout('twocolumn'));
```

### **Test Cases for Each Layout:**

#### **🔴 Test 1: Dynamic Menu (Backend ON)**
1. **Start backend server**
2. **Set environment variables:**
   ```env
   REACT_APP_USE_DYNAMIC_MENU=true
   REACT_APP_FALLBACK_TO_STATIC=true
   ```
3. **Test each layout:**

   **Vertical Layout:**
   - ✅ Should see "🌐 Dynamic Menu" indicator
   - ✅ Menu Item → Sub Menu 1 → Sub Menu 1.1 → Sub Menu 2.1 (multi-level)
   - ✅ All other dynamic menus expand properly

   **Horizontal Layout:**
   - ✅ Should see "🌐 Dynamic Menu" indicator in navbar
   - ✅ First 6 menus visible, rest in "More" dropdown
   - ✅ Dynamic menus work in dropdown

   **Two Column Layout:**
   - ✅ Should see "🌐 Dynamic Menu" indicator at top
   - ✅ Icons in left column, details in right column
   - ✅ Dynamic menu expansion works

#### **🟡 Test 2: Static Fallback (Backend OFF)**
1. **Stop backend server**
2. **Same environment variables as above**
3. **Test each layout:**

   **All Layouts Should Show:**
   - ✅ "📁 Static Menu" indicator 
   - ✅ Complete static menu structure (14 main items)
   - ✅ Multi Level → Level 1.2 → Level 2.2 → Level 3.1/3.2
   - ✅ All menu categories work (Dashboards, Apps, Pages, etc.)

#### **🔵 Test 3: Static Only Mode**
1. **Set environment:**
   ```env
   REACT_APP_USE_DYNAMIC_MENU=false
   ```
2. **All layouts should show static menu regardless of backend status**

### **🐛 What to Look For:**

**✅ Success Indicators:**
- Development indicator shows correct status
- No console errors
- Menu expansion/collapse works
- Multi-level menus work in all layouts
- Navigation links work

**❌ Failure Indicators:**
- Console errors about menu rendering
- Missing menu items
- Menu expansion not working
- Development indicator missing or wrong
- "Loading Menu..." stuck forever

### **📊 Expected Behavior by Layout:**

| Layout | Dynamic Menu | Static Menu | Multi-level | Indicator Location |
|--------|-------------|-------------|-------------|-------------------|
| Vertical | ✅ API calls | ✅ Complete fallback | ✅ 3+ levels | Top of sidebar |
| Horizontal | ✅ API calls | ✅ Complete fallback | ✅ In dropdowns | Top navbar |  
| Two Column | ✅ API calls | ✅ Complete fallback | ✅ Right panel | Top of layout |

### **🔧 Debugging Console Commands:**
```javascript
// Check current layout
console.log(store.getState().Layout.layoutType);

// Check menu data
console.log(useMenuData());

// Force refresh menu
window.location.reload();
```

### **📝 Test Checklist:**
- [ ] Vertical + Dynamic Menu
- [ ] Vertical + Static Fallback  
- [ ] Horizontal + Dynamic Menu
- [ ] Horizontal + Static Fallback
- [ ] Two Column + Dynamic Menu
- [ ] Two Column + Static Fallback
- [ ] Layout switching preserves menu state
- [ ] Multi-level works in all layouts
- [ ] Development indicators correct
- [ ] No console errors

**All three layouts now support the unified dynamic/static menu system!** 🎉