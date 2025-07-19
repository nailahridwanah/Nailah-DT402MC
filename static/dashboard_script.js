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

fetchDataAndRenderChart('/api/task_status_pie', 'StatusPieChart', (data => ({
                   type: 'pie',
                   data: {
                       labels: data.labels,
                       datasets: [{
                           data: data.counts,
                           backgroundColor: [
                               'rgb(0, 155, 0)',
                               'rgb(152, 206, 0)',
                               'rgb(255, 206, 86)',
                               'rgb(255, 255, 0)'],
                            borderColor: 'rgb(110, 110, 110)',
                            borderWidth: 1.5, // Made border thicker for visual aesthetics
                       }]
                   }
               })
            ));

fetchDataAndRenderChart('/api/week_accuracy_line', 'WeekAccuracyLine', (data) => ({
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Weekly Accuracy',
          data: data.counts,
          backgroundColor: 'rgb(152, 206, 0)',
          borderColor: 'rgb(110, 110, 110)',
          borderWidth: 1.5,
        },
      ],
    }}));


fetchDataAndRenderChart('/api/task_member_count_bar', 'TaskMemberBar', (data) => ({
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Tasks per Member',
          data: data.counts,
          backgroundColor: 'rgb(152, 206, 0)',
          borderColor: 'rgb(110, 110, 110)',
          borderWidth: 1.5,
        },
      ],
    }}));
