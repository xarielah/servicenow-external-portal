export default () => ({
  secrets: {
    APP_CLIENT_ID: process.env.SN_APP_CLIENT_ID,
    APP_CLIENT_SECRET: process.env.SN_APP_CLIENT_SECRET,
    APP_USER: process.env.SN_APP_USER,
    APP_PASSWORD: process.env.SN_APP_PASSWORD,
    INSTANCE: process.env.SN_APP_URL,
  },
  ENV: process.env.NODE_ENV,
});
