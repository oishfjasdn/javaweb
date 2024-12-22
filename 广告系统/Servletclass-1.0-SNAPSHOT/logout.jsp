<%
    session.invalidate();
%>
<!DOCTYPE html>
<html>
<head>
    <title>Logout</title>
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
    </style>
</head>
<body>
<h2>Logout</h2>
<script>
    window.location.href = "login.jsp";
</script>
</body>
</html>