DROP TABLE IF EXISTS `eligible_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `eligible_courses` (
  `student_id` varchar(9) NOT NULL,
  `subject` varchar(8) NOT NULL,
  `catalog` varchar(8) NOT NULL,
  `priority` INT DEFAULT NULL,
  `num_courses` INT DEFAULT NULL,
  CONSTRAINT PK_eligible PRIMARY KEY(`student_id`,`subject`,`catalog`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;