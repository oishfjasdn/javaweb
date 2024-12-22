package com.example.ads;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/manageAds")
@MultipartConfig(fileSizeThreshold=1024*1024*2, // 2MB
                 maxFileSize=1024*1024*10,      // 10MB
                 maxRequestSize=1024*1024*50)   // 50MB
public class AdvertisementManagementServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();

        switch (action) {
            case "add":
                addAdvertisement(request, response);
                break;
            case "delete":
                deleteAdvertisement(request, response);
                break;
            case "update":
                updateAdvertisement(request, response);
                break;
            default:
                out.println("Invalid action specified.");
        }
    }

    private void addAdvertisement(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        HttpSession session = request.getSession();
        int userId = (int) session.getAttribute("userId");
        String title = request.getParameter("title");
        String detailPage = request.getParameter("detailPage");
        Part filePart = request.getPart("image");
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
        Path uploadPath = Paths.get(getServletContext().getRealPath("") + File.separator + "pic" + File.separator + fileName);
        System.out.println(uploadPath.toUri());
        Files.copy(filePart.getInputStream(), Paths.get(uploadPath.toUri()));

        String imageUrl = request.getContextPath() + "/pic/" + fileName;
        try {
            // Register JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
            PreparedStatement stmt = conn.prepareStatement("INSERT INTO advertisements (user_id, title, detail_page, image_url) VALUES (?, ?, ?, ?)");
            stmt.setInt(1, userId);
            stmt.setString(2, title);
            stmt.setString(3, detailPage);
            stmt.setString(4, imageUrl);
            int result = stmt.executeUpdate();
            if (result > 0) {
                response.getWriter().println("Ad added successfully!");
                response.sendRedirect("advertisement.jsp");
            } else {
                response.getWriter().println("Failed to add ad.");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.getWriter().println("Driver not found.");
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().println("Database error occurred.");
        }
    }

    private void deleteAdvertisement(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int adId = Integer.parseInt(request.getParameter("id"));

        try {
            // Register JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
            PreparedStatement stmt = conn.prepareStatement("DELETE FROM advertisements WHERE id = ?");
            stmt.setInt(1, adId);
            int result = stmt.executeUpdate();
            if (result > 0) {
                response.getWriter().println("Ad deleted successfully!");
            } else {
                response.getWriter().println("Failed to delete ad.");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.getWriter().println("Driver not found.");
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().println("Database error occurred.");
        }
    }

    private void updateAdvertisement(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        int adId = Integer.parseInt(request.getParameter("id"));
        String title = request.getParameter("title");
        String detailPage = request.getParameter("detailPage");
        Part filePart = request.getPart("image");
        String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
        Path uploadPath = Paths.get(getServletContext().getRealPath("") + File.separator + "pic" + File.separator + fileName);
        Files.copy(filePart.getInputStream(), Paths.get(uploadPath.toUri()));

        String imageUrl = request.getContextPath() + "/pic/" + fileName;

        try {
            // Register JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
            PreparedStatement stmt = conn.prepareStatement("UPDATE advertisements SET title = ?, detail_page = ?, image_url = ? WHERE id = ?");
            stmt.setString(1, title);
            stmt.setString(2, detailPage);
            stmt.setString(3, imageUrl);
            stmt.setInt(4, adId);
            int result = stmt.executeUpdate();
            if (result > 0) {
                response.getWriter().println("Ad updated successfully!");
            } else {
                response.getWriter().println("Failed to update ad.");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            response.getWriter().println("Driver not found.");
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().println("Database error occurred.");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Advertisement> ads = getAdvertisements((Integer) request.getSession().getAttribute("userId"));
        StringBuilder sb = new StringBuilder();
        for (Advertisement ad : ads) {
            sb.append(ad.getId()).append(",")
              .append(ad.getTitle()).append(",")
              .append(ad.getDetailPage()).append(",")
              .append(ad.getImageUrl()).append(",")
              .append(ad.getClickCount()).append("\n");
        }
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(sb.toString());
    }

    private List<Advertisement> getAdvertisements(int userId) {
        List<Advertisement> ads = new ArrayList<>();
        try {
            // Register JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection("jdbc:mysql://j.skpay.com:5306/ads_management", "root", "Db_223312");
            PreparedStatement stmt = conn.prepareStatement("SELECT * FROM advertisements WHERE user_id = ?");
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Advertisement ad = new Advertisement(rs.getInt("id"), rs.getString("title"), rs.getString("detail_page"), rs.getString("image_url"), rs.getInt("click_count"));
                ads.add(ad);
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ads;
    }
}

