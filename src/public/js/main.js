const date = new Date().toISOString().split('T')[0];

const getMetricsData = async (date) => {
  try {
    const res = await fetch(`/api/metrics/daily?date=${date}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch data for ${selectedDate}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching metrics data:', error);
    return null;
  }
};

const fillMetrics = async (data, selectedDate) => {
  const globalIntegrations = document.getElementById('totalGlobalIntegrations');
  if (data.totalIntegrations !== undefined) {
    globalIntegrations.textContent = data.totalIntegrations;
  }

  const dailyIntegrations = document.getElementById('totalDayIntegrations');
  if (data.metrics.totalIntegrations !== undefined) {
    dailyIntegrations.textContent = `${selectedDate === date ? 'Today' : selectedDate}: +${data.metrics.totalIntegrations} new integrations`;
  }

  const globalAlerts = document.getElementById('totalGlobalAlerts');
  if (data.totalSentAlerts !== undefined) {
    globalAlerts.textContent = data.totalSentAlerts;
  }

  const dailyAlerts = document.getElementById('totalDayAlerts');
  if (data.metrics.totalSentAlerts !== undefined) {
    dailyAlerts.textContent = `${selectedDate === date ? 'Today' : selectedDate}: +${data.metrics.totalSentAlerts} alerts sent`;
  }

  const globalErrors = document.getElementById('totalGlobalErrors');
  if (data.totalErrors !== undefined) {
    globalErrors.textContent = data.totalErrors;
  }

  const dailyErrors = document.getElementById('totalDayErrors');
  if (data.metrics.totalErrors !== undefined) {
    dailyErrors.textContent = `${selectedDate === date ? 'Today' : selectedDate}: +${data.metrics.totalErrors} failed attempts`;
  }
};

const initializeMetrics = async (date) => {
  const res = await getMetricsData(date);

  fillMetrics(res, date);
};

const dateSelector = document.getElementById('date-selector');
dateSelector.setAttribute('min', '2026-01-31');
dateSelector.setAttribute('max', date);
dateSelector.value = date;
let selectedDate = date;
dateSelector.addEventListener('change', async (event) => {
  selectedDate = event.target.value;
  const dateRes = new Date();
  const minDate = new Date('2026-01-31');

  if (new Date(selectedDate) < minDate) {
    selectedDate = minDate.toISOString().split('T')[0];
    dateSelector.value = minDate.toISOString().split('T')[0];
    alert('Selected date cannot be in the future or before 2026-01-31.');
    try {
      const data = await getMetricsData(selectedDate);

      console.log(`Fetching data for date: ${selectedDate}`);

      fillMetrics(data, selectedDate);
    } catch (error) {
      console.error(error);
    }
  }

  if (new Date(selectedDate) > dateRes) {
    selectedDate = dateRes.toISOString().split('T')[0];
    dateSelector.value = dateRes.toISOString().split('T')[0];
    alert('Selected date cannot be in the future or before 2026-01-31.');
    try {
      const data = await getMetricsData(selectedDate);

      console.log(`Fetching data for date: ${selectedDate}`);

      fillMetrics(data, selectedDate);
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const data = await getMetricsData(selectedDate);

    console.log(`Fetching data for date: ${selectedDate}`);

    fillMetrics(data, selectedDate);
  } catch (error) {
    console.error(error);
  }
});

initializeMetrics(date);
if (selectedDate === undefined || selectedDate === null || selectedDate === date) {
  setInterval(() => {
    initializeMetrics(selectedDate);
  }, 300000); // Update every 5 minutes
}
