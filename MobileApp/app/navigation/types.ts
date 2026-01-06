export type RootStackParamList = {
    Login: undefined;
    InfoScreen: undefined;
    Ticket: { agentId?: string } | undefined;
    Confirm: {
      ticketNumber: string;
      price: number;
      gifts: string[];
      agentId: string;
    };
    Random: {
      ticketNumber: string;
      price: number;
      gifts: string[];
      agentId: string;
    };
    Quatro: {
      ticketNumber: string;
      agentId: string;
    };
    Game: {
      ticketNumber: string;
      agentId: string;
      numbers: number[];
    };
    Result: {
      gift: string;
      price: number;
      ticketNumber: string;
      agentId: string;
      outcome: 'done' | 'win';
      score?: number;
    };
  };
