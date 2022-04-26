export const parseAccessToken = (accessToken: string) => {
  return accessToken.trim().split(' ')[1];
};
