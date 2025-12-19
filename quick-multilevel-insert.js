// Quick one-liner MongoDB script - Copy and paste into MongoDB shell

// Insert all menu items in one command
db.menus.insertMany([
  // Level 2.1 (child of Sub Menu 1)
  {
    "_id": ObjectId(),
    "parent_id": ObjectId("69441f1dd77e3797b66e354d"),
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
  // Level 2.2 (child of Sub Menu 1) - will have children
  {
    "_id": ObjectId("69441f1dd77e3797b66e9999"),
    "parent_id": ObjectId("69441f1dd77e3797b66e354d"),
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
  },
  // Level 3.1 (child of Level 2.2)
  {
    "_id": ObjectId(),
    "parent_id": ObjectId("69441f1dd77e3797b66e9999"),
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
  // Level 3.2 (child of Level 2.2)
  {
    "_id": ObjectId(),
    "parent_id": ObjectId("69441f1dd77e3797b66e9999"),
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