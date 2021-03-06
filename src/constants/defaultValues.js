/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;

export const BASE_URI = '/public/api'; // TODO: Move to constants file
export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost/theblackps' : 'http://theblackps.com/theblackps';
export const RESOURCE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost/theblackps/public' : 'http://theblackps.com/theblackps/public'
/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const isMultiColorActive = true;
export const defaultColor = "light.purple";
export const isDarkSwitchActive = true;
export const themeColorStorageKey="__theme_color";
