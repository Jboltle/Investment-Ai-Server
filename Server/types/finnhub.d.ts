declare module 'finnhub' {
  export interface Quote {
    c: number;  // Current price
    d: number;  // Change
    dp: number; // Percent change
    h: number;  // High price of the day
    l: number;  // Low price of the day
    o: number;  // Open price of the day
    pc: number; // Previous close price
  }

  export class ApiClient {
    static instance: {
      authentications: {
        'api_key': {
          apiKey: string;
        };
      };
    };
  }

  export class DefaultApi {
    quote(symbol: string, callback?: (error: any, data: Quote, response: any) => void): Promise<Quote>;
  }
} 