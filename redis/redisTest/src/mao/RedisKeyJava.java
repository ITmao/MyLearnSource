package mao;

import java.util.List;

import redis.clients.jedis.Jedis;

public class RedisKeyJava {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//���ӱ��ص� Redis ����
	      Jedis jedis = new Jedis("localhost");
	      System.out.println("Connection to server sucessfully");
	      
	     // ��ȡ���ݲ����
	     List<String> list = (List<String>) jedis.keys("*");
	     for(int i=0; i<list.size(); i++) {
	       System.out.println("List of stored keys:: "+list.get(i));
	     }
	}

}
