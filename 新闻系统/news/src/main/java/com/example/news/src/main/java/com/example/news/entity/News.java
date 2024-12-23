package com.example.news.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


public class News implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;
    private String title;
    private String content;
    private String image;
    private Integer typeId;


    public News(Integer id, String title, String content, String image, Integer typeId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.image = image;
        this.typeId = typeId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
