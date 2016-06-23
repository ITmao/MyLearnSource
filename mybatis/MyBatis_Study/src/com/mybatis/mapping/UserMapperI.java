package com.mybatis.mapping;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.mybatis.domain.Users;

public interface UserMapperI {
	//使用@Insert注解指明add方法要执行的SQL
    @Insert("insert into users(name, age) values(#{name}, #{age})")
    public int add(Users user);
    
    //使用@Delete注解指明deleteById方法要执行的SQL
    @Delete("delete from users where id=#{id}")
    public int deleteById(int id);
    
    //使用@Update注解指明update方法要执行的SQL
    @Update("update users set name=#{name},age=#{age} where id=#{id}")
    public int update(Users user);
    
    //使用@Select注解指明getById方法要执行的SQL
    @Select("select * from users where id=#{id}")
    public Users getById(int id);
    
    //使用@Select注解指明getAll方法要执行的SQL
    @Select("select * from users")
    public List<Users> getAll();
}
