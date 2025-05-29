// Enhanced Luxury Theme Configuration
export const enhancedLuxuryTheme = {
  colors: {
    // Primary colors
    primary: {
      darkest: '#000000',   // Pure black
      dark: '#0A0A0A',      // Deep black
      main: '#121212',      // Rich black
      light: '#1E1E1E',     // Soft black
      accent: '#D4AF37',    // Gold
      accentHover: '#E5C158', // Lighter gold for hover states
    },
    // Secondary colors
    secondary: {
      main: '#F8C3CD',      // Soft pink
      light: '#FFDFD3',     // Light pink
      dark: '#E6A4B4',      // Dark pink
    },
    // Neutral colors
    neutral: {
      ivory: '#FFFFF0',     // Ivory
      softWhite: '#F5F5F5', // Soft white
      champagne: '#F7E7CE', // Champagne
      darkest: '#121212',   // Almost black
      dark: '#1E1E1E',      // Dark gray
      medium: '#2D2D2D',    // Medium gray
      light: '#3A3A3A',     // Light gray
      lightest: '#484848',  // Lightest gray
    },
    // Text colors
    text: {
      primary: '#FFFFFF',   // White for primary text
      secondary: '#E0E0E0', // Light gray for secondary text
      muted: '#A0A0A0',     // Muted text
      accent: '#D4AF37',    // Gold accent text
    },
    // Status colors
    status: {
      success: '#4CAF50',
      error: '#B71C1C',
      warning: '#F9A825',
      info: '#0288D1',
    },
    // Background gradients
    gradients: {
      gold: 'linear-gradient(135deg, #D4AF37 0%, #F5E1A4 50%, #D4AF37 100%)',
      softGold: 'linear-gradient(135deg, #D4AF37 0%, #F5E1A4 30%, #D4AF37 100%)',
      roseGold: 'linear-gradient(135deg, #B76E79 0%, #EACDD3 50%, #B76E79 100%)',
      dark: 'linear-gradient(135deg, #0A0A0A 0%, #1E1E1E 100%)',
      blackToGold: 'linear-gradient(135deg, #000000 0%, #0A0A0A 85%, #D4AF37 100%)',
      subtlePink: 'linear-gradient(135deg, #F8C3CD 0%, #FFDFD3 50%, #F8C3CD 100%)',
    },
  },
  
  // Typography
  typography: {
    // Font families
    fontFamily: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
      accent: "'Poppins', sans-serif",
    },
    // Font weights
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // Letter spacing
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    // Line heights
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.6)',
    glow: '0 0 15px rgba(212, 175, 55, 0.5)',
    subtleGlow: '0 0 10px rgba(212, 175, 55, 0.3)',
    goldInset: 'inset 0 0 0 1px rgba(212, 175, 55, 0.3)',
    textGlow: '0 0 2px rgba(212, 175, 55, 0.3)',
  },
  
  // Borders
  borders: {
    thin: '1px solid rgba(212, 175, 55, 0.3)',
    medium: '2px solid rgba(212, 175, 55, 0.4)',
    thick: '3px solid rgba(212, 175, 55, 0.5)',
    radius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '1rem',
      full: '9999px',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
    xxxl: '4rem',    // 64px
  },
  
  // Animations
  animations: {
    transition: {
      fast: '0.2s ease-in-out',
      medium: '0.3s ease-in-out',
      slow: '0.5s ease-in-out',
    },
    keyframes: {
      shimmer: 'shimmer 2s infinite linear',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      float: 'float 6s ease-in-out infinite',
      glow: 'glow 1.5s ease-in-out infinite alternate',
    },
  },
  
  // Glassmorphism
  glass: {
    light: 'backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.1);',
    dark: 'backdrop-filter: blur(8px); background-color: rgba(10, 10, 10, 0.8);',
    gold: 'backdrop-filter: blur(8px); background-color: rgba(212, 175, 55, 0.05);',
  },
  
  // Z-index
  zIndex: {
    behind: -1,
    base: 0,
    above: 1,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
    toast: 70,
    max: 9999,
  },
};

// Helper function to get nested theme values
export const getThemeValue = (path, theme = enhancedLuxuryTheme) => {
  return path.split('.').reduce((acc, part) => acc && acc[part] ? acc[part] : null, theme);
};

export default enhancedLuxuryTheme;
