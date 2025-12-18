// Menu Configuration Context
// src/contexts/MenuConfigContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import config from '../config';

interface MenuConfig {
  useDynamicMenu: boolean;
  fallbackToStatic: boolean;
  enableToggle: boolean;
}

interface MenuConfigContextType extends MenuConfig {
  toggleDynamicMenu: () => void;
  setUseDynamicMenu: (enabled: boolean) => void;
  setFallbackToStatic: (enabled: boolean) => void;
  resetToDefault: () => void;
}

const MenuConfigContext = createContext<MenuConfigContextType | undefined>(undefined);

interface MenuConfigProviderProps {
  children: ReactNode;
  enableRuntimeToggle?: boolean;
}

export const MenuConfigProvider: React.FC<MenuConfigProviderProps> = ({ 
  children, 
  enableRuntimeToggle = false 
}) => {
  const [menuConfig, setMenuConfig] = useState<MenuConfig>({
    useDynamicMenu: config.menu.USE_DYNAMIC_MENU,
    fallbackToStatic: config.menu.FALLBACK_TO_STATIC,
    enableToggle: enableRuntimeToggle
  });

  // Load from localStorage if runtime toggle is enabled
  useEffect(() => {
    if (enableRuntimeToggle) {
      const saved = localStorage.getItem('menuConfig');
      if (saved) {
        try {
          const savedConfig = JSON.parse(saved);
          setMenuConfig(prev => ({
            ...prev,
            ...savedConfig
          }));
        } catch (error) {
          console.warn('Failed to parse saved menu config:', error);
        }
      }
    }
  }, [enableRuntimeToggle]);

  // Save to localStorage when config changes (if runtime toggle is enabled)
  useEffect(() => {
    if (enableRuntimeToggle) {
      localStorage.setItem('menuConfig', JSON.stringify({
        useDynamicMenu: menuConfig.useDynamicMenu,
        fallbackToStatic: menuConfig.fallbackToStatic
      }));
    }
  }, [menuConfig.useDynamicMenu, menuConfig.fallbackToStatic, enableRuntimeToggle]);

  const toggleDynamicMenu = () => {
    if (!menuConfig.enableToggle) return;
    
    setMenuConfig(prev => ({
      ...prev,
      useDynamicMenu: !prev.useDynamicMenu
    }));
  };

  const setUseDynamicMenu = (enabled: boolean) => {
    if (!menuConfig.enableToggle) return;
    
    setMenuConfig(prev => ({
      ...prev,
      useDynamicMenu: enabled
    }));
  };

  const setFallbackToStatic = (enabled: boolean) => {
    if (!menuConfig.enableToggle) return;
    
    setMenuConfig(prev => ({
      ...prev,
      fallbackToStatic: enabled
    }));
  };

  const resetToDefault = () => {
    if (!menuConfig.enableToggle) return;
    
    setMenuConfig({
      useDynamicMenu: config.menu.USE_DYNAMIC_MENU,
      fallbackToStatic: config.menu.FALLBACK_TO_STATIC,
      enableToggle: enableRuntimeToggle
    });
  };

  return (
    <MenuConfigContext.Provider
      value={{
        ...menuConfig,
        toggleDynamicMenu,
        setUseDynamicMenu,
        setFallbackToStatic,
        resetToDefault
      }}
    >
      {children}
    </MenuConfigContext.Provider>
  );
};

export const useMenuConfig = () => {
  const context = useContext(MenuConfigContext);
  if (context === undefined) {
    throw new Error('useMenuConfig must be used within a MenuConfigProvider');
  }
  return context;
};