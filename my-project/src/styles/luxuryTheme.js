// Luxury Theme Configuration
export const luxuryTheme = {
  colors: {
    // Primary colors
    primary: {
      dark: '#0A0A0A',      // Deep black
      main: '#121212',      // Rich black
      light: '#1E1E1E',     // Soft black
      accent: '#D4AF37',    // Gold
      accentHover: '#E5C158', // Lighter gold for hover states
    },
    // Secondary colors
    secondary: {
      main: '#B76E79',      // Rose gold
      light: '#C98490',     // Light rose gold
      dark: '#9E5A65',      // Dark rose gold
    },
    // Neutral colors
    neutral: {
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
      roseGold: 'linear-gradient(135deg, #B76E79 0%, #EACDD3 50%, #B76E79 100%)',
      dark: 'linear-gradient(135deg, #0A0A0A 0%, #1E1E1E 100%)',
    },
  },
  
  // Typography
  typography: {
    // Font families
    fontFamily: {
      heading: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      accent: "'Cormorant Garamond', serif",
    },
    // Font weights
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.6)',
    glow: '0 0 15px rgba(212, 175, 55, 0.5)',
    goldInset: 'inset 0 0 0 1px rgba(212, 175, 55, 0.3)',
  },
  
  // Borders
  borders: {
    thin: '1px solid rgba(212, 175, 55, 0.3)',
    medium: '2px solid rgba(212, 175, 55, 0.4)',
    thick: '3px solid rgba(212, 175, 55, 0.5)',
  },
  
  // Animations
  animations: {
    transition: {
      fast: '0.2s ease-in-out',
      medium: '0.3s ease-in-out',
      slow: '0.5s ease-in-out',
    },
  },
  
  // Glassmorphism
  glass: {
    light: 'backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.1);',
    dark: 'backdrop-filter: blur(8px); background-color: rgba(10, 10, 10, 0.8);',
  },
};

// Helper function to get nested theme values
export const getThemeValue = (path, theme = luxuryTheme) => {
  return path.split('.').reduce((acc, part) => acc && acc[part] ? acc[part] : null, theme);
};

export default luxuryTheme;
