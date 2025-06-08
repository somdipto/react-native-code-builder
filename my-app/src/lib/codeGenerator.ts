import { Screen, AppDroppedItem } from './types';

interface GeneratedFiles {
  "App.tsx": string;
  "package.json": string;
  // individualScreenFiles?: { [fileName: string]: string }; // For future expansion
}

const generateDefaultPackageJson = (screens: Screen[]): string => {
  // Collect component types to potentially inform dependencies, though Snack handles many by default.
  // This is more for a standalone RN project.
  const componentTypes = new Set<string>();
  screens.forEach(screen => {
    screen.items.forEach(item => componentTypes.add(item.componentType));
  });

  // Basic dependencies. Versions should be kept up-to-date or be more dynamic.
  const dependencies: Record<string, string> = {
    "react": "18.2.0", // Or a version compatible with your Next.js app's React
    "react-native": "0.72.6", // A common recent version
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/stack": "^6.3.17",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3",
    "react-native-gesture-handler": "~2.9.0",
    // Add other common dependencies if specific components (e.g. from react-native-elements) were used
  };

  // if (componentTypes.has('VectorIcon')) { // Example
  //   dependencies['react-native-vector-icons'] = '^9.0.0';
  // }

  const packageJson = {
    name: "my-generated-app",
    version: "0.0.1",
    private: true,
    scripts: {
      android: "react-native run-android",
      ios: "react-native run-ios",
      start: "react-native start",
    },
    dependencies,
    devDependencies: {
      "@babel/core": "^7.20.0",
      // Add other typical dev dependencies
    }
  };

  return JSON.stringify(packageJson, null, 2);
};


const generateAppTsx = (screens: Screen[], initialScreenId: string | null): string => {
  if (!screens || screens.length === 0) {
    return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No screens defined in the app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, color: 'grey' }
});`;
  }

  const generateScreenComponentString = (screen: Screen): string => {
    const componentImports = new Set<string>(['View', 'StyleSheet']); // Base imports

    const componentsCode = screen.items
      .map((item: AppDroppedItem) => {
        const props = item.props || {};
        let onPressAction = "() => {}";

        if (item.componentType === 'Button') {
          componentImports.add('Button');
          if (props.navigation?.targetScreenId) {
            onPressAction = `() => navigation.navigate('${props.navigation.targetScreenId}')`;
          } else {
            onPressAction = `() => alert('Button "${props.text || 'Button'}" from screen ${screen.name} pressed!')`;
          }
          // Note: React Native Button's style prop is limited. For extensive styling, a custom component (e.g., TouchableOpacity + Text) is needed.
          return `        <Button title="${props.text || 'Button'}" onPress={${onPressAction}} />`;
        } else if (item.componentType === 'Text') {
          componentImports.add('Text');
          return `        <Text style={styles.text}>${props.content || 'Text Content'}</Text>`;
        } else if (item.componentType === 'Input') {
          componentImports.add('TextInput');
          return `        <TextInput style={styles.input} placeholder="${props.placeholder || 'Enter text...'}" secureTextEntry={${!!props.secureTextEntry}} />`;
        }
        componentImports.add('Text'); // Fallback for unknown
        return `        <Text style={styles.text}>Unsupported: ${item.componentType}</Text>`;
      })
      .join('\\n');

    const screenComponentName = `${screen.id.replace(/-/g, '_')}ScreenComponent`;
    return `
// Screen: ${screen.name}
const ${screenComponentName} = ({ navigation }) => {
  return (
    <View style={styles.container}>
${componentsCode.length > 0 ? componentsCode : `      <Text style={styles.text}>Screen ${screen.name} is empty.</Text>`}
    </View>
  );
};`;
  };

  const screenComponentDefinitions = screens.map(generateScreenComponentString).join('\n\n');
  const stackScreenComponents = screens
    .map(screen => `        <Stack.Screen name="${screen.id}" component={${screen.id.replace(/-/g, '_')}ScreenComponent} options={{ title: '${screen.name.replace(/'/g, "\\'")}' }} />`)
    .join('\n');

  const actualInitialScreenId = initialScreenId && screens.find(s => s.id === initialScreenId) ? initialScreenId : screens[0].id;

  // Dynamically collect all unique RN components used across all screens for the main import.
  const rnComponentSet = new Set<string>(['View', 'StyleSheet']);
  screens.forEach(screen => {
    screen.items.forEach(item => {
      if (item.componentType === 'Button') rnComponentSet.add('Button');
      else if (item.componentType === 'Text') rnComponentSet.add('Text');
      else if (item.componentType === 'Input') rnComponentSet.add('TextInput');
      else rnComponentSet.add('Text'); // Default for unknown
    });
  });
  const rnImports = Array.from(rnComponentSet).join(', ');

  return `
import React from 'react';
import { ${rnImports} } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Global styles (could be moved to a separate file in a more complex app)
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  text: { fontSize: 16, marginVertical: 10, textAlign: 'center', color: '#333333' },
  input: { height: 45, borderColor: 'silver', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginVertical: 10, width: '90%', backgroundColor: '#FFFFFF' },
  // Note: React Native Button's style prop is limited. For extensive styling, custom components are typical.
});

// Screen Component Definitions
${screenComponentDefinitions}

// Main App Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="${actualInitialScreenId}">
${stackScreenComponents}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
`;
};


export const generateReactNativeCode = (
  screens: Screen[],
  initialScreenId: string | null
): GeneratedFiles => {
  const appTsxContent = generateAppTsx(screens, initialScreenId);
  const packageJsonContent = generateDefaultPackageJson(screens);

  return {
    "App.tsx": appTsxContent,
    "package.json": packageJsonContent,
  };
};
