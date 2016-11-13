package com.mybatis.test;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.Test;

import com.mybatis.domain.Users;
import com.mybatis.util.MyBatisUtil;

public class TestTwoLevelCache {
	/*
     * ���Զ�������
     * ʹ��������ͬ��SqlSession����ȥִ����ͬ��ѯ�����Ĳ�ѯ���ڶ��β�ѯʱ�����ٷ���SQL��䣬����ֱ�Ӵӻ�����ȡ������
     */
    @Test
    public void testCache2() {
        String statement = "com.mybatis.mapping.usersMapper.getUser";
        SqlSessionFactory factory = MyBatisUtil.getSqlSessionFactory();
        //����������ͬ��SqlSession
        SqlSession session1 = factory.openSession();
        SqlSession session2 = factory.openSession();
        //ʹ�ö�������ʱ��User�����ʵ��һ��Serializable�ӿ�===> User implements Serializable
        Users user = session1.selectOne(statement, 1);
        session1.commit();//����Ϊɶ������ط�һ��Ҫ�ύ����֮���������Ż�������
        System.out.println("user="+user);
        
        //����ʹ�õ���������ͬ��SqlSession�������Լ�ʹ��ѯ������ͬ��һ������Ҳ���Ὺ��ʹ��
        user = session2.selectOne(statement, 1);
        //session2.commit();
        System.out.println("user2="+user);
    }
}
