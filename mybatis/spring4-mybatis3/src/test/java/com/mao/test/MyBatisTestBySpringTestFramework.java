package com.mao.test;

import java.util.Date;
import java.util.UUID;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.mao.domain.User;
import com.mao.service.UserServiceI;

@RunWith(SpringJUnit4ClassRunner.class)
//配置了@ContextConfiguration注解并使用该注解的locations属性指明spring和配置文件之后，
@ContextConfiguration(locations = {"classpath:spring.xml", "classpath:spring-mybatis.xml" })
public class MyBatisTestBySpringTestFramework {
	//注入userService
    @Autowired
    private UserServiceI userService;
    
    @Test
    public void testAddUser(){
        User user = new User();
        user.setUserId(UUID.randomUUID().toString().replaceAll("-", ""));
        user.setUserName("xdp_gacl_白虎神皇");
        user.setUserBirthday(new Date());
        user.setUserSalary(10000D);
        userService.addUser(user);
    }
    
    @Test
    public void testGetUserById(){
        String userId = "4306b713d70140cc8458c37884133cca";
        User user = userService.getUserById(userId);
        System.out.println(user.getUserName());
    }
}
