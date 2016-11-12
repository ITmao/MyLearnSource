package com.hundsun.jresplus.ui.demo.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hundsun.jresplus.common.util.StringUtil;
import com.hundsun.jresplus.ui.components.checkcode.CheckCodeAgent;
import com.hundsun.jresplus.ui.utils.BizSecurity;

@Controller
public class LoginAction {
	@RequestMapping(value="/login.htm")
	public void login(ModelMap model,HttpSession session,HttpServletRequest request){
		model.put("userName", "admin");
		model.put("password", "123456");
		model.put("key1", BizSecurity.key1);
		model.put("key2", BizSecurity.key2);
		model.put("key3", BizSecurity.key3);
		
	}
	@RequestMapping(value="/submitLogin.htm")
	public String submitLogin(String user_name,String password,String checkCode,String theme,ModelMap model,HttpSession session){
		String errorInfo = "";
		boolean flag = true;
		String code = (String) session.getAttribute(CheckCodeAgent.Check_Code_Agent);
		if(StringUtil.isBlank(user_name)){
			errorInfo = "用户名不能为空";
			flag = false;
		}else if(StringUtil.isBlank(password)){
			errorInfo = "登录密码不能为空";
			flag = false;
		}/*else if(!StringUtil.equals(code, checkCode)){
			//errorInfo = "验证码不正确";
			//flag = false;
		}*/else{
			//密码解密
			String desPwd = BizSecurity.desDecrypt(password, BizSecurity.key1, BizSecurity.key2, BizSecurity.key3);
			errorInfo = "";
			flag = true;
			String userId = "admin";
			String userName = "系统管理员";//这个是登录用户昵称，应该从数据库获取，这里是模拟写死
			User userInfo = new User();
			userInfo.setUserId(userId);
			userInfo.setUserName(userName);
			session.setAttribute("nick", userName);//用户昵称,主页上使用
			session.setAttribute("userInfo", userInfo);
			
		}
		
		
		if(!flag){
			model.put("errorInfo", errorInfo);
			return "forward:/login.htm";
		}else{
			return "redirect:/index.htm";
		}
	}
	@RequestMapping(value="/logout.json")
	public @ResponseBody JSONObject logout(HttpSession session,String password,ModelMap model){
		session.removeAttribute("userInfo");
		session.removeAttribute("nick");
		return ResultJson.returnSuccess("退出成功");
		
	}
}
