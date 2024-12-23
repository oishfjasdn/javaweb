<%@ page import="java.sql.*" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Advertisement List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0; /* Light gray background */
            color: #333; /* Dark gray text */
        }
        h2 {
            color: #007bff; /* Blue color for headings */
            margin-bottom: 20px;
            text-align: center; /* Center align headings */
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
            background-color: #007bff; /* Blue background for table headers */
            color: #fff; /* White text for table headers */
        }
        img {
            max-width: 100px;
            height: auto;
            border-radius: 10px; /* Rounded corners for images */
        }
        a {
            text-decoration: none;
            color: #007bff; /* Blue color for links */
        }
        a:hover {
            color: #0056b3; /* Darker blue on hover */
        }
    </style>
</head>
<body>
<h2>My Advertisements</h2>
<table border="1">
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
            PreparedStatement stmt2 = conn.prepareStatement("SELECT * FROM advertisements");
            ResultSet rs;
            if (userId == 1) {
                rs = stmt2.executeQuery();
            } else {
                stmt.setInt(1, userId);
                rs = stmt.executeQuery();
            }

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
        <td><img src="<%= imageUrl %>" width="100"></td>
        <td><%= clickCount %></td>
        <td>
            <a href="edit_advertisement.jsp?id=<%= id %>">Edit</a>

            <form action="manageAds?action=delete&id=<%= id %>" method="post" enctype="multipart/form-data">
                <input type="submit" value="Delete">
            </form>
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
<a href="add_advertisement.jsp">Add New Advertisement</a>
<br>
<a href="adPerformance.jsp">View Ad Performance Visualization</a>
<br>

<a href="logout.jsp">Logout</a>
</body>
</html>

