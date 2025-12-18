import React from "react";
import { useMenuConfig } from "../contexts/MenuConfigContext";
import { useConfigurableMenu } from "../hooks/useConfigurableMenu";

// Import the original static menu component
import Navdata from "./LayoutMenuData";

const ContextualMenuData = () => {
    // Get menu configuration from context (if available)
    const menuConfigContext = React.useContext(React.createContext(null));
    const {
        useDynamicMenu: contextUseDynamic = null,
        fallbackToStatic: contextFallback = null
    } = menuConfigContext || {};

    const {
        menuItems,
        loading,
        error,
        refreshMenus,
        clearError,
        config: { USE_DYNAMIC_MENU, FALLBACK_TO_STATIC }
    } = useConfigurableMenu();

    // Use context values if available, otherwise fall back to config
    const useDynamicMenu = contextUseDynamic !== null ? contextUseDynamic : USE_DYNAMIC_MENU;
    const fallbackToStatic = contextFallback !== null ? contextFallback : FALLBACK_TO_STATIC;

    // Determine current state
    const isUsingDynamicMenu = useDynamicMenu;
    const shouldFallbackToStatic = useDynamicMenu && error && fallbackToStatic;
    const canRetry = useDynamicMenu && error && !loading;

    // Show dynamic menu loading state
    if (isUsingDynamicMenu && loading && !fallbackToStatic) {
        return (
            <React.Fragment>
                <div className="text-center p-3">
                    <div className="spinner-border text-primary" role="status" style={{ width: '1rem', height: '1rem' }}>
                        <span className="visually-hidden">Loading menu...</span>
                    </div>
                    <small className="d-block text-muted mt-2">Loading menu...</small>
                </div>
            </React.Fragment>
        );
    }

    // Show dynamic menu error with option to retry
    if (isUsingDynamicMenu && error && !fallbackToStatic) {
        return (
            <React.Fragment>
                <div className="alert alert-warning mx-3 mb-3" role="alert" style={{ fontSize: '0.8rem' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Menu loading failed</span>
                        {canRetry && (
                            <button 
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => {
                                    clearError();
                                    refreshMenus();
                                }}
                                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                            >
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    // Use dynamic menu if enabled and working
    if (isUsingDynamicMenu && !error && menuItems.length > 0) {
        return (
            <React.Fragment>
                {/* Optional: Show indicator in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="text-center" style={{ fontSize: '0.6rem', color: '#28a745', padding: '0.15rem 0' }}>
                        <i className="ri-refresh-line me-1"></i>
                        Dynamic Menu
                    </div>
                )}
                {menuItems}
            </React.Fragment>
        );
    }

    // Use static menu while loading if fallback is enabled
    if (isUsingDynamicMenu && loading && fallbackToStatic) {
        return (
            <React.Fragment>
                <div className="text-center" style={{ fontSize: '0.7rem', color: '#6c757d', padding: '0.25rem 0' }}>
                    <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                    Loading dynamic menu...
                </div>
                <Navdata />
            </React.Fragment>
        );
    }

    // Fallback to static menu when dynamic menu fails
    if (shouldFallbackToStatic) {
        return (
            <React.Fragment>
                <div className="text-center" style={{ fontSize: '0.7rem', color: '#dc3545', padding: '0.25rem 0' }}>
                    <i className="ri-alert-line me-1"></i>
                    Static Menu (Fallback)
                    <button 
                        className="btn btn-link btn-sm ms-2 p-0"
                        onClick={() => {
                            clearError();
                            refreshMenus();
                        }}
                        style={{ fontSize: '0.6rem', textDecoration: 'none' }}
                        title="Retry dynamic menu"
                    >
                        <i className="ri-refresh-line"></i>
                    </button>
                </div>
                <Navdata />
            </React.Fragment>
        );
    }

    // Default to static menu
    return (
        <React.Fragment>
            {/* Optional: Show indicator in development */}
            {process.env.NODE_ENV === 'development' && !useDynamicMenu && (
                <div className="text-center" style={{ fontSize: '0.6rem', color: '#6c757d', padding: '0.15rem 0' }}>
                    <i className="ri-file-text-line me-1"></i>
                    Static Menu
                </div>
            )}
            <Navdata />
        </React.Fragment>
    );
};

export default ContextualMenuData;