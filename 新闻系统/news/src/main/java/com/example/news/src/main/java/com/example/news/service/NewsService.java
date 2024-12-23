package com.example.news.service;


import com.example.news.entity.News;
import com.example.news.mapper.NewsMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class NewsService {
    @Resource
    private NewsMapper newsMapper;

    /**
     * 查询所有
     */
    public List<News> selectAll() {

        return newsMapper.selectAll();
    }

    /**
     * 根据名称查询
     */
    public List<News> selectAllByTitle(String title) {

        return newsMapper.selectAllByTitle(title);
    }
}
