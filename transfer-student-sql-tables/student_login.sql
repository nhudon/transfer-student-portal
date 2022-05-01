SET NAMES utf8mb4 ;

DROP TABLE IF EXISTS `student_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
SET character_set_client = utf8mb4 ;
CREATE TABLE `student_login` (
  `student_id` varchar(9) NOT NULL,
  `student_fName` varchar(50) DEFAULT NULL,
  `student_mName` varchar(50) DEFAULT NULL,
  `student_lName` varchar(50) DEFAULT NULL,
  `student_access_token` varchar(128) DEFAULT NULL,
  `expiration_date` DATETIME DEFAULT NULL,
  PRIMARY KEY(student_id),
  KEY `student_login_id` (`student_id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `student_login` WRITE;
/*!40000 ALTER TABLE `student_login` DISABLE KEYS */;
INSERT INTO student_login VALUES('003538959', 'Teresa', 'S', 'Wallace', 'zu2zkhjym2fb83hoosfi4xsyhhxbw8fnl7dxqj82b2bkxpeq3vk1907jhgkz244abh0xk4uo9002lncs27osff7lxr5jv5ad1zmu3lgsag6lffs7anjj91srqq8vav3', '2121-12-05 23:29:32');
/*!40000 ALTER TABLE `student_login` ENABLE KEYS */;
UNLOCK TABLES;