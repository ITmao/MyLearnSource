package com.mao.test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class main {
	public static void main(String[] args) {
		/*
		//����һ��HelloWorld����
		HelloWorld helloWorld=new HelloWorld();
		//Ϊ�����name���Ը�ֵ
		helloWorld.setName3("mao");
		*/
		
		//����Spring��IOC��������
		ApplicationContext ctx=new ClassPathXmlApplicationContext("spring.xml");
		
		//��IOC�����л�ȡbeanʵ��
		HelloWorld helloWorld =(HelloWorld)ctx.getBean("helloWorld");
		
		//����bean��Hello����
//		helloWorld.Hello();
		
	}
}
