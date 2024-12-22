package com.example.news.controller;


import com.example.news.Result;
import com.example.news.entity.News;
import com.example.news.service.NewsService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class NewsController {
    @Resource
    public NewsService newsService;
    
    /**
     * 查询所有
     */
    @GetMapping("/selectAll")
    public Result selectAll() {
        List<News> list = newsService.selectAll();
        return Result.success(list);
    }
}
