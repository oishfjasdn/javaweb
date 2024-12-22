<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
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
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #007bff; /* Blue border */
            color: #fff; /* White text */
            background-color: #333; /* Dark gray background */
        }
        input[type="submit"] {
            background-color: #007bff; /* Blue color */
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
<h2>Login</h2>
<form action="login" method="post">
    Username: <input type="text" name="username"><br><br>
    Password: <input type="password" name="password"><br><br>
    <input type="submit" value="Login">
</form>
<br>
<a href="register.jsp">Register here</a>
</body>
</html>