import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { Collapse, Container } from 'reactstrap';
import withRouter from '../../Components/Common/withRouter';

import logoSm from "../../assets/images/logo-sm.png";
//i18n
import { withTranslation } from "react-i18next";

// Import Data
import { useMenuData } from "../../hooks/useMenuData";
import VerticalLayout from "../VerticalLayouts";

//SimpleBar
import SimpleBar from "simplebar-react";

const TwoColumnLayout = (props : any) => {
    // Use the unified menu data hook instead of navdata directly
    const { menuData, loading, error, isUsingDynamic } = useMenuData();
    
    // State for selected menu item in first column
    const [selectedMenuItem, setSelectedMenuItem] = useState<any>(null);
    
    // Resize sidebar
    const [isMenu, setIsMenu] = useState("twocolumn");
    
    // Initialize component state based on current CSS state
    useEffect(() => {
        if (props.layoutType === 'twocolumn') {
            // Don't force the twocolumn-panel class - let hamburger button control it
            // Just initialize our selectedMenuItem as null since no icon has been clicked yet
            setSelectedMenuItem(null);
        }
    }, [props.layoutType]);
    
    const activateParentDropdown = useCallback((item : any) => {
        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
        if (parentCollapseDiv) {
            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                const parentParentCollapse = parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling;
                if (parentParentCollapse) {
                    parentParentCollapse.classList.add("active");
                    if (parentParentCollapse.closest(".collapse.menu-dropdown")) {
                        parentParentCollapse.closest(".collapse.menu-dropdown").classList.add("show");
                    }
                }
            }
            activateIconSidebarActive(parentCollapseDiv.getAttribute("id"));
            return false;
        }
        return false;
    }, []);

    const path = props.router.location.pathname;

    const initMenu = useCallback(() => {
        const pathName = process.env.PUBLIC_URL + path;
        const ul = document.getElementById("navbar-nav") as HTMLElement;
        const items : any = ul.getElementsByTagName("a");
        let itemsArray = [...items]; // converts NodeList to Array
        removeActivation(itemsArray);
        let matchingMenuItem = itemsArray.find((x) => {
            return x.pathname === pathName;
        });
        if (matchingMenuItem) {
            activateParentDropdown(matchingMenuItem);
        }
    }, [path, activateParentDropdown]);

    const removeActivation = (items : any) => {
        let actiItems = items.filter((x : any) => x.classList.contains("active"));

        actiItems.forEach((item : any) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };
    
    const activateIconSidebarActive = (id : any) => {
        const menu = document.querySelector(`[sub-items="${id}"]`) as HTMLElement;
        if (menu) {
            menu.classList.add("active");
        }
    };

    const removeIconSidebarActive = () => {
        const activeIcons = document.querySelectorAll(".twocolumn-iconview li");
        activeIcons.forEach((icon) => {
            icon.classList.remove("active");
        });
    };

    const windowResizeHover = () => {
        initMenu();
        var windowSize = document.documentElement.clientWidth;
        if (windowSize < 767) {
            document.documentElement.setAttribute("data-layout", "vertical");
            setIsMenu('vertical');
        }
        else {
            document.documentElement.setAttribute("data-layout", "twocolumn");
            setIsMenu('twocolumn');
        }
    };

    // Handle click on first column icons
    const handleFirstColumnClick = (item: any) => {
        // Use CSS class approach like the hamburger menu
        const hasPanel = document.body.classList.contains('twocolumn-panel');
        
        if (hasPanel) {
            // Second column is currently hidden, show it with selected item
            document.body.classList.remove('twocolumn-panel');
            setSelectedMenuItem(item);
            removeIconSidebarActive();
            // Activate the clicked icon
            const iconElement = document.querySelector(`[sub-items="${item.id}"]`);
            if (iconElement) {
                iconElement.classList.add("active");
            }
        } else {
            // Second column is visible
            if (selectedMenuItem && selectedMenuItem.id === item.id) {
                // Same item clicked, hide the second column
                document.body.classList.add('twocolumn-panel');
                setSelectedMenuItem(null);
                removeIconSidebarActive();
            } else {
                // Different item clicked, switch to that menu's sub-items
                setSelectedMenuItem(item);
                removeIconSidebarActive();
                // Activate the clicked icon
                const iconElement = document.querySelector(`[sub-items="${item.id}"]`);
                if (iconElement) {
                    iconElement.classList.add("active");
                }
            }
        }
    };

    useEffect(function setupListener() {
        if (props.layoutType === 'twocolumn') {
            window.addEventListener('resize', windowResizeHover);

            // remove classname when component will unmount
            return function cleanupListener() {
                window.removeEventListener('resize', windowResizeHover);
            };
        }
    }, [props.layoutType]);

    useEffect(() => {
        if (props.layoutType === 'twocolumn') {
            initMenu();
        }
    }, [props.layoutType, initMenu]);

    const renderSecondColumn = () => {
        if (!selectedMenuItem || !selectedMenuItem.subItems || selectedMenuItem.subItems.length === 0) {
            return (
                <div className="text-center p-4 text-muted" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <i className="ri-mouse-line fs-2 mb-2"></i>
                    <p className="mb-0 small">Click on a menu icon to view options</p>
                </div>
            );
        }

        // Recursive function to render menu items at any level
        const renderMenuItems = (items: any[], level: number = 0) => {
            return items.map((subItem: any, key: number) => (
                <React.Fragment key={key}>
                    <li className="nav-item">
                        <Link
                            to={subItem.link ? subItem.link : "/#"}
                            className="nav-link"
                            onClick={subItem.click}
                        >
                            {props.t(subItem.label)}
                            {subItem.badgeName && (
                                <span className={`badge badge-pill bg-${subItem.badgeColor}`} data-key="t-new">
                                    {subItem.badgeName}
                                </span>
                            )}
                        </Link>
                        {/* Handle child items (multi-level menus) - Use childItems for nested levels */}
                        {subItem.isChildItem && subItem.childItems && subItem.childItems.length > 0 && (
                            <Collapse className="menu-dropdown" isOpen={subItem.stateVariables} id={`collapse-${subItem.id}`}>
                                <ul className="nav nav-sm flex-column">
                                    {renderMenuItems(subItem.childItems, level + 1)}
                                </ul>
                            </Collapse>
                        )}
                    </li>
                </React.Fragment>
            ));
        };

        return (
            <ul className="nav nav-sm flex-column">
                {renderMenuItems(selectedMenuItem.subItems)}
            </ul>
        );
    };

    return (
        <React.Fragment>
            {isMenu === "twocolumn" ? (
                <div id="scrollbar">
                    <Container fluid>
                        <div id="two-column-menu">
                            {/* First Column - Icons */}
                            <SimpleBar className="twocolumn-iconview">
                                <Link to="#" className="logo">
                                    <img src={logoSm} alt="" height="22" />
                                </Link>
                                {/* Development indicator - subtle */}
                                {process.env.NODE_ENV === 'development' && (
                                    <div className="text-center" style={{ fontSize: '0.5rem', color: '#6c757d', padding: '0.1rem 0' }}>
                                        <i className={`${isUsingDynamic ? 'ri-database-line' : 'ri-file-text-line'} me-1`}></i>
                                        {isUsingDynamic ? 'Dynamic' : 'Static'}
                                    </div>
                                )}
                                {(menuData || []).map((item: any, key: number) => (
                                    <React.Fragment key={key}>
                                        {item.icon && item.subItems && item.subItems.length > 0 && (
                                            <li>
                                                <Link
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleFirstColumnClick(item);
                                                    }}
                                                    to="#"
                                                    sub-items={item.id}
                                                    className={`nav-icon ${selectedMenuItem?.id === item.id ? 'active' : ''}`}
                                                    data-bs-toggle="collapse">
                                                    <i className={item.icon}></i>
                                                </Link>
                                            </li>
                                        )}
                                    </React.Fragment>
                                ))}
                            </SimpleBar>
                        </div>
                        {/* Second Column - Menu Details */}
                        <SimpleBar id="navbar-nav" className="navbar-nav">
                            {renderSecondColumn()}
                        </SimpleBar>
                    </Container>
                </div>
            ) : (
                <SimpleBar id="scrollbar" className="h-100">
                    <Container fluid>
                        <div id="two-column-menu"></div>
                        <ul className="navbar-nav" id="navbar-nav">
                            <VerticalLayout />
                        </ul>
                    </Container>
                </SimpleBar>
            )}
        </React.Fragment>
    );
};

TwoColumnLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
    layoutType: PropTypes.string
};

export default withRouter(withTranslation()(TwoColumnLayout));