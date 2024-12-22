package com.example.ads;

public class Advertisement {
    private int id;
    private String title;
    private String detailPage;
    private String imageUrl;
    private int clickCount;

    public Advertisement(int id, String title, String detailPage, String imageUrl, int clickCount) {
        this.id = id;
        this.title = title;
        this.detailPage = detailPage;
        this.imageUrl = imageUrl;
        this.clickCount = clickCount;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDetailPage() {
        return detailPage;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getClickCount() {
        return clickCount;
    }
}
