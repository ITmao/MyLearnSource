package com.mybatis.test;

import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import com.mybatis.util.MyBatisUtil;

public class Test6 {
	
	@Test
    public void testGetUserCount(){
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        /**
         * ӳ��sql�ı�ʶ�ַ�����
         * me.gacl.mapping.userMapper��userMapper.xml�ļ���mapper��ǩ��namespace���Ե�ֵ��
         * getUserCount��select��ǩ��id����ֵ��ͨ��select��ǩ��id����ֵ�Ϳ����ҵ�Ҫִ�е�SQL
         */
        String statement = "com.mybatis.mapping.usersMapper.getUserCount";//ӳ��sql�ı�ʶ�ַ���
        Map<String, Integer> parameterMap = new HashMap<String, Integer>();
        parameterMap.put("sexid", 1);
        parameterMap.put("usercount", -1);
        sqlSession.selectOne(statement, parameterMap);
        Integer result = parameterMap.get("usercount");
        System.out.println(result);
        sqlSession.close();
	}
}
