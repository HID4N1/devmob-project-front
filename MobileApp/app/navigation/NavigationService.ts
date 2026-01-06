import { router } from 'expo-router';

export const NavigationService = {
  navigateToLogin: () => router.push('/screens/Login'),
  navigateToInfoScreen: () => router.push('/screens/InfoScreen'),
  navigateToGame: (params: { ticketNumber: string; agentId: string; numbers: number[] }) => router.push({ pathname: '/screens/Game', params: { ticketNumber: params.ticketNumber, agentId: params.agentId, numbers: JSON.stringify(params.numbers) } }),
  navigateToQuattro: () => router.push('/screens/Quattro'),
  navigateToResult: () => router.push('/screens/Result'),
  goBack: () => router.back(),
  replaceToLogin: () => router.replace('/screens/Login'),
};
