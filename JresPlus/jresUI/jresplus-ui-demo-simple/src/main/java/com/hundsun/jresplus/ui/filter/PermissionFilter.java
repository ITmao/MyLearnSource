/*
 * 系统名称: ARES 应用快速开发企业套件
 * 模块名称: 基础业务应用
 * 类 名 称   : PermissionFilter.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 相关文档:
 * 修改记录:
 * 修改日期		修改人员		修改说明<BR>
 * ==========================================================
 * 20110908  huhl@hundsun.com  上传文件权限获取交易码
 * 20110920  huhl@hundsun.com  用户登陆检测修改
 * 
 * ==========================================================
 * 评审记录：
 * 
 * 评审人员：
 * 评审日期：
 * 发现问题：
 */
package com.hundsun.jresplus.ui.filter;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hundsun.jresplus.ui.demo.action.User;
import com.hundsun.jresplus.ui.utils.HttpUtil;



/**
 * 功能说明: 权限过滤器<br>
 * 系统版本: v1.0 <br>
 * 开发人员: zhouzx@hudnsun.com <br>
 * 开发时间: 2016-9-9<br>
 * ============================================================
 * <br>
 */
public class PermissionFilter implements Filter {

	/**
	 * 无需登录判断
	 */
	private static final String LOGIN_IS_NOT_NEEDED = "0";// ReadUtil.readFromAresConfigFile("login_is_not_needed");

	private static final String SERVICEALIAS_SEPARAT = "$";

	private String errorUrl="/error.htm";
	/**
	 * 登录页面链接
	 */
	private String loginUrl="/login.htm";
	
	
	/**
	 * 登录服务
	 */
	private String loginSerivce;

	/**
	 * 是否检查权限
	 */
	private boolean isCheck = true;
	
	/**
	 * 是否登陆检测
	 */
	private boolean isLoginCheck = false;
	
	
	private Pattern pattern=null;
	
	private String skipPattern="";
	
	
	/**
	 * 错误信息提示
	 */
	private static String extErrMsg = "{ \"rows\":null,\"total\":-1, \"returnCode\" : -1, \"errorNo\" : 0, \"errorInfo\" : \"对不起,您缺少访问权限\" }";
	
	private static String extErrMsgNotLogin = "{\"rows\":null,\"total\":-1, \"returnCode\" : -1, \"errorNo\" : 0, \"errorInfo\" : \"页面已经失效,请先登录\", \"target\" : \"${target}\", \"redirectUrl\" : \"${redirectUrl}\" }";

	private static String extErrMsgMutipleSession = "{\"rows\":null,\"total\":-1, \"returnCode\" : -1, \"errorNo\" : 1692, \"errorInfo\" : \"${errorInfo}\" }";
	
	public void doFilter(ServletRequest _request, ServletResponse _response,
			FilterChain chain) throws IOException, ServletException {
		
		//--2012.02.14---huhl@hundsun.com---错误页面修改------begin--
		if(errorUrl.trim().length()<1){
			errorUrl = "/error.htm";
		}
		//--2012.02.14---huhl@hundsun.com---错误页面修改------end--
		
		HttpServletRequest request = (HttpServletRequest) _request;
		HttpServletResponse response = (HttpServletResponse) _response;
		String servletPath = request.getServletPath();
		boolean isSkip=this.checkIsSkipUrl(servletPath);
		if(!isSkip){
			
			//fileUploadRequestParam(request,response);
			
	//--------------用户登陆检测修改-----begin-----
			// 获取当前用户
			User userInfo = (User) request.getSession().getAttribute("userInfo");
			// 1： 校验用户是否登录
			if(userInfo==null) {
				sendResponse(request, response,this.loginUrl,extErrMsgNotLogin);
				return;
			}
			if (isLoginCheck && isPathNotNull(servletPath) && !isSkip  && !checkLogin(request, response)) {
				sendResponse(request, response,this.loginUrl,extErrMsgNotLogin);
				return;
			}
	//--------------用户登陆检测修改-----end-------
			
			
			
			// 2： 校验用户是否有权限
	 		/*if (this.isCheck && isPathNotNull(servletPath) && !isSkip ) {
				try {
						if (!checkServicePermission(request, response,servletPath, sysSubTrans)) {
							sendResponse(request, response,this.errorUrl +"?error="+ NO_AUTHORITY,extErrMsg);
							return;
						}
					} catch (Exception e) {
						e.printStackTrace();
							sendResponse(request, response,this.errorUrl + "?error="+NO_AUTHORITY,extErrMsg);
							return;
				}
			}*/
	 		
	 	    //  3： 校验系统的登录登录模式
			/*if(!isSkip && isPathNotNull(servletPath)  && checkMutipleSameUserLogin(request)){
				sendResponse(request, response,this.errorUrl+"?error=1692",extErrMsgMutipleSession,"window.onbeforeunload='';");
				return;
			}*/
		}
		
		chain.doFilter(request, response);
	}

