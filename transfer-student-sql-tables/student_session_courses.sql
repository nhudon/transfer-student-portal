DROP TABLE IF EXISTS `student_session_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `student_session_courses` (
  `course_key` INT AUTO_INCREMENT NOT NULL,
  `student_id` varchar(9) DEFAULT NULL,
  `from_school` varchar(50) DEFAULT NULL,
  `from_title` varchar(50) DEFAULT NULL,
  `from_subject` varchar(8) DEFAULT NULL,
  `from_catalog` varchar(20) DEFAULT NULL,
  `from_semester` varchar(10) DEFAULT NULL,
  `from_year` varchar(4) DEFAULT NULL,
  `ssu_subject` varchar(8) DEFAULT NULL,
  `ssu_catalog` varchar(8) DEFAULT NULL,
  `ssu_title` varchar(50) DEFAULT NULL,
  `ssu_units` float DEFAULT NULL,
  `ssu_ge_designation` varchar(4) DEFAULT NULL,
  `from_grade` varchar(5) DEFAULT NULL,
  `from_units` float DEFAULT NULL,
  `from_group` smallint(5) unsigned DEFAULT NULL,
  `from_sequence_nbr` smallint(5) unsigned DEFAULT NULL,
  `from_current_courses` int DEFAULT 0,
  `from_additional_courses` int DEFAULT 0,
  `student_priority` smallint DEFAULT 0,
  `transfer_term` varchar(4) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `rejected` int DEFAULT 0,
  `student_note` TEXT DEFAULT NULL,
  `advisor_note` TEXT DEFAULT NULL,
  PRIMARY KEY(`course_key`),
  KEY `transfer_courses_student_id` (`student_id`) USING BTREE,
  KEY `transfer_courses_student_id_transfer_term` (`student_id`,`transfer_term`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;