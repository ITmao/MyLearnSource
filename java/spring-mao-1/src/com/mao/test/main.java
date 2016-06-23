package com.mao.test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class main {
	public static void main(String[] args) {
		/*
		//创建一个HelloWorld对象
		HelloWorld helloWorld=new HelloWorld();
		//为对象的name属性赋值
		helloWorld.setName3("mao");
		*/
		
		//创建Spring的IOC容器对象
		ApplicationContext ctx=new ClassPathXmlApplicationContext("spring.xml");
		
		//从IOC容器中获取bean实例
		HelloWorld helloWorld =(HelloWorld)ctx.getBean("helloWorld");
		
		//调用bean的Hello方法
//		helloWorld.Hello();
		
	}
}
