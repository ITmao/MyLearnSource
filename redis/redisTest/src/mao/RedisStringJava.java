package mao;

import redis.clients.jedis.Jedis;

public class RedisStringJava {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//连接本地的 Redis 服务
	      Jedis jedis = new Jedis("localhost");
	      System.out.println("Connection to server sucessfully");
	      //设置 redis 字符串数据
	      jedis.set("runoobkey", "Redis tutorial");
	     // 获取存储的数据并输出
	     System.out.println("Stored string in redis:: "+ jedis.get("runoobkey"));
	}

}
