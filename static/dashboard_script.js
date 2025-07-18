async function fetchDataAndRenderChart(
    apiEndpoint,
    chartElementId,
    chartConfig
) {
        
        try { 
            let response = await fetch(apiEndpoint);
            let data = await response.json();
            const ctx = document.getElementById(chartElementId).getContext("2d");
            new Chart(ctx, chartConfig(data));
        } catch (error) { console.error("Error fetching or rendering chart:", error);
    }
}

fetchDataAndRenderChart("/api/low_stock_levels", "stockChart", (data) => ({
    type: "bar",
    data: {
      labels: data.products,
      datasets: [
        {
          label: "Low Stock",
          data: data.quantities,
          // ... other config
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          display: false, // This will hide the x-axis labels
        },
      },
    },
  })); */

fetchDataAndRenderChart('/api/task_status_pie')
          .then(response => response.json())
          .then(data => {
               const ctx = document.getElementById('pieChart').getContext('2d');
               new Chart(ctx, {
                   type: 'pie',
                   data: {
                       labels: data.labels,
                       datasets: [{
                           data: data.counts,
                           backgroundColor: [
                               'rgb(0, 155, 0)',
                               'rgb(152, 206, 0)',
                               'rgb(255, 206, 86)',
                               'rgb(255, 255, 0)'
                           ]
                       }]
                   }
               });
           })
           
fetchDataAndRenderChart('/api/week_accuracy_bar', 'WeekAccuracyBar', (data) => ({
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Weekly Accuracy',
          data: data.counts,
          backgroundColor: 'rgb(237, 243, 237)',
          borderColor: 'rgb(42, 43, 41)',
          borderWidth: 1,
        },
      ],
    }}));
