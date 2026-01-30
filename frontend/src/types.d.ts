/**
 * Type declarations for third-party modules without @types packages
 */

import { ComponentType, ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

// Suppress implicit any for @expo/vector-icons until proper types are available
declare module '@expo/vector-icons' {
  export const Ionicons: ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: ViewStyle | TextStyle;
    [key: string]: any;
  }>;

  export const MaterialCommunityIcons: ComponentType<any>;
  export const FontAwesome: ComponentType<any>;
  export const FontAwesome5: ComponentType<any>;
  export const AntDesign: ComponentType<any>;
  export const Entypo: ComponentType<any>;
  export const EvilIcons: ComponentType<any>;
  export const Feather: ComponentType<any>;
  export const Foundation: ComponentType<any>;
  export const Octicons: ComponentType<any>;
  export const SimpleLineIcons: ComponentType<any>;
  export const Zocial: ComponentType<any>;
  export const MaterialIcons: ComponentType<any>;
  export const Fontisto: ComponentType<any>;

  // Export IconsLazy to suppress implicit any error
  export const IconsLazy: any;
  export const useFonts: any;
  export const FontAwesomeIcon: any;
}
