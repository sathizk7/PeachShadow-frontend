// Enhanced Dynamic Layout Menu Data Hook with Redux
// src/hooks/useDynamicMenuRedux.ts

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchUserMenus,
  toggleMenuState,
  setCurrentState,
  initializeMenuStates,
  clearError
} from '../slices/menu/reducer';
import { menuService } from '../services/menuService';

export const useDynamicMenuRedux = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: menuItems,
    loading,
    error,
    menuStates,
    currentState
  } = useSelector((state: any) => state.Menu);

  // Load menu data on mount
  useEffect(() => {
    dispatch(fetchUserMenus() as any);
  }, [dispatch]);

  // Initialize menu states when items are loaded
  useEffect(() => {
    if (menuItems.length > 0) {
      dispatch(initializeMenuStates({ menuItems }));
    }
  }, [menuItems, dispatch]);

  // Handle current state changes
  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');

    if (currentState === 'Widgets') {
      navigate("/widgets");
      document.body.classList.add('twocolumn-panel');
    }
  }, [currentState, navigate]);

  // Transform menu items for rendering
  const transformedMenuItems = menuItems.length > 0 
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

  // Refresh menus
  const refreshMenus = () => {
    dispatch(fetchUserMenus() as any);
  };

  // Clear error
  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    menuItems: transformedMenuItems,
    loading,
    error,
    currentState,
    refreshMenus,
    clearError: handleClearError,
    setCurrentState: (state: string) => dispatch(setCurrentState(state))
  };
};