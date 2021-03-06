export const dbConnectionManageService = (dbConnectService) => ({
  before: async () => {
    await dbConnectService.connect();
  },
  after: async () => {
    await dbConnectService.end();
  },
  onError: async () => {
    await dbConnectService.end();
  },
})
