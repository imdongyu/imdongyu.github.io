---
layout: post
title: Mysql 简单优化
---

看视频教程做的一些笔记，视频地址：[网站性能优化](http://study.163.com/course/courseMain.htm?courseId=266031#/courseMain)


### 慢查询日志
通过查看慢查询日志可以定位到 sql 的问题所在。慢查询日志默认为关闭状态，所以要先开启。

	mysql> set @@global.slow_query_log=ON;

查看修改后的参数

	mysql> 	show variables like '%slow%';

	| log_slow_queries    | ON
                                                     |
	| log_slow_rate_limit | 1
														 |
	| log_slow_verbosity  |
														 |
	| slow_launch_time    | 2
														 |
	| slow_query_log      | ON
														 |
	| slow_query_log_file | Dongyu-slow.log
                                                     |

慢查询时间, 默认为10秒, 也就是超过10秒的 sql 语句会被记录。同样可以使用 set @@global.long_query_time=2 语句来更改, 更改完成后重新登陆后生效。

	show variables like 'long_query_time'

	+-----------------+----------+
	| Variable_name   | Value    |
	+-----------------+----------+
	| long_query_time | 2.000000 |
	+-----------------+----------+


### desc 检查 sql 语句问题

在日志中找到一条超时的 sql

	# Time: 140505 14:50:26
	# User@Host: root[root] @ localhost [::1]
	# Thread_id: 194  Schema: test  QC_hit: No
	# Query_time: 14.430310  Lock_time: 0.000129  Rows_sent: 50  Rows_examined: 6702961
	use test;
	SET timestamp=1399272626;
	select * from follow where user_id = 100;

这条简单的 sql 执行了14秒，用 desc 语句瞧瞧什么问题。
	
	MariaDB [test]> desc select * from follow where user_id = 100 \G;
	*************************** 1. row ***************************
			   id: 1
	  select_type: SIMPLE
			table: follow
			 type: ALL
	possible_keys: NULL
			  key: NULL
		  key_len: NULL
			  ref: NULL
			 rows: 6703560
			Extra: Using where
	1 row in set (0.00 sec)

重点看索引 key 和 影响行数 rows, 可以看到索引为空，行数有600多万。那加个索引会如何呢？

	alter table follow add index in_user_id(user_id);

再用 desc 查看

	MariaDB [test]> desc select * from follow where user_id = 100 \G;
	*************************** 1. row ***************************
			   id: 1
	  select_type: SIMPLE
			table: follow
			 type: ref
	possible_keys: in_user_id
			  key: in_user_id
		  key_len: 4
			  ref: const
			 rows: 50
			Extra:
	1 row in set (0.00 sec)

加上索引后影响行数变成了 50, 不在有速度问题。









