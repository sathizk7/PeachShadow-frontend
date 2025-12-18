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

  const { USE_DYNAMIC_MENU, FALLBACK_TO_STATIC } = config.menu;

  // Load static menu data
  const loadStaticMenu = () => {
    try {
      const staticMenuData = navdata().props.children;
      setMenuData(staticMenuData || []);
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
    return apiData.map((item: any) => ({
      id: item._id,
      label: item.label,
      icon: item.icon,
      link: item.link,
      isHeader: item.is_header,
      subItems: item.subItems ? transformApiToMenuFormat(item.subItems) : undefined,
      badgeName: item.badge_name,
      badgeColor: item.badge_color,
      // Add any other required transformations
    }));
  };

  // Initialize menu data
  useEffect(() => {
    if (USE_DYNAMIC_MENU) {
      loadDynamicMenu();
    } else {
      loadStaticMenu();
    }
  }, [USE_DYNAMIC_MENU]);

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