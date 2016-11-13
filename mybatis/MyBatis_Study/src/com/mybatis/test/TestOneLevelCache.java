package com.mybatis.test;

import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import com.mybatis.domain.Users;
import com.mybatis.util.MyBatisUtil;

public class TestOneLevelCache {
	/*
     * 一级缓存: 也就Session级的缓存(默认开启)
     */
    @Test
    public void testCache1() {
        SqlSession session = MyBatisUtil.getSqlSession();
        String statement = "com.mybatis.mapping.usersMapper.getUser";
        Users users = session.selectOne(statement, 1);
        System.out.println(users);
        
        /*
         * 一级缓存默认就会被使用
         */
        users = session.selectOne(statement, 1);
        System.out.println(users);
        session.close();
        /*
         1. 必须是同一个Session,如果session对象已经close()过了就不可能用了 
         */
        session = MyBatisUtil.getSqlSession();
        users = session.selectOne(statement, 1);
        System.out.println(users);
        
        /*
         2. 查询条件是一样的
         */
        users = session.selectOne(statement, 2);
        System.out.println(users);
        
        /*
         3. 没有执行过session.clearCache()清理缓存
         */
        //session.clearCache(); 
        users = session.selectOne(statement, 2);
        System.out.println(users);
        
        /*
         4. 没有执行过增删改的操作(这些操作都会清理缓存)
         */
        session.update("com.mybatis.mapping.usersMapper.updateUser",
                new Users(2, "user", 23));
        users = session.selectOne(statement, 2);
        System.out.println(users);
        
    }
}
