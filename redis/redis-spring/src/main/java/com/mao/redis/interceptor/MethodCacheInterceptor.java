package com.mao.redis.interceptor;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.log4j.Logger;

import com.mao.redis.utils.RedisUtil;

public class MethodCacheInterceptor implements MethodInterceptor {
	private Logger logger = Logger.getLogger(MethodCacheInterceptor.class);
	private RedisUtil redisUtil;
	private List<String> targetNamesList; // �����뻺���service����
	private List<String> methodNamesList; // �����뻺��ķ�������
	private Long defaultCacheExpireTime; // ����Ĭ�ϵĹ���ʱ��
	private Long xxxRecordManagerTime; //
	private Long xxxSetRecordManagerTime; //

	/**
	 * ��ʼ����ȡ����Ҫ���뻺��������ͷ�������
	 */
	public MethodCacheInterceptor() {
		try {
			 File f = new File("D:\\lunaJee-workspace\\msm\\msm_core\\src\\main\\java\\com\\mucfc\\msm\\common\\cacheConf.properties"); 
			 //�����ļ�λ��ֱ�ӱ�д��������Ҫ�Լ��޸���
		     InputStream in = new FileInputStream(f); 
//			InputStream in = getClass().getClassLoader().getResourceAsStream(
//					"D:\\lunaJee-workspace\\msm\\msm_core\\src\\main\\java\\com\\mucfc\\msm\\common\\cacheConf.properties");
			Properties p = new Properties();
			p.load(in);
			// �ָ��ַ���
			String[] targetNames = p.getProperty("targetNames").split(",");
			String[] methodNames = p.getProperty("methodNames").split(",");

			// ���ع���ʱ������
			defaultCacheExpireTime = Long.valueOf(p.getProperty("defaultCacheExpireTime"));
			xxxRecordManagerTime = Long.valueOf(p.getProperty("com.service.impl.xxxRecordManager"));
			xxxSetRecordManagerTime = Long.valueOf(p.getProperty("com.service.impl.xxxSetRecordManager"));
			// ����list
			targetNamesList = new ArrayList<String>(targetNames.length);
			methodNamesList = new ArrayList<String>(methodNames.length);
			Integer maxLen = targetNames.length > methodNames.length ? targetNames.length
					: methodNames.length;
			// ������Ҫ����������ͷ�������ӵ�list��
			for (int i = 0; i < maxLen; i++) {
				if (i < targetNames.length) {
					targetNamesList.add(targetNames[i]);
				}
				if (i < methodNames.length) {
					methodNamesList.add(methodNames[i]);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Object invoke(MethodInvocation invocation) throws Throwable {
		Object value = null;

		String targetName = invocation.getThis().getClass().getName();
		String methodName = invocation.getMethod().getName();
		// ����Ҫ���������
		//if (!isAddCache(StringUtil.subStrForLastDot(targetName), methodName)) {
		if (!isAddCache(targetName, methodName)) {
			// ִ�з������ؽ��
			return invocation.proceed();
		}
		Object[] arguments = invocation.getArguments();
		String key = getCacheKey(targetName, methodName, arguments);
		System.out.println(key);

		try {
			// �ж��Ƿ��л���
			if (redisUtil.exists(key)) {
				return redisUtil.get(key);
			}
			// д�뻺��
			value = invocation.proceed();
			if (value != null) {
				final String tkey = key;
				final Object tvalue = value;
				new Thread(new Runnable() {
					public void run() {
						if (tkey.startsWith("com.service.impl.xxxRecordManager")) {
							redisUtil.set(tkey, tvalue, xxxRecordManagerTime);
						} else if (tkey.startsWith("com.service.impl.xxxSetRecordManager")) {
							redisUtil.set(tkey, tvalue, xxxSetRecordManagerTime);
						} else {
							redisUtil.set(tkey, tvalue, defaultCacheExpireTime);
						}
					}
				}).start();
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (value == null) {
				return invocation.proceed();
			}
		}
		return value;
	}

	/**
	 * �Ƿ���뻺��
	 * 
	 * @return
	 */
	private boolean isAddCache(String targetName, String methodName) {
		boolean flag = true;
		if (targetNamesList.contains(targetName)
				|| methodNamesList.contains(methodName)) {
			flag = false;
		}
		return flag;
	}

	/**
	 * ��������key
	 *
	 * @param targetName
	 * @param methodName
	 * @param arguments
	 */
	private String getCacheKey(String targetName, String methodName,
			Object[] arguments) {
		StringBuffer sbu = new StringBuffer();
		sbu.append(targetName).append("_").append(methodName);
		if ((arguments != null) && (arguments.length != 0)) {
			for (int i = 0; i < arguments.length; i++) {
				sbu.append("_").append(arguments[i]);
			}
		}
		return sbu.toString();
	}

	public void setRedisUtil(RedisUtil redisUtil) {
		this.redisUtil = redisUtil;
	}
}