// Alternative MongoDB script with more control
// Customize the collection name and field values as needed

// Configuration
const COLLECTION_NAME = "menus"; // Change this to your actual collection name
const SUB_MENU_1_ID = ObjectId("69441f1dd77e3797b66e354d");
const LEVEL_2_2_ID = ObjectId("69441f1dd77e3797b66e9999"); // Fixed ID for referencing

// Insert Level 2 items
const level2Items = [
  {
    "_id": ObjectId(),
    "parent_id": SUB_MENU_1_ID,
    "label": "Level 2.1",
    "icon": null,
    "link": "/level-2-1", // Customize these links as needed
    "sort_order": 1,
    "is_active": true,
    "is_header": false,
    "badge_name": null,
    "badge_color": null,
    "sub_items": null,
    "permissions": [],
    "admin_only": false,
    "__v": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": LEVEL_2_2_ID, // Fixed ID so we can reference it for Level 3 items
    "parent_id": SUB_MENU_1_ID,
    "label": "Level 2.2",
    "icon": null,
    "link": "/level-2-2",
    "sort_order": 2,
    "is_active": true,
    "is_header": false,
    "badge_name": null,
    "badge_color": null,
    "sub_items": null,
    "permissions": [],
    "admin_only": false,
    "__v": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
];

// Insert Level 3 items (children of Level 2.2)
const level3Items = [
  {
    "_id": ObjectId(),
    "parent_id": LEVEL_2_2_ID,
    "label": "Level 3.1",
    "icon": null,
    "link": "/level-3-1",
    "sort_order": 1,
    "is_active": true,
    "is_header": false,
    "badge_name": null,
    "badge_color": null,
    "sub_items": null,
    "permissions": [],
    "admin_only": false,
    "__v": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  },
  {
    "_id": ObjectId(),
    "parent_id": LEVEL_2_2_ID,
    "label": "Level 3.2",
    "icon": null,
    "link": "/level-3-2",
    "sort_order": 2,
    "is_active": true,
    "is_header": false,
    "badge_name": null,
    "badge_color": null,
    "sub_items": null,
    "permissions": [],
    "admin_only": false,
    "__v": 0,
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
];

// Execute insertions
try {
  // Insert Level 2 items
  const result2 = db[COLLECTION_NAME].insertMany(level2Items);
  print("✅ Inserted " + result2.insertedIds.length + " Level 2 menu items");

  // Insert Level 3 items
  const result3 = db[COLLECTION_NAME].insertMany(level3Items);
  print("✅ Inserted " + result3.insertedIds.length + " Level 3 menu items");

  print("\n🎉 Multi-level menu structure created successfully!");
  
  // Verify by querying the complete hierarchy
  print("\n📋 Complete menu hierarchy:");
  
  const subMenu1 = db[COLLECTION_NAME].findOne({_id: SUB_MENU_1_ID});
  print("📁 " + subMenu1.label + " (ID: " + subMenu1._id + ")");
  
  const level2 = db[COLLECTION_NAME].find({parent_id: SUB_MENU_1_ID}).sort({sort_order: 1});
  level2.forEach(function(item) {
    print("  ├── " + item.label + " (ID: " + item._id + ")");
    
    if (item._id.equals(LEVEL_2_2_ID)) {
      const level3 = db[COLLECTION_NAME].find({parent_id: LEVEL_2_2_ID}).sort({sort_order: 1});
      level3.forEach(function(subItem) {
        print("  │   ├── " + subItem.label + " (ID: " + subItem._id + ")");
      });
    }
  });
  
  print("\n🔧 Next steps:");
  print("1. Restart your backend server");
  print("2. Refresh your frontend browser");
  print("3. Test the multi-level menu expansion");
  
} catch (error) {
  print("❌ Error creating menu structure: " + error);
}