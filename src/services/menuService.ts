// Dynamic Menu Service
// src/services/menuService.ts

import { APIClient } from '../helpers/api_helper';

const api = new APIClient();

export interface MenuItem {
  id: string;
  parent_id?: string;
  label: string;
  icon?: string;
  link?: string;
  sort_order: number;
  is_active: boolean;
  is_header: boolean;
  badge_name?: string;
  badge_color?: string;
  sub_items?: string;
  permissions: string[];
  subItems?: MenuItem[];
  stateVariables?: boolean;
  click?: (e: any) => void;
  childItems?: MenuItem[];
  parentId?: string;
  isChildItem?: boolean;
}

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
}

class MenuService {
  /**
   * Get menus for current user based on role
   */
  async getMenusForUser(userId: string): Promise<MenuItem[]> {
    try {
      const response = await api.get(`/v1/menus/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user menus:', error);
      throw error;
    }
  }

  /**
   * Get all menu hierarchy (admin only)
   */
  async getAllMenus(): Promise<MenuItem[]> {
    try {
      const response = await api.get('/v1/menus/hierarchy');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching menu hierarchy:', error);
      throw error;
    }
  }

  /**
   * Create new menu item
   */
  async createMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    try {
      const response = await api.create('/v1/menus', menuItem);
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  }

  /**
   * Update menu item
   */
  async updateMenuItem(id: string, menuItem: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const response = await api.update(`/v1/menus/${id}`, menuItem);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  /**
   * Delete menu item
   */
  async deleteMenuItem(id: string): Promise<void> {
    try {
      await api.delete(`/v1/menus/${id}`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  /**
   * Transform API response to match current menu structure
   */
  transformToCurrentFormat(menuItems: MenuItem[]): any[] {
    return menuItems.map(item => this.transformMenuItem(item));
  }

  private transformMenuItem(item: MenuItem): any {
    const transformed: any = {
      id: item.id,
      label: item.label,
      icon: item.icon,
      link: item.link || "/#",
      isHeader: item.is_header,
      badgeName: item.badge_name,
      badgeColor: item.badge_color,
      stateVariables: false,
      click: item.subItems && item.subItems.length > 0 ? 
        (e: any) => this.handleMenuClick(e, item.id) : undefined,
    };

    // Add subItems if they exist
    if (item.subItems && item.subItems.length > 0) {
      transformed.subItems = item.subItems.map(subItem => this.transformMenuItem(subItem));
    }

    // Handle nested children
    if (item.subItems?.some(sub => sub.subItems && sub.subItems.length > 0)) {
      transformed.subItems = transformed.subItems?.map((subItem: any) => {
        if (subItem.subItems && subItem.subItems.length > 0) {
          return {
            ...subItem,
            isChildItem: true,
            childItems: subItem.subItems,
            click: (e: any) => this.handleChildMenuClick(e, subItem.id)
          };
        }
        return subItem;
      });
    }

    return transformed;
  }

  private handleMenuClick(e: any, itemId: string) {
    e.preventDefault();
    // This would need to be connected to the state management
    // For now, just prevent default behavior
    console.log(`Menu clicked: ${itemId}`);
  }

  private handleChildMenuClick(e: any, itemId: string) {
    e.preventDefault();
    console.log(`Child menu clicked: ${itemId}`);
  }
}

export const menuService = new MenuService();