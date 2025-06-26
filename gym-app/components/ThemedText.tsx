import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'greyed' | 'smallSemiBold' | 'underlined'
        | 'greyedSub';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'greyed' ? styles.greyed : undefined,
        type === 'smallSemiBold' ? styles.smallSemiBold : undefined,
        type === 'underlined' ? styles.underlined : undefined,
        type === 'greyedSub' ? styles.greyedSub : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 55,
  },
  subtitle: {
    fontSize: 27,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  greyed: {
    fontSize: 16,
    lineHeight: 24,
    color: '#717171',
  },
  smallSemiBold: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '600',
  },

  underlined: {
    fontSize: 18,
    fontWeight: '800',
    textDecorationLine: 'underline'
  },

  greyedSub:{
    fontSize: 18,
    fontWeight: '800',
    color: '#9D9D9D',
  },
});