	/**
	 * 验证请求路径是否是过滤器放行路径
	 * @param requestPath:
	 *         待验证的请求路径
	 * @return
	 *       true:  是
	 *       false: 否
	 */
	private boolean checkIsSkipUrl(String requestPath){
		boolean isSkip = false;
		Matcher matcher = pattern.matcher(requestPath);
		// 判断是否是登录页面或错误页面
		// 这个后面需要调整通过.do模式进入
		isSkip=loginUrl.equals(requestPath)
			   ||errorUrl.startsWith(requestPath)
			   ||loginSerivce.equals(requestPath)
			   ||matcher.matches();//放行的路径跳过
		boolean tempflag = false;
		if(requestPath.endsWith("service")){
			tempflag = requestPath.indexOf(".cache.")>0;
		}
		return isSkip || tempflag;
	}
	


	public void init(FilterConfig config) throws ServletException {
		loginUrl = (null==config.getInitParameter("loginUrl"))?"":config.getInitParameter("loginUrl");
		errorUrl = (null==config.getInitParameter("errorUrl"))?"":config.getInitParameter("errorUrl");
		loginSerivce = (null==config.getInitParameter("loginService"))?"":config.getInitParameter("loginService");
		//---------20110920--huhl@hundsun.com-----用户登陆检测修改-----begin-----
		String loginCheck=config.getInitParameter("isLoginCheck");
		if(null == loginCheck|| "".equals(loginCheck.trim())){
			loginCheck="false";
		}
		if(!"true".equalsIgnoreCase(loginCheck) && !"false".equalsIgnoreCase(loginCheck) ){
			loginCheck="false";
		}
		isLoginCheck = Boolean.valueOf(loginCheck).booleanValue();
		//---------20110920--huhl@hundsun.com-----用户登陆检测修改-----end-----
		
		skipPattern=config.getInitParameter("skipPattern");
		pattern=Pattern.compile(".*?("+skipPattern+")+.*");
		
		isCheck = (null != config.getInitParameter("isCheck"))
				&& (config.getInitParameter("isCheck").length() > 0)
				&& (Boolean.valueOf(config.getInitParameter("isCheck"))
						.booleanValue());
	}

	/**
	 * 检测页面是否已经失效
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	private boolean checkLogin(HttpServletRequest request,
			HttpServletResponse response) {
		try {
			User currUser = (User) request.getSession().getAttribute("userInfo");
			return !(null == currUser || null == currUser.getUserId() || "".equals(currUser.getUserId()));
		} catch (Exception e) {
			return false;
		}
	}

	

	
	
	private void sendResponse(HttpServletRequest request,
			HttpServletResponse response,String url,String errorInfo){
		sendResponse(request,response,url,errorInfo,null);
	}
			
	
	private void sendResponse(HttpServletRequest request,
			HttpServletResponse response,String url,String errorInfo,String js){
		try {
			// 判断一个请求是否为同步请求
			String X_Requested_With = request.getHeader("X-Requested-With");
			if (X_Requested_With != null
					&& X_Requested_With.equals("XMLHttpRequest")) {
				url = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+loginUrl;
				errorInfo = errorInfo.replace("${target}", "parent");
				errorInfo = errorInfo.replace("${redirectUrl}", url);
				response.getOutputStream().write(errorInfo.getBytes("UTF-8"));
			}else{
				if(js==null)
					HttpUtil.sendRedirectInFrame(request, response,url);
				else
					HttpUtil.sendRedirectInFrame(request, response,url,js);
				
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	
	
	public void destroy() {

	}
	
	private boolean isPathNotNull(String servletPath){
		return !"".equals(servletPath) && !"/".equals(servletPath);
	}
}