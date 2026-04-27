/**
 * Predefined color presets for KnowMine graph widgets.
 * All objects are compatible with the KnowMine ColorSpec DTO.
 */

/**
 * Default widget background — gradient using the app's primary and secondary palette colors.
 * Applied automatically when no backgroundColor is specified.
 */
export const APP_DEFAULT_BACKGROUND = { type: 'Gradient', primaryColor: '#3D4248', secondaryColor: '#2E3138' };
export const APP_DEFAULT_BACKGROUND_TYPE = 'ROUND_RECT';

/**
 * Predefined gradient ColorSpec objects.
 * Use these as values for barColor, lineColor, ringColor, etc.
 */
export const gradient = {
  blue: { type: 'Gradient', primaryColor: '#00FFFF', secondaryColor: '#0000FF' },
  sunset: { type: 'Gradient', primaryColor: '#FF8C00', secondaryColor: '#FF0000' },
  purple: { type: 'Gradient', primaryColor: '#800080', secondaryColor: '#4B0082' },
  neon: { type: 'Gradient', primaryColor: '#00FFCC', secondaryColor: '#0066FF' },
  green: { type: 'Gradient', primaryColor: '#00FF88', secondaryColor: '#006633' },
  amber: { type: 'Gradient', primaryColor: '#FFD700', secondaryColor: '#FF8C00' },
  red: { type: 'Gradient', primaryColor: '#FF4444', secondaryColor: '#CC0000' },
  pink: { type: 'Gradient', primaryColor: '#FF69B4', secondaryColor: '#C71585' },
  teal: { type: 'Gradient', primaryColor: '#00CED1', secondaryColor: '#008080' },
  gold: { type: 'Gradient', primaryColor: '#FFD700', secondaryColor: '#B8860B' },
};

/**
 * Predefined solid fill ColorSpec objects.
 */
export const fill = {
  white: { type: 'Fill', primaryColor: '#FFFFFF' },
  black: { type: 'Fill', primaryColor: '#000000' },
  red: { type: 'Fill', primaryColor: '#FF0000' },
  green: { type: 'Fill', primaryColor: '#00FF00' },
  orange: { type: 'Fill', primaryColor: '#FF8C00' },
  yellow: { type: 'Fill', primaryColor: '#FFD700' },
  dimWhite: { type: 'Fill', primaryColor: '#FFFFFF99' },
  dimWhiteLow: { type: 'Fill', primaryColor: '#FFFFFF26' },
  transparent: { type: 'Fill', primaryColor: '#00000000' },
};

/**
 * Page palette key constants.
 * These are resolved at render time by the KnowMine app to the user's active
 * page palette colors. Use them in any color string field.
 *
 * @example
 * import { palette } from 'knowmine-graphs';
 * makeBarChart({ barColor: { type: 'Fill', primaryColor: palette.accent } });
 */
export const palette = {
  primary: 'primary_color',
  secondary: 'secondary_color',
  background: 'background_color',
  text: 'text_color',
  accent: 'accent_color',
  custom: 'custom_color',
};

/**
 * Creates a solid fill ColorSpec from a hex string.
 * @param {string} hex - Hex color string (e.g. '#FF0000' or '#FF0000AA')
 * @returns {{ type: 'Fill', primaryColor: string }}
 */
export function solidColor(hex) {
  return { type: 'Fill', primaryColor: hex };
}

/**
 * Creates a two-color gradient ColorSpec.
 * @param {string} from - Start color (hex or palette key)
 * @param {string} to - End color (hex or palette key)
 * @returns {{ type: 'Gradient', primaryColor: string, secondaryColor: string }}
 */
export function gradientColor(from, to) {
  return { type: 'Gradient', primaryColor: from, secondaryColor: to };
}

/**
 * Creates a transparent fade gradient suitable for area fills.
 * @param {string} color - Opaque color (hex or palette key)
 * @returns {{ type: 'Gradient', primaryColor: string, secondaryColor: string }}
 */
export function fadeToTransparent(color) {
  return { type: 'Gradient', primaryColor: color, secondaryColor: '#00000000' };
}
