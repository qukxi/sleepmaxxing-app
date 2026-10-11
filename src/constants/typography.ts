import { Platform } from 'react-native';

export const FONTS = {
  regular: Platform.select({
    ios: 'JetBrainsMono_400Regular',
    android: 'JetBrainsMono_400Regular',
    default: 'JetBrainsMono_400Regular, Menlo, monospace',
  }),
  medium: Platform.select({
    ios: 'JetBrainsMono_500Medium',
    android: 'JetBrainsMono_500Medium',
    default: 'JetBrainsMono_500Medium, Menlo, monospace',
  }),
  bold: Platform.select({
    ios: 'JetBrainsMono_700Bold',
    android: 'JetBrainsMono_700Bold',
    default: 'JetBrainsMono_700Bold, Menlo, monospace',
  }),
  extraBold: Platform.select({
    ios: 'JetBrainsMono_800ExtraBold',
    android: 'JetBrainsMono_800ExtraBold',
    default: 'JetBrainsMono_800ExtraBold, Menlo, monospace',
  }),
};
