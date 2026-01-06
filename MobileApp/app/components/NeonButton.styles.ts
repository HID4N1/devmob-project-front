import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradient: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: '#00D1FF',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 2,
    alignItems: 'center',
  },
  innerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { color: '#FFFFFF', fontSize: 16, marginRight: 6 },
  label: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
});