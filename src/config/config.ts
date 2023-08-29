export default () => ({
  virustotalAPIKEY: process.env.VIRUSTOTAL_APIKEY,
  virustotalURL: process.env.VIRUSTOTAL_URL,
  whoIsAPIKEY: process.env.WHOIS_APIKEY,
  whoIsURL: process.env.WHOIS_URL,
  cronExpression: process.env.CRON_EXPRESSION || '0 0 1 * *',
});
