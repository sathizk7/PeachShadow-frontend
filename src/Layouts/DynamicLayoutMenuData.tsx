import React from "react";
import { useDynamicMenu } from "../hooks/useDynamicMenu";

const Navdata = () => {
    const { menuItems, loading, error } = useDynamicMenu();

    // Loading state
    if (loading) {
        return (
            <React.Fragment>
                <div className="text-center p-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading menu...</p>
                </div>
            </React.Fragment>
        );
    }

    // Error state
    if (error) {
        return (
            <React.Fragment>
                <div className="alert alert-danger m-3" role="alert">
                    <h6 className="alert-heading">Menu Loading Error</h6>
                    <p className="mb-0">Failed to load menu: {error}</p>
                    <button 
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </React.Fragment>
        );
    }

    // Return dynamic menu items
    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;