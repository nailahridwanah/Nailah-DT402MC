async function fetchDataAndRenderChart(
    apiEndpoint,
    chartElementId,
    chartConfig
) {
        
        try { 
            let response = await fetch(apiEndpoint);
            let data = await response.json();
            const ctx = document.getElementById(chartElementId).getContext('2d');
            new Chart(ctx, chartConfig(data));
        } catch (error) { console.error('Error fetching or rendering chart:', error);
    }
}

let weekAccuracyData = null;
let weekAccuracyScatterData = null;
let lineChart = null;
let scatterChart = null;

// Fetch both datasets separately and draw charts
Promise.all([
  fetch('/api/week_accuracy_line').then(res => res.json()),
  fetch('/api/time_spent_accuracy_scatter').then(res => res.json())
]).then(([lineData, scatterData]) => {
  weekAccuracyData = lineData;
  weekAccuracyScatterData = scatterData.labels.map((label, index) => ({
    x: label, // Hours (shouldn't change)
    y: scatterData.counts[index] // Accuracy (Changing using slider)
  }));
  drawLineChart(lineData);
  drawScatterChart({points: weekAccuracyScatterData});
}).catch(error => {
  console.error('Data fetch failed:', error);
});

// Render Line Chart: Weekly Accuracy
function drawLineChart(data) {
  const ctx = document.getElementById('WeekAccuracyLine').getContext('2d');
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Average Weekly Accuracy',
        data: data.counts,
        backgroundColor: 'rgb(152, 206, 0)',
        borderColor: 'rgb(110, 110, 110)',
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { title: { display: true, text: 'Week' } },
        y: { title: { display: true, text: 'Accuracy (%)' }, beginAtZero: false } // Y-axis set to not start at zero for better visualisation
    }
  }});
}


// Render Scatter Chart: Time Spent vs. Accuracy
function drawScatterChart({ points }) {
  const ctx = document.getElementById('TimeSpentAccuracyScatter').getContext('2d');
  if (scatterChart) scatterChart.destroy();

  scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Time Spent (hours) vs. Model Accuracy (%)',
        data: points,
        backgroundColor: 'rgb(152, 206, 0)',
        borderColor: 'rgb(110, 110, 110)',
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Hours' } },
        y: { title: { display: true, text: 'Accuracy (%)' }, beginAtZero: true } // Y-axis starts at zero
      }
    }
  });
}

// Slider filtering for Line and Scatter Chart
const slider = document.getElementById('AccuracySlider');
const valueDisplay = document.getElementById('AccuracyValue');

slider.oninput = function () {
  const threshold = parseFloat(this.value);
  valueDisplay.textContent = threshold;

  // Filter line chart data
  const filteredLine = {
    labels: [],
    counts: []};

  for (let i = 0; i < weekAccuracyData.labels.length; i++) {
    if (weekAccuracyData.counts[i] >= threshold) {
      filteredLine.labels.push(weekAccuracyData.labels[i]); 
      filteredLine.counts.push(weekAccuracyData.counts[i]);
    }
  }

  // Filter scatter chart data using weekAccuracyScatterData
  const filteredScatter = weekAccuracyScatterData.filter(point => parseFloat(point.y) >= threshold);

  drawLineChart(filteredLine);
  drawScatterChart({ points: filteredScatter });
};

fetchDataAndRenderChart('/api/task_status_pie', 'StatusPieChart', (data => ({
                   type: 'pie',
                   data: {
                       labels: data.labels,
                       datasets: [{
                           data: data.counts,
                           backgroundColor: [
                               'rgb(0, 155, 0)', // Pie chart colouring
                               'rgb(152, 206, 0)',
                               'rgb(255, 206, 86)'],
                            borderColor: 'rgb(110, 110, 110)',
                            borderWidth: 1.5, // Made border thicker for visual aesthetics
                       }]
                   }
               })
            ));

fetchDataAndRenderChart('/api/priority_pie', 'PriorityPieChart', (data => ({
                   type: 'pie',
                   data: {
                       labels: data.labels,
                       datasets: [{
                           data: data.counts,
                           backgroundColor: [
                               'rgb(0, 155, 0)', // Pie chart colouring with BP colours
                               'rgb(152, 206, 0)',
                               'rgb(255, 206, 86)'],
                            borderColor: 'rgb(110, 110, 110)',
                            borderWidth: 1.5, 
                    }]
                }
               })
            ));


fetchDataAndRenderChart('/api/task_member_count_bar', 'TaskMemberBar', (data) => ({
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Tasks per Member',
          data: data.counts,
          backgroundColor: 'rgb(152, 206, 0)', // Bar chart colouring with BP colours
          borderColor: 'rgb(110, 110, 110)',
          borderWidth: 1.5,
        },
      ],
    }}));
