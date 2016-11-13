--建database：mybatis
create database mybatis;
--建users库
show databases;
use mybatis;
CREATE TABLE users(id INT PRIMARY KEY AUTO_INCREMENT, NAME VARCHAR(20), age INT);
INSERT INTO users(NAME, age) VALUES('孤傲苍狼', 27);
INSERT INTO users(NAME, age) VALUES('白虎神皇', 27);
--建orders库
show databases;
use mybatis;
CREATE TABLE orders(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(20), 
    order_price FLOAT
);
INSERT INTO orders(order_no, order_price) VALUES('aaaa', 23);
INSERT INTO orders(order_no, order_price) VALUES('bbbb', 33);
INSERT INTO orders(order_no, order_price) VALUES('cccc', 22);
--建teacher库和class库
show databases;
use mybatis;
CREATE TABLE teacher(
    t_id INT PRIMARY KEY AUTO_INCREMENT, 
    t_name VARCHAR(20)
);
CREATE TABLE class(
    c_id INT PRIMARY KEY AUTO_INCREMENT, 
    c_name VARCHAR(20), 
    teacher_id INT
);
ALTER TABLE class ADD CONSTRAINT fk_teacher_id FOREIGN KEY (teacher_id) REFERENCES teacher(t_id);    

INSERT INTO teacher(t_name) VALUES('teacher1');
INSERT INTO teacher(t_name) VALUES('teacher2');

INSERT INTO class(c_name, teacher_id) VALUES('class_a', 1);
INSERT INTO class(c_name, teacher_id) VALUES('class_b', 2);
--建student库
CREATE TABLE student(
    s_id INT PRIMARY KEY AUTO_INCREMENT, 
    s_name VARCHAR(20), 
    class_id INT
);
INSERT INTO student(s_name, class_id) VALUES('student_A', 1);
INSERT INTO student(s_name, class_id) VALUES('student_B', 1);
INSERT INTO student(s_name, class_id) VALUES('student_C', 1);
INSERT INTO student(s_name, class_id) VALUES('student_D', 2);
INSERT INTO student(s_name, class_id) VALUES('student_E', 2);
INSERT INTO student(s_name, class_id) VALUES('student_F', 2);
--为users表增加字段性别sex
ALTER TABLE users ADD (sex	char(2)  DEFAULT '' '' NOT NULL);
update users set sex = '男' where name='毛峰峰';
update users set sex = '女' where name='吴亭亭';
update users set sex='男' where name not in ('毛峰峰','吴亭亭');
-- 创建存储过程(查询得到男性或女性的数量, 如果传入的是0就女性否则是男性)
DELIMITER $
CREATE PROCEDURE mybatis.ges_user_count(IN sex_id INT, OUT user_count INT)
BEGIN  
IF sex_id=0 THEN
SELECT COUNT(*) FROM mybatis.users WHERE users.sex='女' INTO user_count;
ELSE
SELECT COUNT(*) FROM mybatis.users WHERE users.sex='男' INTO user_count;
END IF;
END 
$
-- 调用存储过程
DELIMITER ;
SET @user_count = 0;
CALL mybatis.ges_user_count(1, @user_count);
SELECT @user_count;