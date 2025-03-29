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
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `RoomId` int NOT NULL AUTO_INCREMENT,
  `Room_Name` varchar(100) COLLATE macce_bin NOT NULL,
  `Features` set('Television','Air-conditioned','Computer','Electric Fan','Projector','White Board') COLLATE macce_bin NOT NULL,
  `Coordinates` json DEFAULT NULL,
  PRIMARY KEY (`RoomId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=macce COLLATE=macce_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'CCS 101','Television,Electric Fan,White Board','[[51.4946, -0.10125], [51.4946, -0.084], [51.4808, -0.084], [51.4808, -0.10125]]'),(2,'CCS 102','Television,Electric Fan,White Board','[[51.4946, -0.084], [51.4946, -0.06675], [51.4808, -0.06675], [51.4808, -0.084]]'),(3,'CCS 104','Television,Electric Fan,White Board','[[51.5192, -0.10125], [51.5192, -0.08564], [51.5054, -0.08564], [51.5054, -0.10125]]'),(4,'CCS 105','Television,Electric Fan,White Board','[[51.5192, -0.08564], [51.5192, -0.07003], [51.5054, -0.07003], [51.5054, -0.08564]]'),(5,'CCS 106','Television,Electric Fan,White Board','[[51.5192, -0.07003], [51.5192, -0.05442], [51.5054, -0.05442], [51.5054, -0.07003]]'),(6,'CCS 201','Electric Fan,White Board','[[51.4946, -0.1185], [51.4946, -0.1013], [51.4808, -0.1013], [51.4808, -0.1185]]'),(7,'CCS 202','Electric Fan,White Board','[[51.4946, -0.1013], [51.4946, -0.0841], [51.4808, -0.0841], [51.4808, -0.1013]]'),(8,'CCS 203','Electric Fan,White Board','[[51.4946, -0.0841], [51.4946, -0.0669], [51.4808, -0.0669], [51.4808, -0.0841]]'),(9,'CCS 204','Electric Fan,White Board','[[51.4946, -0.0669], [51.4946, -0.0584], [51.4808, -0.0584], [51.4808, -0.0669]]'),(10,'Acer Lab 1','Air-conditioned,Computer,Electric Fan,White Board','[[51.5191, -0.1013], [51.5191, -0.0858], [51.5054, -0.0858], [51.5054, -0.1013]]'),(11,'CCS Lab 1','Air-conditioned,Computer,Electric Fan,White Board','[[51.5191, -0.0703], [51.5191, -0.0548], [51.5054, -0.0548], [51.5054, -0.0703]]'),(12,'CCS Lab 2','Air-conditioned,Computer,Electric Fan,White Board','[[51.5191, -0.0858], [51.5191, -0.0703], [51.5054, -0.0703], [51.5054, -0.0858]]');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
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
