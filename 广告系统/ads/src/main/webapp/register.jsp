<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #1f1f1f;
            color: #fff;
        }
        h2 {
            color: #007bff;
            margin-bottom: 20px;
        }
        form {
            max-width: 500px;
            margin: auto;
            padding: 20px;
            background-color: #333;
            border: 1px solid #007bff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #007bff;
            color: #fff;
            background-color: #333;
        }
        input[type="submit"] {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #0056b3;
        }
        a {
            text-decoration: none;
            color: #007bff;
        }
    </style>
</head>
<body>
<h2>Register</h2>
<form action="register" method="post">
    Username: <input type="text" name="username"><br><br>
    Password: <input type="password" name="password"><br><br>
    <input type="submit" value="Register">
</form>
<a href="login.jsp">Already have an account? Login here</a>
</body>
</html>