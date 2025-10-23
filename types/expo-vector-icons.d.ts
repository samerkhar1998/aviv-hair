declare module '@expo/vector-icons' {
  import type { ComponentType } from 'react';

  type IconComponent = ComponentType<any>;

  export const Feather: IconComponent;
  export const MaterialCommunityIcons: IconComponent;
}
