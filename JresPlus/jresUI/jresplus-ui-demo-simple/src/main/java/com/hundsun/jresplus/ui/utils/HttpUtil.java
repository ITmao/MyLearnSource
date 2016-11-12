/*
 * 系统名称: ARES 应用快速开发企业套件
 * 模块名称: 
 * 类 名 称   : RedirectUtil.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 相关文档:
 * 修改记录:
 * 修改日期		修改人员		修改说明<BR>
 * ==========================================================
 * 
 * ==========================================================
 * 评审记录：
 * 
 * 评审人员：
 * 评审日期：
 * 发现问题：
 */
package com.hundsun.jresplus.ui.utils;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



/**
 * 功能说明: 提供与HTTP相关的常用方法<br>
 * 系统版本: v1.0 <br>
 * 开发人员: zhengbin@hundsun.com <br>
 * 开发时间: 2010-7-20<br>
 * <br>
 */
public class HttpUtil {

	
	/**
	 * 判断一个请求是否为同步请求
	 * @param request
	 * 			http请求
	 * @return  
	 *          异步请求：false
	 *          同步请求：true
	 */
	public static boolean checkRequestIsSync(HttpServletRequest request){
		String X_Requested_With = request.getHeader("X-Requested-With");
        if (X_Requested_With != null&& X_Requested_With.equals("XMLHttpRequest")) {
        	return false;
        }
		return true;
	}
	
	/**
	 * 重定向
	 * 
	 * @param request
	 * @param response
	 * @param url
	 * @throws IOException
	 */
	public static void sendRedirect(HttpServletRequest request,
			HttpServletResponse response, String url) throws IOException {
		if (!url.startsWith("http")) {
			response.sendRedirect(request.getContextPath() + url);
		} else {
			response.sendRedirect(url);
		}
	}

	/**
	 * 预先执行一段js后在执行重定向
	 * @param request
	 * @param response
	 * @param url
	 * @param js
	 * @throws IOException
	 */
	public static void sendRedirectInFrame(HttpServletRequest request,
			HttpServletResponse response, String url,String js) throws IOException {
		StringBuffer basePath = new StringBuffer(200);
		basePath.append("<script>");
		if(js!=null)
			basePath.append(js);
		basePath.append("top.location = \"").append(
				request.getScheme()).append("://").append(
				request.getServerName()).append(":").append(
				request.getServerPort()).append(request.getContextPath())
				.append(url).append("\"</script>");
		InputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			bis = new ByteArrayInputStream(basePath.toString().getBytes());
			bos = new BufferedOutputStream(response.getOutputStream());
			byte[] buff = new byte[1024 * 1024 * 5];
			int bytesRead;
			while (-1 != (bytesRead = (bis.read(buff)))) {
				bos.write(buff, 0, bytesRead);
			}
			if (bis != null) {
				bis.close();
			}
			if (bos != null) {
				bos.close();
			}
			response.getOutputStream();
		} finally {
			if (bis != null)
				bis.close();
			if (bos != null)
				bos.close();
		}
	}
	
	/**
	 * 重定向[iframe]
	 * 
	 * @param request
	 * @param response
	 * @param url
	 * @throws IOException
	 */
	public static void sendRedirectInFrame(HttpServletRequest request,
			HttpServletResponse response, String url) throws IOException {
		sendRedirectInFrame(request,response,url,null);
	}


	/**
	 * 
	 * @param context
	 * @param url
	 */
	public static void actionRedirect(HttpServletRequest request,HttpServletResponse response, String url) {
		try {
			StringBuffer prefix = new StringBuffer(75);
			prefix.append(request.getScheme()).append("://")
			.append(request.getServerName()).append(":")
			.append(request.getServerPort()).append(request.getContextPath());
			if(!request.getContextPath().endsWith("/"))
				prefix.append("/");
			response.sendRedirect(prefix+url);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	
	//--20101010----------wangnan06675@hundsun-------begin---------
    //获得真实的IP地址
	public static String getIpAdd(HttpServletRequest request){
		String ip = request.getHeader("x-forwarded-for");
		if(ip==null||ip.length()==0||"unknown".equalsIgnoreCase(ip)){
			ip = request.getHeader("Proxy-Client-IP");
		}
		if(ip==null||ip.length()==0||"unknown".equalsIgnoreCase(ip)){
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if(ip==null||ip.length()==0||"unknown".equalsIgnoreCase(ip)){
			ip = request.getRemoteAddr();
		}
		return ip;
	}
	
}
