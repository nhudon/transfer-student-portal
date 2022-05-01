-- MySQL dump 10.13  Distrib 8.0.11, for macos10.13 (x86_64)
--
-- Host: localhost    Database: normalized_fake
-- ------------------------------------------------------
-- Server version	8.0.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `grades` (
  `grade` varchar(5) NOT NULL,
  `gpa_value` varchar(5) NOT NULL,
  `include_in_gpa` varchar(1) NOT NULL,
  `include_in_passed_units` varchar(1) NOT NULL,
  `include_in_failed_units` varchar(1) NOT NULL,
  PRIMARY KEY (`grade`),
  KEY `grades_grade` (`grade`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES ('*A','4.0','Y','Y','N'),('*A-','3.7','Y','Y','N'),('*B','3.0','Y','Y','N'),('*B-','2.7','Y','Y','N'),('*B+','3.3','Y','Y','N'),('*C','2.0','Y','Y','N'),('*C-','1.7','Y','Y','N'),('*C+','2.3','Y','Y','N'),('*CR','0.0','Y','Y','N'),('*D','1.0','Y','Y','N'),('*D-','0.7','Y','Y','N'),('*D+','1.3','Y','Y','N'),('*F','0.0','Y','N','Y'),('A','4.0','Y','Y','N'),('A-','3.7','Y','Y','N'),('A+','4.0','Y','Y','N'),('B','3.0','Y','Y','N'),('B-','2.7','Y','Y','N'),('B+','3.3','Y','Y','N'),('C','2.0','Y','Y','N'),('C-','1.7','Y','Y','N'),('C+','2.3','Y','Y','N'),('CR','0.0','N','Y','N'),('D','1.0','Y','Y','N'),('D-','0.7','Y','Y','N'),('D+','1.3','Y','Y','N'),('F','0.0','Y','N','Y'),('I','0.0','N','N','N'),('IC','0.0','Y','N','Y'),('NC','0.0','N','N','Y'),('PRV','0.0','N','N','N'),('RD','0.0','N','N','N'),('RP','0.0','N','N','N'),('RPT','0.0','N','N','N'),('SP','0.0','N','N','N'),('U','0.0','N','Y','Y'),('W','0.0','N','N','N'),('WU','0.0','Y','N','Y');
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-17 10:20:51
