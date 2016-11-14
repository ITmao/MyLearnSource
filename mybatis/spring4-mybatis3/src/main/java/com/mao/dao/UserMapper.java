package com.mao.dao;

import java.util.List;

import com.mao.domain.User;

public interface UserMapper {
    int deleteByPrimaryKey(String userId);

    int insert(User record);

    int insertSelective(User record);

    User selectByPrimaryKey(String userId);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
    
    /**��ȡ�����û���Ϣ
     * @return List<User>
     */
    List<User> getAllUser();
}