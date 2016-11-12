/**
 * Project: syapi
 * 
 * File Created at 2011-7-26
 * $Id$
 * 
 * Copyright 2008 6677bank.com Croporation Limited.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * 6677bank Company. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with 6677bank.com.
 */
package com.hundsun.jresplus.ui.demo.action;

import net.sf.json.JSONObject;



/**
 * 返回代码-JSON
 * 
 * @author leixl
 * @version ResultJson.java	2011-8-29 上午10:06:53
 */
public class ResultJson {
	
	/** 是否DEBUG模式 */
	public static final boolean MODE_DEBUG = true;
	
	
	/** 返回关键字-代码 */
	private static final String RETURN_CODE 					= 	"return_code";
	
	/** 返回关键字-消息 */
	private static final String RETURN_MSG 						= 	"return_msg";
	
	/** 返回关键字-参数 */
	private static final String RETURN_PARS 					= 	"return_pars";
	
	/** 返回代码-成功 */
	private static final String RETURN_CODE_SUCCESS 			= 	"0";
	
	/** 返回消息-成功 */
	public static final String RETURN_CODE_SUCCESS_MSG 		= 	"成功";
	/** 返回代码-警告-业务信息提示  */
	private static final String RETURN_CODE_WORN_BIZ 			= 	"1000";
	/** 返回代码-警告-系统错误 */
	private static final String RETURN_CODE_WORN_SYSM 			= 	"1001";
	
	/** 返回消息-警告-系统错误 */
	private static final String RETURN_CODE_WORN_SYSM_MSG 		= 	"请稍后重试";
	
	/** 返回代码-警告-参数缺少 */
	private static final String RETURN_CODE_WORN_PARAMISS 		= 	"1011";
	
	/** 返回消息-警告-参数缺少 */
	private static final String RETURN_CODE_WORN_PARAMISS_MSG 	= 	"参数缺少";
	
	/** 返回代码-警告-参数类型错误 */
	private static final String RETURN_CODE_WORN_PARATYPE 		= 	"1012";
	
	/** 返回消息-警告-参数类型错误 */
	private static final String RETURN_CODE_WORN_PARATYPE_MSG 	= 	"参数类型错误";
	
	/** 返回代码-警告-参数值错误 */
	private static final String RETURN_CODE_WORN_PARAVALUE 		= 	"1013";
	
	/** 返回消息-警告-参数值错误 */
	private static final String RETURN_CODE_WORN_PARAVALUE_MSG 	= 	"参数值错误";
	
	/** 返回代码-警告-参数登录错误 */
	private static final String RETURN_CODE_WORN_PARALOGIN 		= 	"1021";
	
	/** 返回消息-警告-参数登录错误 */
	public static final String RETURN_CODE_WORN_PARALOGIN_MSG 	= 	"请先登录";
	
	/** 返回代码-警告-参数值错误 */
	public static final String RETURN_CODE_WORN_FUNC           =   "1014";
    
	/** 返回消息-警告-参数登录错误 */
    public static final String RETURN_CODE_WORN_PARAFUNC_MSG    =   "没有权限";
	
	/**
	 * 添加返回代码-成功
	 * @param result
	 */
	public static JSONObject returnSuccess(){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_SUCCESS);
		resultJson.put(RETURN_MSG, RETURN_CODE_SUCCESS_MSG);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-成功
	 * @param result
	 */
	public static JSONObject returnSuccess(String msg){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_SUCCESS);
		resultJson.put(RETURN_MSG, msg);
		return resultJson;
	}
	/**
	 * 添加返回代码-业务信息提示
	 * @param result
	 */
	public static JSONObject returnBizError(String msg){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_BIZ);
		resultJson.put(RETURN_MSG, msg);
		return resultJson;
	}
	/**
	 * 添加返回代码-系统错误
	 * @param result
	 */
	public static JSONObject returnWronSystem(){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_SYSM);
		resultJson.put(RETURN_MSG, RETURN_CODE_WORN_SYSM_MSG);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-系统错误
	 * @param result
	 */
	public static JSONObject returnWronSystem(String msg){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_SYSM);
		resultJson.put(RETURN_MSG, msg);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数缺失
	 * @param result
	 */
	public static JSONObject returnWronParamiss(){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARAMISS);
		resultJson.put(RETURN_MSG, RETURN_CODE_WORN_PARAMISS_MSG);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数缺失
	 * @param result
	 */
	public static JSONObject returnWronParamiss(String msg){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARAMISS);
		resultJson.put(RETURN_MSG, msg);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数类型错误
	 * @param result
	 */
	public static JSONObject returnWronParatype(){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARATYPE);
		resultJson.put(RETURN_MSG, RETURN_CODE_WORN_PARATYPE_MSG);
		return resultJson;
	}

	/**
	 * 添加返回代码-参数类型错误
	 * @param result
	 */
	public static JSONObject returnWronParatype(String msg){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARATYPE);
		resultJson.put(RETURN_MSG, msg);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数值错误
	 * @param result
	 */
	public static JSONObject returnWronParavalue(){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARAVALUE);
		resultJson.put(RETURN_MSG, RETURN_CODE_WORN_PARAVALUE_MSG);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数值错误
	 * @param msg
	 * @param paras
	 * @return
	 */
	public static JSONObject returnWronParavalue(String msg, String ... paras){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARAVALUE);
		resultJson.put(RETURN_MSG, msg!=null?msg:RETURN_CODE_WORN_PARAVALUE_MSG);
		if(paras!=null && paras.length>0){
			resultJson.put(RETURN_PARS, paras);
		}
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数登录信息错误
	 * @param result
	 */
	public static JSONObject returnWronParalogin(){
		JSONObject resultJson = new JSONObject();
		resultJson.put(RETURN_CODE, RETURN_CODE_WORN_PARALOGIN);
		resultJson.put(RETURN_MSG, RETURN_CODE_WORN_PARALOGIN_MSG);
		return resultJson;
	}
	
	/**
	 * 添加返回代码-参数登录信息错误
	 * @param msg
	 * @param paras
	 * @return
	 */
	public static JSONObject returnWronParalogin(String msg){
		JSONObject resultJson = returnWronParalogin();
		resultJson.put(RETURN_MSG, msg!=null?msg:RETURN_CODE_WORN_PARALOGIN_MSG);
		return resultJson;
	}
	
	/**
	 * 是否结果为成功
	 * @param resultJson
	 * @return
	 */
	public static boolean isResultSuccess(JSONObject resultJson){
		if(resultJson==null){
			return false;
		}
		return RETURN_CODE_SUCCESS.equals(resultJson.getString(RETURN_CODE));
	}
}
