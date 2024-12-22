package com.example.news.service;

import com.example.news.entity.News;
import com.example.news.entity.Type;
import com.example.news.mapper.TypeMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TypeService {
    @Resource
    private TypeMapper typeMapper;

    /**
     * 查询所有
     */
    public List<Type> selectAllType() {

        return typeMapper.selectAllType();
    }
}
