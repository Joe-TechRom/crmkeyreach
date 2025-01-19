export const customTheme = {
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },

  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'neutral.900' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'neutral.900',
        transition: 'all 0.2s ease-in-out',
      },
      '*::selection': {
        backgroundColor: 'primary.light',
        color: 'white',
      },
      'img': {
        maxWidth: '100%',
        height: 'auto',
        transition: 'transform 0.2s ease-in-out',
      }
    }),
  },

  colors: {
    primary: {
      50: '#E5EDFF',
      100: '#CCE0FF',
      200: '#99C1FF',
      300: '#66A3FF',
      400: '#3384FF',
      500: '#2D5BFF',
      600: '#1939B7',
      700: '#142C8A',
      800: '#0F1F5C',
      900: '#0A112E',
      main: '#2D5BFF',
      light: '#6B8EFF',
      dark: '#1939B7',
      gradient: 'linear-gradient(135deg, #2D5BFF 0%, #6B8EFF 100%)',
      glassmorphism: 'rgba(45, 91, 255, 0.1)',
    },
    
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    background: {
      primary: { _light: 'white', _dark: 'neutral.900' },
      secondary: { _light: 'gray.50', _dark: 'neutral.800' },
      elevated: { _light: 'white', _dark: 'neutral.800' },
      glass: { 
        _light: 'rgba(255, 255, 255, 0.8)', 
        _dark: 'rgba(26, 32, 44, 0.8)' 
      },
      gradient: {
        _light: 'linear(to bottom right, #ffffff, #f7f7f7)',
        _dark: 'linear(to bottom right, #1A1B1E, #141517)'
      },
    },

    text: {
      primary: { _light: 'neutral.900', _dark: 'white' },
      secondary: { _light: 'neutral.600', _dark: 'neutral.300' },
      disabled: { _light: 'neutral.400', _dark: 'neutral.600' },
      gradient: { _light: 'primary.gradient', _dark: 'primary.gradient' },
    },

    border: {
      default: { _light: 'neutral.200', _dark: 'neutral.700' },
      active: { _light: 'primary.500', _dark: 'primary.400' },
      glass: { 
        _light: 'rgba(255, 255, 255, 0.3)', 
        _dark: 'rgba(255, 255, 255, 0.1)' 
      },
    },
  },

  semanticTokens: {
    colors: {
      'chakra-body-bg': { _light: 'white', _dark: 'neutral.900' },
      'chakra-body-text': { _light: 'neutral.900', _dark: 'white' },
    },
  },

  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    highlight: '0 0 0 3px rgba(45, 91, 255, 0.6)',
    card: '0 8px 32px rgba(0, 0, 0, 0.08)',
    'card-hover': '0 12px 48px rgba(0, 0, 0, 0.12)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  radii: {
    none: '0',
    sm: '0.25rem',
    base: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    full: '9999px',
    card: '24px',
    button: '16px',
  },

  blur: {
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
  },

  components: {
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'card',
          bg: 'background.elevated',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            transform: 'translateY(-4px)',
            shadow: 'card-hover',
          },
        },
      },
      variants: {
        glass: {
          bg: 'background.glass',
          backdropFilter: 'blur(blur.lg)',
          borderWidth: '1px',
          borderColor: 'border.glass',
        },
        elevated: {
          shadow: 'card',
          bg: 'background.elevated',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'button',
        transition: 'all 0.2s ease-in-out',
      },
    },
    Image: {
      baseStyle: {
        maxWidth: '100%',
        height: 'auto',
        transition: 'transform 0.2s ease-in-out',
      },
      variants: {
        responsive: {
          width: '100%',
          objectFit: 'cover',
        },
      },
    },
  },
}
