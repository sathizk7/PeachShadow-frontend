// Hook for getting menu data (either static or dynamic)
// src/hooks/useMenuData.ts

import { useState, useEffect } from 'react';
import navdata from '../Layouts/LayoutMenuData';
import config from '../config';
import { menuService } from '../services/menuService';

interface MenuItem {
  id?: string;
  label: string;
  icon?: string;
  link?: string;
  isHeader?: boolean;
  subItems?: MenuItem[];
  click?: (e: any) => void;
  stateVariables?: boolean;
  badgeName?: string;
  badgeColor?: string;
}

export const useMenuData = () => {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDynamic, setIsUsingDynamic] = useState(false);
  
  // State tracking for menu expansion (similar to LayoutMenuData)
  const [menuStates, setMenuStates] = useState<{[key: string]: boolean}>({});

  const { USE_DYNAMIC_MENU, FALLBACK_TO_STATIC } = config.menu;

  // Function to toggle menu state
  const toggleMenuState = (menuId: string) => {
    setMenuStates(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Load static menu data
  const loadStaticMenu = () => {
    try {
      // Create a static fallback menu structure without hooks
      const staticFallbackMenu = [
        {
          id: "menu-header",
          label: "Menu",
          isHeader: true
        },
        {
          id: "dashboard",
          label: "Dashboards",
          icon: "ri-dashboard-2-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("dashboard");
          },
          subItems: [
            {
              id: "analytics",
              label: "Analytics",
              link: "/dashboard-analytics"
            },
            {
              id: "crm", 
              label: "CRM",
              link: "/dashboard-crm"
            },
            {
              id: "ecommerce",
              label: "Ecommerce",
              link: "/dashboard"
            }
          ]
        },
        {
          id: "apps",
          label: "Apps",
          icon: "ri-apps-2-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("apps");
          },
          subItems: [
            {
              id: "calendar",
              label: "Calendar", 
              link: "/apps-calendar"
            },
            {
              id: "chat",
              label: "Chat",
              link: "/apps-chat"
            }
          ]
        },
        {
          id: "pages",
          label: "Pages",
          icon: "ri-pages-line", 
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("pages");
          },
          subItems: [
            {
              id: "profile",
              label: "Profile",
              link: "/pages-profile"
            },
            {
              id: "team", 
              label: "Team",
              link: "/pages-team"
            }
          ]
        }
      ];

      setMenuData(staticFallbackMenu);
      setIsUsingDynamic(false);
      setError(null);
    } catch (err) {
      console.error('Error loading static menu:', err);
      setError('Failed to load static menu');
      setMenuData([]);
    }
  };

  // Load dynamic menu data
  const loadDynamicMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get menu hierarchy from API
      const dynamicMenuData = await menuService.getAllMenus();
      
      // Transform API data to match expected format
      const transformedData = transformApiToMenuFormat(dynamicMenuData);
      
      setMenuData(transformedData);
      setIsUsingDynamic(true);
    } catch (err) {
      console.error('Error loading dynamic menu:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dynamic menu');
      
      // Fallback to static menu if enabled
      if (FALLBACK_TO_STATIC) {
        console.log('Falling back to static menu');
        loadStaticMenu();
      } else {
        setMenuData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform API menu data to component-expected format
  const transformApiToMenuFormat = (apiData: any[]): MenuItem[] => {
    // First pass: Handle duplicate labels by merging header subItems with menu items
    const processedData = [...apiData];
    const labelGroups = processedData.reduce((acc: {[key: string]: any[]}, item) => {
      if (!acc[item.label]) acc[item.label] = [];
      acc[item.label].push(item);
      return acc;
    }, {});

    // Merge items with same labels (header + menu item)
    Object.keys(labelGroups).forEach(label => {
      const items = labelGroups[label];
      if (items.length > 1) {
        const headerItem = items.find(item => item.is_header === true);
        const menuItem = items.find(item => item.is_header === false && item.icon);
        
        if (headerItem && menuItem && headerItem.subItems?.length > 0 && menuItem.subItems?.length === 0) {
          // Transfer subItems from header to menu item
          menuItem.subItems = headerItem.subItems;
          console.log(`Merged subItems from header to menu for: ${label}`);
        }
      }
    });

    return processedData.map((item: any) => {
      const menuId = item._id || item.id;
      const hasSubItems = item.subItems && item.subItems.length > 0;
      
      return {
        id: menuId,
        label: item.label,
        icon: item.icon,
        link: item.link || "/#",
        isHeader: item.is_header,
        subItems: hasSubItems ? transformApiToMenuFormat(item.subItems) : undefined,
        badgeName: item.badge_name,
        badgeColor: item.badge_color,
        // Add click handler and state tracking for items with subItems
        ...(hasSubItems && {
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState(menuId);
          },
          stateVariables: !!menuStates[menuId]
        })
      };
    });
  };

  // Initialize menu data
  useEffect(() => {
    if (USE_DYNAMIC_MENU) {
      loadDynamicMenu();
    } else {
      loadStaticMenu();
    }
  }, [USE_DYNAMIC_MENU]);

  // Re-transform data when menu states change (for dynamic menus)
  useEffect(() => {
    if (menuData.length > 0) {
      // Update menu states for both dynamic and static menus
      const updateMenuStates = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.subItems && item.subItems.length > 0) {
            return {
              ...item,
              stateVariables: !!menuStates[item.id!],
              subItems: updateMenuStates(item.subItems),
              // Ensure click handler exists for static menus
              click: item.click || ((e: any) => {
                e.preventDefault();
                toggleMenuState(item.id!);
              })
            };
          }
          return item;
        });
      };
      
      setMenuData(prevData => updateMenuStates(prevData));
    }
  }, [menuStates]);

  // Refresh function for manual reload
  const refresh = () => {
    if (USE_DYNAMIC_MENU) {
      loadDynamicMenu();
    } else {
      loadStaticMenu();
    }
  };

  return {
    menuData,
    loading,
    error,
    isUsingDynamic,
    refresh,
    canUseDynamic: USE_DYNAMIC_MENU,
    hasFallback: FALLBACK_TO_STATIC
  };
};

export default useMenuData;