// Enhanced Dynamic Layout Menu Hook with Configuration Support
// src/hooks/useConfigurableMenu.ts

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { 
  fetchUserMenus,
  toggleMenuState,
  setCurrentState,
  initializeMenuStates,
  clearError
} from '../slices/menu/reducer';
import { menuService } from '../services/menuService';

export const useConfigurableMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { USE_DYNAMIC_MENU, FALLBACK_TO_STATIC } = config.menu;

  const {
    items: menuItems,
    loading,
    error,
    menuStates,
    currentState
  } = useSelector((state: any) => state.Menu);

  // Only load dynamic menus if enabled
  useEffect(() => {
    if (USE_DYNAMIC_MENU) {
      dispatch(fetchUserMenus() as any);
    }
  }, [dispatch, USE_DYNAMIC_MENU]);

  // Initialize menu states when items are loaded
  useEffect(() => {
    if (USE_DYNAMIC_MENU && menuItems.length > 0) {
      dispatch(initializeMenuStates({ menuItems }));
    }
  }, [menuItems, dispatch, USE_DYNAMIC_MENU]);

  // Handle current state changes
  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');

    if (currentState === 'Widgets') {
      navigate("/widgets");
      document.body.classList.add('twocolumn-panel');
    }
  }, [currentState, navigate]);

  // Transform menu items for rendering (only if using dynamic menus)
  const transformedMenuItems = USE_DYNAMIC_MENU && menuItems.length > 0 
    ? addClickHandlers(menuService.transformToCurrentFormat(menuItems))
    : [];

  // Add click handlers to menu items with Redux state management
  function addClickHandlers(items: any[]): any[] {
    return items.map(item => {
      const updatedItem = { ...item };

      if (item.subItems && item.subItems.length > 0) {
        updatedItem.click = (e: any) => {
          e.preventDefault();
          dispatch(toggleMenuState({ menuId: item.id }));
          dispatch(setCurrentState(item.label));
          updateIconSidebar(e);
        };
        updatedItem.stateVariables = menuStates[item.id] || false;
        updatedItem.subItems = addClickHandlers(item.subItems);
      }

      if (item.childItems && item.childItems.length > 0) {
        updatedItem.click = (e: any) => {
          e.preventDefault();
          dispatch(toggleMenuState({ menuId: item.id }));
        };
        updatedItem.stateVariables = menuStates[item.id] || false;
        updatedItem.childItems = addClickHandlers(item.childItems);
      }

      return updatedItem;
    });
  }

  // Update icon sidebar (from original implementation)
  function updateIconSidebar(e: any) {
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
  }

  // Refresh menus (only if dynamic menus are enabled)
  const refreshMenus = useCallback(() => {
    if (USE_DYNAMIC_MENU) {
      dispatch(fetchUserMenus() as any);
    }
  }, [dispatch, USE_DYNAMIC_MENU]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Determine menu state
  const isUsingDynamicMenu = USE_DYNAMIC_MENU;
  const shouldFallbackToStatic = USE_DYNAMIC_MENU && error && FALLBACK_TO_STATIC;
  const canRetry = USE_DYNAMIC_MENU && error && !loading;

  return {
    // Menu data
    menuItems: transformedMenuItems,
    loading: USE_DYNAMIC_MENU ? loading : false,
    error: USE_DYNAMIC_MENU ? error : null,
    
    // State
    currentState,
    isUsingDynamicMenu,
    shouldFallbackToStatic,
    canRetry,
    
    // Actions
    refreshMenus,
    clearError: handleClearError,
    setCurrentState: (state: string) => dispatch(setCurrentState(state)),
    
    // Configuration
    config: {
      USE_DYNAMIC_MENU,
      FALLBACK_TO_STATIC
    }
  };
};