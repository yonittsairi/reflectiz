export default () => ({
  virustotalAPIKEY: process.env.VIRUSTOTAL_APIKEY,
  virustotalURL: process.env.VIRUSTOTAL_URL,
  whoIsAPIKEY: process.env.WHOIS_APIKEY,
  whoIsURL: process.env.WHOIS_URL,
  cronExpression: process.env.CRON_EXPRESSION || '0 0 1 * *',
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['**/*.entity{.ts,.js}']
});
