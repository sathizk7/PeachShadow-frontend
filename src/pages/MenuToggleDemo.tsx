// Demo Page for Menu Toggle
// src/pages/MenuToggleDemo.tsx

import React from 'react';
import { MenuToggle } from '../Components/MenuToggle';
import UnifiedMenuData from '../Layouts/UnifiedMenuData';

const MenuToggleDemo = () => {
  return (
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
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">Menu Configuration</h6>
            </div>
            <div className="card-body">
              <MenuToggle variant="card" />
            </div>
          </div>

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
  );
};

export default MenuToggleDemo;