package com.example.news.mapper;

import com.example.news.entity.News;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
@Mapper
public interface NewsMapper {
    /**
     * 查询所有
     */
    @Select("select id,title,content from news")
    List<News> selectAll();
}
