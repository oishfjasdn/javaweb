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
    @Select("select news.id,news.title,news.content,news.image,type.id,type.name from news,type where news.type_id=type.id")
    List<News> selectAll();

    /**
     * 根据名字查询
     */
    @Select("select id,title from news")
    List<News> selectAllByTitle(String title);
}
