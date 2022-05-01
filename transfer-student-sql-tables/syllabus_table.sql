
DROP TABLE IF EXISTS `syllabus_for_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `syllabus_for_courses` (
  `student_id` varchar(9) DEFAULT NULL,
  `from_school` varchar(50) DEFAULT NULL,
  `from_title` varchar(50) DEFAULT NULL,
  `from_subject` varchar(8) DEFAULT NULL,
  `from_catalog` varchar(20) DEFAULT NULL,
  `from_semester` varchar(10) DEFAULT NULL,
  `from_year` varchar(4) DEFAULT NULL,
  `syllabus_file_path` varchar(50) DEFAULT NULL,
  `syllabus_url` varchar(50) DEFAULT NULL,
  `course_key` int,
  primary key (`course_key`),
  KEY `syllabus_course_key` (`course_key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;