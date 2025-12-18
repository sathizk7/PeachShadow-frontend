import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { menuService, MenuItem } from '../../services/menuService';
import { getLoggedinUser } from '../../helpers/api_helper';

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  menuStates: { [key: string]: boolean };
  currentState: string;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  menuStates: {},
  currentState: 'Dashboard'
};

// Async thunk for fetching user menus
export const fetchUserMenus = createAsyncThunk(
  'menus/fetchUserMenus',
  async (_, { rejectWithValue }) => {
    try {
      const user = getLoggedinUser();
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const menus = await menuService.getMenusForUser(user.id);
      return menus;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch menus');
    }
  }
);

// Async thunk for fetching all menus (admin)
export const fetchAllMenus = createAsyncThunk(
  'menus/fetchAllMenus',
  async (_, { rejectWithValue }) => {
    try {
      const menus = await menuService.getAllMenus();
      return menus;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch all menus');
    }
  }
);

// Async thunk for creating menu item
export const createMenuItem = createAsyncThunk(
  'menus/createMenuItem',
  async (menuItem: Omit<MenuItem, 'id'>, { rejectWithValue }) => {
    try {
      const newItem = await menuService.createMenuItem(menuItem);
      return newItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create menu item');
    }
  }
);

// Async thunk for updating menu item
export const updateMenuItem = createAsyncThunk(
  'menus/updateMenuItem',
  async ({ id, data }: { id: string; data: Partial<MenuItem> }, { rejectWithValue }) => {
    try {
      const updatedItem = await menuService.updateMenuItem(id, data);
      return updatedItem;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update menu item');
    }
  }
);

// Async thunk for deleting menu item
export const deleteMenuItem = createAsyncThunk(
  'menus/deleteMenuItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await menuService.deleteMenuItem(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete menu item');
    }
  }
);

const menuSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    toggleMenuState: (state, action) => {
      const { menuId } = action.payload;
      state.menuStates[menuId] = !state.menuStates[menuId];
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    resetMenuStates: (state) => {
      Object.keys(state.menuStates).forEach(key => {
        state.menuStates[key] = false;
      });
    },
    initializeMenuStates: (state, action) => {
      const { menuItems } = action.payload;
      const states: { [key: string]: boolean } = {};
      
      const processItems = (items: MenuItem[]) => {
        items.forEach(item => {
          if (!item.is_header) {
            states[item.id] = false;
          }
          if (item.subItems) {
            processItems(item.subItems);
          }
        });
      };

      processItems(menuItems);
      state.menuStates = states;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user menus
      .addCase(fetchUserMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchUserMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch all menus
      .addCase(fetchAllMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchAllMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create menu item
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update menu item
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Delete menu item
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const {
  toggleMenuState,
  setCurrentState,
  resetMenuStates,
  initializeMenuStates,
  clearError
} = menuSlice.actions;

export default menuSlice.reducer;