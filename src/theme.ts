export const theme = {
  primary: '#111111',     // replace with Aviv’s brand color
  secondary: '#F2F2F2',
  textOnPrimary: '#FFFFFF',
  radius: 10,
};

export const btn = {
  base: { padding: 14, borderRadius: theme.radius, alignItems: 'center' as const },
  primary: { backgroundColor: theme.primary },
  outline: { borderWidth: 1, borderColor: '#222' },
  textPrimary: { color: theme.textOnPrimary, fontWeight: '600' as const },
};