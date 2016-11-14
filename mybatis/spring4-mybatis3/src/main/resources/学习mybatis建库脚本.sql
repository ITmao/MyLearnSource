--新建库
Create DATABASE spring4_mybatis3;
USE spring4_mybatis3;

DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user (
  user_id char(32) NOT NULL,
  user_name varchar(30) DEFAULT NULL,
  user_birthday date DEFAULT NULL,
  user_salary double DEFAULT NULL,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;