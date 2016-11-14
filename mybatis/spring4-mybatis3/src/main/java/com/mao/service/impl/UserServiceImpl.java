package com.mao.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mao.dao.UserMapper;
import com.mao.domain.User;
import com.mao.service.UserServiceI;

@Service("userService")
public class UserServiceImpl implements UserServiceI {
	
	/**
     * ʹ��@Autowiredע���עuserMapper������
     * ����Ҫʹ��UserMapperʱ��Spring�ͻ��Զ�ע��UserMapper
     */
    @Autowired
    private UserMapper userMapper;//ע��dao

	public void addUser(User user) {
		// TODO Auto-generated method stub
		userMapper.insert(user);
	}

	public User getUserById(String userId) {
		// TODO Auto-generated method stub
		return userMapper.selectByPrimaryKey(userId);
	}

	public List<User> getAllUser() {
		// TODO Auto-generated method stub
		return userMapper.getAllUser();
	}
}
