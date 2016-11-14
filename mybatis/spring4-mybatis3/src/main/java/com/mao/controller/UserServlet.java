package com.mao.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.mao.domain.User;
import com.mao.service.UserServiceI;

@WebServlet("/UserServlet")
public class UserServlet extends HttpServlet {
	//����ҵ���߼���userService
    private UserServiceI userService;
    
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //��ȡ���е��û���Ϣ
        List<User> lstUsers = userService.getAllUser();
        request.setAttribute("lstUsers", lstUsers);
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.doGet(request, response);
    }

    public void init() throws ServletException {
        //��Servlet��ʼ��ʱ��ȡSpring�����Ķ���(ApplicationContext)
        ApplicationContext ac = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
        //��ApplicationContext�л�ȡuserService
        userService = (UserServiceI) ac.getBean("userService");
    }
}