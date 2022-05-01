
DROP TABLE IF EXISTS `eligible_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `eligible_courses` (
  `course_key` INT AUTO_INCREMENT NOT NULL,
  `student_id` varchar(9) DEFAULT NULL,
  `subject` varchar(8) DEFAULT NULL,
  `catalog` varchar(8) DEFAULT NULL,
  `priority` INT DEFAULT NULL,
  PRIMARY KEY(`course_key`),
  KEY `eligible_course_student_id` (`student_id`) USING BTREE,
  KEY `eligible_course_course_key` (`course_key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;