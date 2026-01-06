import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  logo: {
    width: 2300,
    height: 180,
    alignSelf: 'center',
  },
  logo2: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 36,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: { color: '#111827', fontWeight: '600', fontSize: 16 },
  inputRow: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { paddingVertical: 8, fontSize: 16, flex: 1 },
});