// Demo Page for Menu Toggle
// src/pages/MenuToggleDemo.tsx

import React from 'react';
import { MenuConfigProvider } from '../contexts/MenuConfigContext';
import { MenuToggle } from '../components/MenuToggle';
import UnifiedMenuData from '../Layouts/UnifiedMenuData';

const MenuToggleDemo = () => {
  return (
    <MenuConfigProvider enableRuntimeToggle={true}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Menu Toggle Demo</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#!">PeachShadow</a>
                  </li>
                  <li className="breadcrumb-item active">Menu Demo</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="ri-menu-2-line me-2"></i>
                  Live Menu Preview
                </h5>
              </div>
              <div className="card-body">
                <div className="border rounded p-3" style={{ minHeight: '400px', backgroundColor: '#f8f9fa' }}>
                  <h6 className="text-muted mb-3">Current Menu Structure:</h6>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <UnifiedMenuData />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title mb-0">Configuration</h6>
                  </div>
                  <div className="card-body">
                    <MenuToggle variant="card" />
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title mb-0">Environment Settings</h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><code>REACT_APP_USE_DYNAMIC_MENU</code></td>
                            <td>
                              <span className="badge bg-info">
                                {process.env.REACT_APP_USE_DYNAMIC_MENU || 'false'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td><code>REACT_APP_FALLBACK_TO_STATIC</code></td>
                            <td>
                              <span className="badge bg-info">
                                {process.env.REACT_APP_FALLBACK_TO_STATIC || 'true'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td><code>REACT_APP_API_URL</code></td>
                            <td>
                              <span className="badge bg-secondary text-truncate" style={{ maxWidth: '150px' }}>
                                {process.env.REACT_APP_API_URL || 'http://localhost:5001'}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h6 className="card-title mb-0">Toggle Variants</h6>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="mb-2">Inline Variant</h6>
                  <MenuToggle variant="inline" size="sm" />
                </div>

                <div className="mb-4">
                  <h6 className="mb-2">Dropdown Variant</h6>
                  <MenuToggle variant="dropdown" />
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">Without Labels</h6>
                  <MenuToggle variant="inline" showLabels={false} size="sm" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h6 className="card-title mb-0">Usage Instructions</h6>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <h6 className="alert-heading">How to Use</h6>
                  <ul className="mb-0 small">
                    <li>Toggle "Dynamic Menu" to switch between static and API-driven menus</li>
                    <li>Enable "Fallback to Static" to automatically switch to static menu if API fails</li>
                    <li>Changes are saved to localStorage and persist across sessions</li>
                    <li>Use "Reset" to restore environment defaults</li>
                  </ul>
                </div>

                <div className="alert alert-warning">
                  <h6 className="alert-heading">Testing</h6>
                  <p className="mb-2 small">To test fallback behavior:</p>
                  <ol className="mb-0 small">
                    <li>Enable Dynamic Menu</li>
                    <li>Stop the backend server</li>
                    <li>Refresh the page</li>
                    <li>Observe automatic fallback</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MenuConfigProvider>
  );
};

export default MenuToggleDemo;