// Menu Configuration Toggle Component
// src/components/MenuToggle/MenuToggle.tsx

import React from 'react';
import { useMenuConfig } from '../../contexts/MenuConfigContext';

interface MenuToggleProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'inline' | 'dropdown';
}

const MenuToggle: React.FC<MenuToggleProps> = ({
  className = '',
  showLabels = true,
  size = 'md',
  variant = 'card'
}) => {
  const {
    useDynamicMenu,
    fallbackToStatic,
    enableToggle,
    toggleDynamicMenu,
    setUseDynamicMenu,
    setFallbackToStatic,
    resetToDefault
  } = useMenuConfig();

  if (!enableToggle) {
    return null; // Don't show if toggle is not enabled
  }

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  if (variant === 'dropdown') {
    return (
      <div className={`dropdown ${className}`}>
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="ri-settings-3-line me-2"></i>
          Menu Settings
        </button>
        <ul className="dropdown-menu">
          <li>
            <button
              className="dropdown-item d-flex align-items-center justify-content-between"
              onClick={toggleDynamicMenu}
            >
              <span>Dynamic Menu</span>
              <i className={`ri-toggle-${useDynamicMenu ? 'fill' : 'line'}`}></i>
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button
              className="dropdown-item d-flex align-items-center justify-content-between"
              onClick={() => setFallbackToStatic(!fallbackToStatic)}
            >
              <span>Fallback to Static</span>
              <i className={`ri-toggle-${fallbackToStatic ? 'fill' : 'line'}`}></i>
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item" onClick={resetToDefault}>
              <i className="ri-restart-line me-2"></i>
              Reset to Default
            </button>
          </li>
        </ul>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`d-flex align-items-center gap-3 ${className}`}>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="dynamicMenuToggle"
            checked={useDynamicMenu}
            onChange={toggleDynamicMenu}
          />
          {showLabels && (
            <label className="form-check-label" htmlFor="dynamicMenuToggle">
              Dynamic Menu
            </label>
          )}
        </div>
        
        {useDynamicMenu && (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="fallbackToggle"
              checked={fallbackToStatic}
              onChange={(e) => setFallbackToStatic(e.target.checked)}
            />
            {showLabels && (
              <label className="form-check-label" htmlFor="fallbackToggle">
                Fallback to Static
              </label>
            )}
          </div>
        )}

        <button
          className={`btn btn-outline-secondary ${sizeClasses[size]}`}
          onClick={resetToDefault}
          title="Reset to default settings"
        >
          <i className="ri-restart-line"></i>
        </button>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <h6 className="card-title">
          <i className="ri-menu-line me-2"></i>
          Menu Configuration
        </h6>
        
        <div className="mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="dynamicMenuToggle"
              checked={useDynamicMenu}
              onChange={toggleDynamicMenu}
            />
            <label className="form-check-label" htmlFor="dynamicMenuToggle">
              Use Dynamic Menu
            </label>
          </div>
          <small className="text-muted">
            Load menu structure from database via API
          </small>
        </div>

        {useDynamicMenu && (
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="fallbackToggle"
                checked={fallbackToStatic}
                onChange={(e) => setFallbackToStatic(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="fallbackToggle">
                Fallback to Static Menu
              </label>
            </div>
            <small className="text-muted">
              Show static menu if dynamic menu fails to load
            </small>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <span className={`badge ${useDynamicMenu ? 'bg-success' : 'bg-secondary'}`}>
            {useDynamicMenu ? 'Dynamic' : 'Static'} Menu
          </span>
          
          <button
            className={`btn btn-outline-secondary ${sizeClasses[size]}`}
            onClick={resetToDefault}
            title="Reset to default settings"
          >
            <i className="ri-restart-line me-1"></i>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuToggle;