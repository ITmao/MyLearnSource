package com.mybatis.test;

import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import com.mybatis.domain.Users;
import com.mybatis.util.MyBatisUtil;

public class TestOneLevelCache {
	/*
     * һ������: Ҳ��Session���Ļ���(Ĭ�Ͽ���)
     */
    @Test
    public void testCache1() {
        SqlSession session = MyBatisUtil.getSqlSession();
        String statement = "com.mybatis.mapping.usersMapper.getUser";
        Users users = session.selectOne(statement, 1);
        System.out.println(users);
        
        /*
         * һ������Ĭ�Ͼͻᱻʹ��
         */
        users = session.selectOne(statement, 1);
        System.out.println(users);
        session.close();
        /*
         1. ������ͬһ��Session,���session�����Ѿ�close()���˾Ͳ��������� 
         */
        session = MyBatisUtil.getSqlSession();
        users = session.selectOne(statement, 1);
        System.out.println(users);
        
        /*
         2. ��ѯ������һ����
         */
        users = session.selectOne(statement, 2);
        System.out.println(users);
        
        /*
         3. û��ִ�й�session.clearCache()������
         */
        //session.clearCache(); 
        users = session.selectOne(statement, 2);
        System.out.println(users);
        
        /*
         4. û��ִ�й���ɾ�ĵĲ���(��Щ��������������)
         */
        session.update("com.mybatis.mapping.usersMapper.updateUser",
                new Users(2, "user", 23));
        users = session.selectOne(statement, 2);
        System.out.println(users);
        
    }
}
