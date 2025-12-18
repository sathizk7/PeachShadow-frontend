// Dynamic Layout Menu Data Hook
// src/hooks/useDynamicMenu.ts

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuService, MenuItem } from '../services/menuService';
import { getLoggedinUser } from '../helpers/api_helper';

interface MenuState {
  [key: string]: boolean;
}

export const useDynamicMenu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuStates, setMenuStates] = useState<MenuState>({});
  const [currentState, setCurrentState] = useState('Dashboard');

  // Initialize menu states
  const initializeMenuStates = useCallback((items: MenuItem[]) => {
    const states: MenuState = {};
    
    const processItems = (menuList: MenuItem[]) => {
      menuList.forEach(item => {
        if (!item.is_header) {
          states[item.id] = false;
        }
        if (item.subItems) {
          processItems(item.subItems);
        }
      });
    };

    processItems(items);
    setMenuStates(states);
  }, []);

  // Load menu data
  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = getLoggedinUser();
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const menus = await menuService.getMenusForUser(user.id);
      const transformedMenus = menuService.transformToCurrentFormat(menus);
      
      // Add click handlers with state management
      const menusWithHandlers = addClickHandlers(transformedMenus);
      
      setMenuItems(menusWithHandlers);
      initializeMenuStates(menus);
    } catch (err) {
      console.error('Failed to load menus:', err);
      setError(err instanceof Error ? err.message : 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  }, [initializeMenuStates]);

  // Add click handlers to menu items
  const addClickHandlers = (items: any[]): any[] => {
    return items.map(item => {
      const updatedItem = { ...item };

      if (item.subItems && item.subItems.length > 0) {
        updatedItem.click = (e: any) => {
          e.preventDefault();
          toggleMenuState(item.id);
          setCurrentState(item.label);
          updateIconSidebar(e);
        };
        updatedItem.stateVariables = menuStates[item.id] || false;
        updatedItem.subItems = addClickHandlers(item.subItems);
      }

      if (item.childItems && item.childItems.length > 0) {
        updatedItem.click = (e: any) => {
          e.preventDefault();
          toggleMenuState(item.id);
        };
        updatedItem.stateVariables = menuStates[item.id] || false;
        updatedItem.childItems = addClickHandlers(item.childItems);
      }

      return updatedItem;
    });
  };

  // Toggle menu state
  const toggleMenuState = (menuId: string) => {
    setMenuStates(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Update icon sidebar (from original implementation)
  const updateIconSidebar = (e: any) => {
    if (e && e.target && e.target.getAttribute("sub-items")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul?.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...(iconItems || [])];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("sub-items");
        const getID = document.getElementById(id) as HTMLElement;
        if (getID) {
          getID.classList.remove("show");
        }
      });
    }
  };

  // Handle current state changes
  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');
    
    // Reset states when current state changes
    Object.keys(menuStates).forEach(key => {
      if (currentState !== key) {
        setMenuStates(prev => ({ ...prev, [key]: false }));
      }
    });

    if (currentState === 'Widgets') {
      navigate("/widgets");
      document.body.classList.add('twocolumn-panel');
    }
  }, [currentState, navigate, menuStates]);

  // Load menus on mount
  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // Refresh menus
  const refreshMenus = useCallback(() => {
    loadMenus();
  }, [loadMenus]);

  return {
    menuItems,
    loading,
    error,
    refreshMenus,
    currentState,
    setCurrentState
  };
};