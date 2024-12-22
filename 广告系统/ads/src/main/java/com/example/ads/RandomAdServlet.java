package com.example.ads;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Random;

@WebServlet("/randomAd")
public class RandomAdServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Register JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
            PreparedStatement stmt = conn.prepareStatement("SELECT COUNT(*) FROM advertisements");
            ResultSet rs = stmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);

            if (count == 0) {
                out.print("{\"error\": \"No ads available.\"}");
                return;
            }

            Random random = new Random();
            int randomIndex = random.nextInt(count) + 1;

            stmt = conn.prepareStatement("SELECT title, detail_page, image_url FROM advertisements LIMIT ?, 1");
            stmt.setInt(1, randomIndex - 1);
            rs = stmt.executeQuery();

            if (rs.next()) {
                String title = rs.getString("title");
                String detailPage = rs.getString("detail_page");
                String imageUrl = rs.getString("image_url");

                out.print("{");
                out.print("\"title\": \"" + title + "\", ");
                out.print("\"detailPage\": \"" + detailPage + "\", ");
                out.print("\"imageUrl\": \"" + "http://ads.wztj.net:8000/"+imageUrl + "\"");
                out.print("}");

                // Increment click count
                PreparedStatement updateStmt = conn.prepareStatement("UPDATE advertisements SET click_count = click_count + 1 WHERE id = ?");
                updateStmt.setInt(1, randomIndex);
                updateStmt.executeUpdate();
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            out.print("{\"error\": \"Driver not found.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            out.print("{\"error\": \"An error occurred.\"}");
        }
    }
}