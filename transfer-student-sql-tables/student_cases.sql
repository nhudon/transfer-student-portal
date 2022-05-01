DROP TABLE IF EXISTS `student_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_cases` (
  `advisor_id` varchar(9) DEFAULT NULL,
  `student_id` varchar(9) NOT NULL,
  `student_fName` varchar(50) DEFAULT NULL,
  `student_mName` varchar(50) DEFAULT NULL,
  `student_lName` varchar(50) DEFAULT NULL,
  `student_submission` int DEFAULT 0,
  `case_approved` int DEFAULT 0,
  `case_locked` int DEFAULT 0,
  PRIMARY KEY(student_id),
  KEY `transfer_courses_student_id` (`student_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `student_cases` WRITE;
/*!40000 ALTER TABLE `student_cases` DISABLE KEYS */;
INSERT INTO student_cases VALUES('001299888', '003538959', 'Teresa', 'S', 'Wallace', 1, 0, 0);
/*!40000 ALTER TABLE `student_cases` ENABLE KEYS */;
UNLOCK TABLES;