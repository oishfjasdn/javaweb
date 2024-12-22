<%@ page import="com.example.ads.Advertisement" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.DriverManager" %>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.SQLException" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Edit Advertisement</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #2f2f2f; /* Dark gray background */
            color: #fff; /* White text */
        }
        h2 {
            color: #007bff; /* Blue color for headings */
            margin-bottom: 20px;
        }
        form {
            max-width: 500px;
            margin: auto;
            padding: 20px;
            background-color: #333; /* Dark gray background */
            border: 1px solid #007bff; /* Blue border */
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        input[type="text"], textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #007bff; /* Blue border */
            color: #fff; /* White text */
            background-color: #333; /* Dark gray background */
        }
        input[type="file"] {
            margin-bottom: 20px;
        }
        input[type="submit"] {
            background-color: #007bff; /* Blue color for buttons */
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #0056b3; /* Darker blue on hover */
        }
        a {
            text-decoration: none;
            color: #007bff; /* Blue color for links */
        }
    </style>
</head>
<body>
<h2>Edit Advertisement</h2>
<%
    int adId = Integer.parseInt(request.getParameter("id"));
    Advertisement ad = null;

    try {
        // Register JDBC driver
        Class.forName("com.mysql.cj.jdbc.Driver");

        Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM advertisements WHERE id = ?");
        stmt.setInt(1, adId);
        ResultSet rs = stmt.executeQuery();

        if (rs.next()) {
            ad = new Advertisement(rs.getInt("id"), rs.getString("title"), rs.getString("detail_page"), rs.getString("image_url"), rs.getInt("click_count"));
        }
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    } catch (SQLException e) {
        e.printStackTrace();
    }
%>

<% if (ad != null) { %>
<form action="manageAds" method="post" enctype="multipart/form-data">
    Title: <input type="text" name="title" value="<%= ad.getTitle() %>"><br><br>
    Detail Page: <textarea name="detailPage" rows="4" cols="50"><%= ad.getDetailPage() %></textarea><br><br>
    Image: <input type="file" name="image"><br><br>
    <input type="hidden" name="action" value="update">
    <input type="hidden" name="id" value="<%= ad.getId() %>">
    <input type="submit" value="Update Advertisement">
</form>
<% } else { %>
<p>Advertisement not found.</p>
<% } %>
<br>
<a href="advertisement_list.jsp">Back to Advertisements</a>
</body>
</html>