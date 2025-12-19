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
      // Create a comprehensive static fallback menu structure matching LayoutMenuData
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
            { id: "analytics", label: "Analytics", link: "/dashboard-analytics" },
            { id: "crm", label: "CRM", link: "/dashboard-crm" },
            { id: "ecommerce", label: "Ecommerce", link: "/dashboard" },
            { id: "crypto", label: "Crypto", link: "/dashboard-crypto" },
            { id: "projects", label: "Projects", link: "/dashboard-projects" },
            { id: "nft", label: "NFT", link: "/dashboard-nft" },
            { id: "job", label: "Job", link: "/dashboard-job" },
            { id: "blog", label: "Blog", link: "/dashboard-blog", badgeName: "New", badgeColor: "success" }
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
            { id: "calendar", label: "Calendar", link: "/apps-calendar" },
            { id: "chat", label: "Chat", link: "/apps-chat" },
            { id: "mailbox", label: "Email", link: "/apps-mailbox" },
            { id: "appsecommerce", label: "Ecommerce", link: "/apps-ecommerce-products" },
            { id: "projects", label: "Projects", link: "/apps-projects-list" },
            { id: "tasks", label: "Tasks", link: "/apps-tasks-kanban" },
            { id: "crm", label: "CRM", link: "/apps-crm-contacts" },
            { id: "crypto", label: "Crypto", link: "/apps-crypto-transactions" },
            { id: "invoices", label: "Invoices", link: "/apps-invoices-list" },
            { id: "supporttickets", label: "Support Tickets", link: "/apps-tickets-list" },
            { id: "nft", label: "NFT Marketplace", link: "/apps-nft-marketplace" },
            { id: "filemanager", label: "File Manager", link: "/apps-file-manager" },
            { id: "todo", label: "To Do", link: "/apps-todo" },
            { id: "job", label: "Jobs", link: "/apps-job-lists" }
          ]
        },
        {
          id: "pages-header",
          label: "Pages",
          isHeader: true
        },
        {
          id: "authentication",
          label: "Authentication",
          icon: "ri-account-circle-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("authentication");
          },
          subItems: [
            { id: "signIn", label: "Sign In", link: "/auth-signin-basic" },
            { id: "signUp", label: "Sign Up", link: "/auth-signup-basic" },
            { id: "passReset", label: "Password Reset", link: "/auth-pass-reset-basic" },
            { id: "passCreate", label: "Password Create", link: "/auth-pass-change-basic" },
            { id: "lockScreen", label: "Lock Screen", link: "/auth-lockscreen-basic" },
            { id: "logout", label: "Logout", link: "/auth-logout-basic" },
            { id: "successMsg", label: "Success Message", link: "/auth-success-msg-basic" },
            { id: "twostep", label: "Two Step Verification", link: "/auth-twostep-basic" },
            { id: "errors", label: "Errors", link: "/auth-404-basic" },
            { id: "offlinePage", label: "Offline Page", link: "/auth-offline" }
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
            { id: "starter", label: "Starter", link: "/pages-starter" },
            { id: "profile", label: "Profile", link: "/pages-profile" },
            { id: "team", label: "Team", link: "/pages-team" },
            { id: "timeline", label: "Timeline", link: "/pages-timeline" },
            { id: "faqs", label: "FAQs", link: "/pages-faqs" },
            { id: "pricing", label: "Pricing", link: "/pages-pricing" },
            { id: "gallery", label: "Gallery", link: "/pages-gallery" },
            { id: "maintenance", label: "Maintenance", link: "/pages-maintenance" },
            { id: "comingSoon", label: "Coming Soon", link: "/pages-coming-soon" },
            { id: "sitemap", label: "Sitemap", link: "/pages-sitemap" },
            { id: "searchResults", label: "Search Results", link: "/pages-search-results" }
          ]
        },
        {
          id: "landing",
          label: "Landing",
          icon: "ri-rocket-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("landing");
          },
          subItems: [
            { id: "onePage", label: "One Page", link: "/landing" },
            { id: "nftLanding", label: "NFT Landing", link: "/nft-landing" },
            { id: "jobLanding", label: "Job", link: "/job-landing" }
          ]
        },
        {
          id: "components-header",
          label: "Components",
          isHeader: true
        },
        {
          id: "baseUi",
          label: "Base UI",
          icon: "ri-pencil-ruler-2-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("baseUi");
          },
          subItems: [
            { id: "alerts", label: "Alerts", link: "/ui-alerts" },
            { id: "badges", label: "Badges", link: "/ui-badges" },
            { id: "buttons", label: "Buttons", link: "/ui-buttons" },
            { id: "colors", label: "Colors", link: "/ui-colors" },
            { id: "cards", label: "Cards", link: "/ui-cards" },
            { id: "carousel", label: "Carousel", link: "/ui-carousel" },
            { id: "dropdowns", label: "Dropdowns", link: "/ui-dropdowns" },
            { id: "grid", label: "Grid", link: "/ui-grid" },
            { id: "images", label: "Images", link: "/ui-images" },
            { id: "tabs", label: "Tabs", link: "/ui-tabs" },
            { id: "accordions", label: "Accordion & Collapse", link: "/ui-accordions" },
            { id: "modals", label: "Modals", link: "/ui-modals" },
            { id: "offcanvas", label: "Offcanvas", link: "/ui-offcanvas" },
            { id: "placeholders", label: "Placeholders", link: "/ui-placeholders" },
            { id: "progress", label: "Progress Bars", link: "/ui-progress" },
            { id: "notifications", label: "Notifications", link: "/ui-notifications" },
            { id: "media", label: "Media Object", link: "/ui-media" },
            { id: "embedVideo", label: "Embed Video", link: "/ui-embed-video" },
            { id: "typography", label: "Typography", link: "/ui-typography" },
            { id: "lists", label: "Lists", link: "/ui-lists" },
            { id: "general", label: "General", link: "/ui-general" },
            { id: "ribbons", label: "Ribbons", link: "/ui-ribbons" },
            { id: "utilities", label: "Utilities", link: "/ui-utilities" }
          ]
        },
        {
          id: "advanceUi",
          label: "Advance UI",
          icon: "ri-stack-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("advanceUi");
          },
          subItems: [
            { id: "sweetAlerts", label: "Sweet Alerts", link: "/ui-sweet-alerts" },
            { id: "nestable", label: "Nestable List", link: "/ui-nestable" },
            { id: "scrollbar", label: "Scrollbar", link: "/ui-scrollbar" },
            { id: "animation", label: "Animation", link: "/ui-animation" },
            { id: "tour", label: "Tour", link: "/ui-tour" },
            { id: "swiper", label: "Swiper Slider", link: "/ui-swiper" },
            { id: "ratings", label: "Ratings", link: "/ui-ratings" },
            { id: "highlight", label: "Highlight", link: "/ui-highlight" },
            { id: "scrollSpy", label: "ScrollSpy", link: "/ui-scrollspy" }
          ]
        },
        {
          id: "widgets",
          label: "Widgets",
          icon: "ri-honour-line",
          link: "/widgets"
        },
        {
          id: "forms",
          label: "Forms",
          icon: "ri-file-list-3-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("forms");
          },
          subItems: [
            { id: "basicElements", label: "Basic Elements", link: "/forms-elements" },
            { id: "formSelect", label: "Form Select", link: "/forms-select" },
            { id: "checkboxsRadios", label: "Checkboxs & Radios", link: "/forms-checkboxes-radios" },
            { id: "pickers", label: "Pickers", link: "/forms-pickers" },
            { id: "inputMasks", label: "Input Masks", link: "/forms-masks" },
            { id: "advanced", label: "Advanced", link: "/forms-advanced" },
            { id: "rangeSlider", label: "Range Slider", link: "/forms-range-sliders" },
            { id: "validation", label: "Validation", link: "/forms-validation" },
            { id: "wizard", label: "Wizard", link: "/forms-wizard" },
            { id: "editors", label: "Editors", link: "/forms-editors" },
            { id: "fileuploads", label: "File Uploads", link: "/forms-file-uploads" },
            { id: "formlayouts", label: "Form Layouts", link: "/forms-layouts" },
            { id: "select2", label: "Select2", link: "/forms-select2" }
          ]
        },
        {
          id: "tables",
          label: "Tables",
          icon: "ri-layout-grid-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("tables");
          },
          subItems: [
            { id: "basicTables", label: "Basic Tables", link: "/tables-basic" },
            { id: "gridJs", label: "Grid JS", link: "/tables-gridjs" },
            { id: "listJs", label: "List JS", link: "/tables-listjs" },
            { id: "datatables", label: "Datatables", link: "/tables-datatables" }
          ]
        },
        {
          id: "charts",
          label: "Charts",
          icon: "ri-pie-chart-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("charts");
          },
          subItems: [
            { id: "apexcharts", label: "Apexcharts", link: "/charts-apex" },
            { id: "chartjs", label: "Chartjs", link: "/charts-chartjs" },
            { id: "echarts", label: "Echarts", link: "/charts-echarts" }
          ]
        },
        {
          id: "icons",
          label: "Icons",
          icon: "ri-compasses-2-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("icons");
          },
          subItems: [
            { id: "remix", label: "Remix Icons", link: "/icons-remix" },
            { id: "boxicons", label: "Boxicons", link: "/icons-boxicons" },
            { id: "materialdesign", label: "Material Design", link: "/icons-materialdesign" },
            { id: "lineawesome", label: "Line Awesome", link: "/icons-lineawesome" },
            { id: "feather", label: "Feather Icons", link: "/icons-feather" },
            { id: "crypto", label: "Crypto SVG Icons", link: "/icons-crypto" }
          ]
        },
        {
          id: "maps",
          label: "Maps",
          icon: "ri-map-pin-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("maps");
          },
          subItems: [
            { id: "google", label: "Google", link: "/maps-google" },
            { id: "vector", label: "Vector", link: "/maps-vector" },
            { id: "leaflet", label: "Leaflet", link: "/maps-leaflet" }
          ]
        },
        {
          id: "multilevel",
          label: "Multi Level",
          icon: "ri-share-line",
          link: "/#",
          stateVariables: false,
          click: (e: any) => {
            e.preventDefault();
            toggleMenuState("multilevel");
          },
          subItems: [
            { id: "level1.1", label: "Level 1.1", link: "/#" },
            { id: "level1.2", label: "Level 1.2", link: "/#" },
            { id: "level1.3", label: "Level 1.3", link: "/#" }
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