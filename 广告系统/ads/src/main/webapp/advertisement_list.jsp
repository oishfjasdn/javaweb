<%@ page import="java.sql.*" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Advertisement List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4; /* Light gray background */
            color: #333; /* Dark gray text */
        }
        h2 {
            color: #007bff; /* Blue color for headings */
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ddd; /* Light gray border */
        }
        th, td {
            border: 1px solid #ddd; /* Light gray border */
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2; /* Light gray background for headers */
            color: #333; /* Dark gray text for headers */
        }
        img {
            max-width: 100px;
            height: auto;
        }
        button {
            background-color: #007bff; /* Blue color for buttons */
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            width: 100%;
        }
        button:hover {
            opacity: 0.8;
        }
        .ad-container {
            border: 1px solid #ddd; /* Light gray border */
            padding: 20px;
            margin: 20px 0;
            background-color: #f2f2f2; /* Light gray background */
        }
    </style>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            // 获取按钮元素
            var adButton = document.getElementById('fetchAdButton');

            // 为按钮添加点击事件监听器
            if (adButton) {
                adButton.addEventListener('click', fetchAd);
            }

            function fetchAd() {
                // 发送请求获取广告数据
                fetch('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
                    .then(response => response.json())
                    .then(adData => {
                        console.log('广告数据:', adData); // 调试用
                        if (adData) {
                            renderAd(adData);
                        }
                    })
                    .catch(error => console.error('Error loading ad:', error));
            }

            function renderAd(adData) {
                // 在这里定义如何渲染广告数据
                // 假设返回的数据包含一个message字段
                var adContainer = document.getElementById('randomAdContainer');
                if (adContainer) {
                    adContainer.innerHTML = '<p>' + adData.message + '</p>';
                }
            }
        });
    </script>
</head>
<body>
<h2>My Advertisements</h2>
<table>
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Detail Page</th>
        <th>Image</th>
        <th>Click Count</th>
        <th>Action</th>
    </tr>
    <%
        int userId = (int) session.getAttribute("userId");

        try {
            // Register JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM advertisements WHERE user_id = ?");
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String detailPage = rs.getString("detail_page");
                String imageUrl = rs.getString("image_url");
                int clickCount = rs.getInt("click_count");
    %>
    <tr>
        <td><%= id %></td>
        <td><%= title %></td>
        <td><%= detailPage %></td>
        <td><img src="http://ads.wztj.net:8000/<%= imageUrl %>" alt="<%= title %>" width="100"></td>
        <td><%= clickCount %></td>
        <td>
            <a href="edit_advertisement.jsp?id=<%= id %>">Edit</a>
            <a href="manageAds?action=delete&id=<%= id %>">Delete</a>
        </td>
    </tr>
    <%
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    %>
</table>
<br>

<!-- 添加一个按钮 -->
<button id="fetchAdButton">获取随机广告</button>

<!-- 随机广告显示容器 -->
<div id="randomAdContainer" class="ad-container"></div>

<br>
<a href="add_advertisement.jsp">Add New Advertisement</a>
<br>
<a href="logout.jsp">Logout</a>
</body>
</html>