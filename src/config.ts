interface GoogleConfig {
  API_KEY: string;
  CLIENT_ID: string;
  SECRET: string;
}

interface FacebookConfig {
  APP_ID: string;
}

interface ApiConfig {
  API_URL: string;
}

interface MenuConfig {
  USE_DYNAMIC_MENU: boolean;
  FALLBACK_TO_STATIC: boolean;
}

interface Config {
  google: GoogleConfig;
  facebook: FacebookConfig;
  api: ApiConfig;
  menu: MenuConfig;
}

const apiUrl = (process.env.REACT_APP_API_URL as string) || "http://localhost:5001";

// Menu configuration
const useDynamicMenu = process.env.REACT_APP_USE_DYNAMIC_MENU === 'true' || false;
const fallbackToStatic = process.env.REACT_APP_FALLBACK_TO_STATIC !== 'false';

const config: Config = {
  google: {
    API_KEY: "",
    CLIENT_ID: "",
    SECRET: "",
  },
  facebook: {
    APP_ID: "",
  },
  api: {
    API_URL: apiUrl,
  },
  menu: {
    USE_DYNAMIC_MENU: useDynamicMenu,
    FALLBACK_TO_STATIC: fallbackToStatic,
  },
};

export default config;