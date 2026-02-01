const date = new Date().toISOString().split('T')[0];
const res = await fetch(`/api/metrics/daily?date=${date}`);
const data = await res.json();

console.log('Daily Metrics:', data);

const globalIntegrations = document.getElementById('totalGlobalIntegrations');
if (data.totalIntegrations !== undefined) {
  globalIntegrations.textContent = data.totalIntegrations;
}

const dailyIntegrations = document.getElementById('totalDayIntegrations');
if (data.metrics.totalIntegrations !== undefined) {
  dailyIntegrations.textContent = `Today: +${data.metrics.totalIntegrations} new integrations`;
}

const globalAlerts = document.getElementById('totalGlobalAlerts');
if (data.totalSentAlerts !== undefined) {
  globalAlerts.textContent = data.totalSentAlerts;
}

const dailyAlerts = document.getElementById('totalDayAlerts');
if (data.metrics.totalSentAlerts !== undefined) {
  dailyAlerts.textContent = `Today: +${data.metrics.totalSentAlerts} alerts sent`;
}

const globalErrors = document.getElementById('totalGlobalErrors');
if (data.totalErrors !== undefined) {
  globalErrors.textContent = data.totalErrors;
}

const dailyErrors = document.getElementById('totalDayErrors');
if (data.metrics.totalErrors !== undefined) {
  dailyErrors.textContent = `Today: +${data.metrics.totalErrors} failed attempts`;
}
