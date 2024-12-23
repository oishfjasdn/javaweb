<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Ad Performance Visualization</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
        }
        h2 {
            color: #007bff;
            margin-bottom: 20px;
            text-align: center;
        }
        canvas {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<h2>Ad Performance Visualization</h2>

<div style="width:80%; margin:auto;">
    <canvas id="adPerformanceChart"></canvas>
</div>
<%
    int userId = (int) session.getAttribute("userId");
%>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/manageAds?action=getPerformance&userId=<%=userId%>')//
            .then(response => response.json())
            .then(data => {
                new Chart(document.getElementById('adPerformanceChart').getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'Click Count',
                            data: data.clickCounts,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(255, 159, 64, 0.6)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return data.labels[tooltipItem.dataIndex] + ': ' + data.clickCounts[tooltipItem.dataIndex];
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    });
</script>

<a href="advertisement.jsp">Back to Advertisements List</a>
<br>
<a href="add_advertisement.jsp">Add New Advertisement</a>
<br>
<a href="logout.jsp">Logout</a>
</body>
</html>