export const environment = {
  production: false,
  api: {
    baseUrl: 'https://asia-south1-stock-anaysis.cloudfunctions.net',
    endpoints: {
      niftyFutures: '/get-nifty-futures'
    }
  },
  websocket: {
    baseUrl: ''
  }
} as const;
