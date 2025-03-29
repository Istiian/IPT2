-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: room_management
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `BookingId` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `RoomId` int NOT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `BookingDate` date DEFAULT NULL,
  `Purpose` enum('Lecture','Extra-Curricular Activities','Access to Specialized Equipment','Research Activities') COLLATE macce_bin NOT NULL,
  `Decision` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`BookingId`),
  KEY `UserId` (`UserId`),
  KEY `RoomId` (`RoomId`),
  CONSTRAINT `RoomId` FOREIGN KEY (`RoomId`) REFERENCES `room` (`RoomId`) ON DELETE CASCADE,
  CONSTRAINT `UserId` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=macce COLLATE=macce_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,1,4,'07:30:00','10:30:00','2025-03-25','Extra-Curricular Activities',1),(2,1,1,'08:00:00','08:30:00','2025-03-25','Research Activities',0),(3,1,5,'07:30:00','08:00:00','2025-03-25','Access to Specialized Equipment',0),(4,1,4,'18:30:00','20:00:00','2025-03-27','Research Activities',0),(5,1,3,'08:00:00','09:00:00','2025-03-28','Access to Specialized Equipment',1),(6,1,4,'07:00:00','07:30:00','2025-03-27','Extra-Curricular Activities',1),(7,1,3,'09:00:00','10:30:00','2025-03-28','Research Activities',1),(8,1,7,'07:30:00','09:30:00','2025-03-27','Access to Specialized Equipment',1),(9,1,7,'07:00:00','09:30:00','2025-03-27','Lecture',0),(10,1,7,'07:00:00','11:30:00','2025-03-27','Lecture',0),(11,1,7,'14:30:00','16:30:00','2025-03-27','Lecture',0),(12,1,4,'08:00:00','09:30:00','2025-03-28','Access to Specialized Equipment',0),(13,1,4,'07:30:00','08:30:00','2025-03-27','Extra-Curricular Activities',0),(14,1,4,'10:30:00','11:00:00','2025-03-27','Research Activities',0),(15,1,2,'09:00:00','09:30:00','2025-03-28','Access to Specialized Equipment',0),(16,1,5,'07:00:00','10:00:00','2025-04-01','Research Activities',1),(17,1,5,'08:00:00','08:30:00','2025-03-27','Lecture',0),(18,1,4,'09:00:00','09:30:00','2025-03-27','Access to Specialized Equipment',1),(19,1,4,'08:30:00','10:30:00','2025-03-27','Research Activities',0),(20,1,5,'07:00:00','08:30:00','2025-03-29','Access to Specialized Equipment',0),(21,1,5,'07:00:00','08:00:00','2025-03-29','Access to Specialized Equipment',1),(22,1,3,'09:00:00','09:30:00','2025-03-29','Extra-Curricular Activities',NULL),(23,1,2,'17:00:00','17:30:00','2025-03-29','Access to Specialized Equipment',NULL);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-29 21:04:37
