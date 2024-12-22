package com.example.news.controller;

import com.example.news.Result;
import com.example.news.entity.News;
import com.example.news.entity.Type;
import com.example.news.service.TypeService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
public class TypeController {
    @Resource
    private TypeService typeService;

    /**
     * 查询所有
     */
    @GetMapping("/selectAllType")
    public Result selectAll() {
        List<Type> list = typeService.selectAllType();
        return Result.success(list);
    }
}
