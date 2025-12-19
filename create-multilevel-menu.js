// MongoDB script to create multi-level menu structure
// Run this in your MongoDB shell or MongoDB Compass

// First, let's create Level 2.1 and Level 2.2 as children of "Sub Menu 1" (69441f1dd77e3797b66e354d)

db.menus.insertMany([
  {
    "_id": ObjectId(),
    "parent_id": ObjectId("69441f1dd77e3797b66e354d"), // Parent is "Sub Menu 1"
    "label": "Level 2.1",
    "icon": null,
    "link": "/level-2-1",
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
    "_id": ObjectId("69441f1dd77e3797b66e9999"), // Fixed ID for Level 2.2 so we can reference it
    "parent_id": ObjectId("69441f1dd77e3797b66e354d"), // Parent is "Sub Menu 1"
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
]);

// Now create Level 3.1 and Level 3.2 as children of Level 2.2
db.menus.insertMany([
  {
    "_id": ObjectId(),
    "parent_id": ObjectId("69441f1dd77e3797b66e9999"), // Parent is "Level 2.2"
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
    "parent_id": ObjectId("69441f1dd77e3797b66e9999"), // Parent is "Level 2.2"
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
]);

// Verify the structure was created correctly
print("Multi-level menu structure created successfully!");
print("Verifying structure...");

// Check Level 2 items
print("Level 2 items (children of Sub Menu 1):");
db.menus.find({
  "parent_id": ObjectId("69441f1dd77e3797b66e354d")
}).forEach(function(doc) {
  print("- " + doc.label + " (ID: " + doc._id + ")");
});

// Check Level 3 items
print("Level 3 items (children of Level 2.2):");
db.menus.find({
  "parent_id": ObjectId("69441f1dd77e3797b66e9999")
}).forEach(function(doc) {
  print("- " + doc.label + " (ID: " + doc._id + ")");
});

print("Done! Your menu structure should now be:");
print("Sub Menu 1");
print("├── Level 2.1");
print("└── Level 2.2");
print("    ├── Level 3.1");
print("    └── Level 3.2");