export const environment = {
  production: true,
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
