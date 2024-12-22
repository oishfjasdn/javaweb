<!DOCTYPE html>
<html>
<head>
    <title>Add Advertisement</title>
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
        input[type="text"], textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #007bff;
            color: #fff;
            background-color: #333;
        }
        input[type="file"] {
            margin-bottom: 20px;
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
<h2>Add New Advertisement</h2>
<form action="manageAds" method="post" enctype="multipart/form-data">
    Title: <input type="text" name="title"><br><br>
    Detail Page: <textarea name="detailPage" rows="4" cols="50"></textarea><br><br>
    Image: <input type="file" name="image"><br><br>
    <input type="hidden" name="action" value="add">
    <input type="submit" value="Add Advertisement">
</form>
<br>
<a href="advertisement_list.jsp">Back to Advertisements</a>
</body>
</html>