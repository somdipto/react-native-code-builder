export interface TemplateItem {
  id: string; // Unique ID within the template
  componentType: string; // e.g., 'Button', 'Text', 'Input'
  x: number; // Initial X position on canvas (can be adjusted by layout logic later)
  y: number; // Initial Y position on canvas
  props?: Record<string, any>; // Component-specific properties
}

export const loginScreenTemplate: TemplateItem[] = [
  {
    id: 'login-title',
    componentType: 'Text',
    x: 100,
    y: 50,
    props: { content: 'Login Screen' },
  },
  {
    id: 'login-username-input',
    componentType: 'Input',
    x: 50,
    y: 100,
    props: { placeholder: 'Username' },
  },
  {
    id: 'login-password-input',
    componentType: 'Input',
    x: 50,
    y: 150,
    props: { placeholder: 'Password', secureTextEntry: true },
  },
  {
    id: 'login-submit-button',
    componentType: 'Button',
    x: 100,
    y: 200,
    props: { text: 'Submit' },
  },
];

export const homeScreenTemplate: TemplateItem[] = [
  {
    id: 'home-welcome-text',
    componentType: 'Text',
    x: 100,
    y: 50,
    props: { content: 'Welcome Home!' },
  },
  {
    id: 'home-profile-button',
    componentType: 'Button',
    x: 50,
    y: 120,
    props: { text: 'My Profile' },
  },
  {
    id: 'home-settings-button',
    componentType: 'Button',
    x: 50,
    y: 180,
    props: { text: 'Settings' },
  },
  {
    id: 'home-info-text',
    componentType: 'Text',
    x: 20,
    y: 250,
    props: { content: 'This is a basic home screen layout.'}
  }
];
