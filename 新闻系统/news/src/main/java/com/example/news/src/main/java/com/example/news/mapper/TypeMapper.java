package com.example.news.mapper;

import com.example.news.entity.News;
import com.example.news.entity.Type;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
@Mapper
public interface TypeMapper {
    /**
     * 查询所有
     */
    @Select("select id,name from type")
    List<Type> selectAllType();
}
