SET NAMES utf8mb4 ;

DROP TABLE IF EXISTS `advisor_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
SET character_set_client = utf8mb4 ;
CREATE TABLE `advisor_students` (
  `advisor_id` varchar(9) DEFAULT NULL,
  `advisor_email` varchar(50) DEFAULT NULL,
  `student_id` varchar(9) NOT NULL,
  `student_fName` varchar(50) DEFAULT NULL,
  `student_mName` varchar(50) DEFAULT NULL,
  `student_lName` varchar(50) DEFAULT NULL,
  `student_status` varchar(9) DEFAULT NULL,
  `student_email` varchar(50) DEFAULT NULL,
  `student_access_token` varchar(50) DEFAULT NULL,
  KEY `advisors_advisor_id` (`advisor_id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `advisor_students` WRITE;
/*!40000 ALTER TABLE `advisor_students` DISABLE KEYS */;
INSERT INTO `advisor_students` VALUES ('111111111', 'ssuadvisor4@gmail.com', '222222222', 'John', NULL, 'Smith', 'new', 'ssustudent4@gmail.com', 'test student access token');
/*!40000 ALTER TABLE `advisor_students` ENABLE KEYS */;
UNLOCK TABLES;
