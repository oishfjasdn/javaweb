package com.example.news.controller;


import com.example.news.Result;
import com.example.news.entity.News;
import com.example.news.service.NewsService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class NewsController {
    @Resource
    public NewsService newsService;
    
    /**
     * 查询所有
     */
    @CrossOrigin
    @GetMapping("/selectAll")
    public Result selectAll() {
        List<News> list = newsService.selectAll();
        return Result.success(list);
    }
/**
 * 根据名称查询
 */
@CrossOrigin
@GetMapping("/selectAllByTitle")
public Result selectAllByTitle(@RequestParam String title) {
    List<News> list = newsService.selectAllByTitle(title);
    return Result.success(list);
}
}
