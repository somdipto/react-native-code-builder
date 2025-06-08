// Using TemplateItem as the base for AppDroppedItem
import { TemplateItem as BaseTemplateItem } from './templates';

// Define the structure for navigation properties
export interface NavigationProps {
  targetScreenId: string;
}

// Extend the props of BaseTemplateItem to include optional navigation
export interface AppDroppedItem extends Omit<BaseTemplateItem, 'props'> {
  props?: BaseTemplateItem['props'] & {
    navigation?: NavigationProps;
    // Future style props can be added here too
    // e.g., color?: string; fontSize?: number;
  };
}

export interface Screen {
  id: string;
  name: string;
  items: AppDroppedItem[];
}
