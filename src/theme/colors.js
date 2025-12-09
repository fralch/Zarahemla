import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const colors = {
  primary: '#FF5E78',
  background: '#FFFFFF',
  text: '#333333',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#F5F5F5',
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5E78',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#757575',
    border: '#E0E0E0',
    notification: '#FF5E78',
    success: '#4CAF50',
    error: '#F44336',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#F5F5F5',
    inputBackground: '#F5F5F5',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF5E78',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
    notification: '#FF5E78',
    success: '#81C784',
    error: '#E57373',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#333333',
    inputBackground: '#333333',
  },
};
