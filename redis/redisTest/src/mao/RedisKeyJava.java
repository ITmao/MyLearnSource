package mao;

import java.util.List;

import redis.clients.jedis.Jedis;

public class RedisKeyJava {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//连接本地的 Redis 服务
	      Jedis jedis = new Jedis("localhost");
	      System.out.println("Connection to server sucessfully");
	      
	     // 获取数据并输出
	     List<String> list = (List<String>) jedis.keys("*");
	     for(int i=0; i<list.size(); i++) {
	       System.out.println("List of stored keys:: "+list.get(i));
	     }
	}

}
