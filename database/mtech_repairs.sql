-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: mtech_repairs
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accessories`
--

DROP TABLE IF EXISTS `accessories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accessories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` enum('Chargers','Cables','Cases','Screen Protectors','Audio','Other') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(500) DEFAULT '',
  `in_stock` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accessories`
--

LOCK TABLES `accessories` WRITE;
/*!40000 ALTER TABLE `accessories` DISABLE KEYS */;
INSERT INTO `accessories` VALUES (1,'20W USB-C Fast Charger','Chargers',15.00,'/uploads/1791306177248-963137903.webp',1,'2026-10-04 10:53:26','2026-10-06 17:03:03'),(2,'Braided USB-C to Lightning Cable','Cables',10.00,'/uploads/1791306816824-962876218.jpeg',1,'2026-10-04 10:53:26','2026-10-06 17:13:39'),(3,'Clear Shockproof Case','Cases',12.00,'/uploads/1791306879424-456232592.jpeg',1,'2026-10-04 10:53:26','2026-10-06 17:14:41'),(4,'Tempered Glass Screen Protector','Screen Protectors',8.00,'/uploads/1791306915953-353501302.webp',1,'2026-10-04 10:53:26','2026-10-06 17:15:17'),(5,'Wireless Earbuds','Audio',35.00,'/uploads/1791306949465-241060027.webp',1,'2026-10-04 10:53:26','2026-10-06 17:15:51'),(6,'MagSafe Charging Pad','Chargers',25.00,'/uploads/1791306769104-860779191.jpg',1,'2026-10-04 10:53:26','2026-10-06 17:12:51');
/*!40000 ALTER TABLE `accessories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notify_orders` tinyint(1) NOT NULL DEFAULT '1',
  `notify_repairs` tinyint(1) NOT NULL DEFAULT '1',
  `notify_stock` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'MTech Admin','admin@mtechrepairs.co.uk',NULL,'$2a$10$bsQXZqmxvDNEV9rfkz3Q8erOxoizKETEw8oe.Io8YlgOcDYfrewm2','admin',1,'2026-10-06 14:35:31','2026-10-14 09:31:41',1,1,1);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `device_category` varchar(100) NOT NULL,
  `device_model` varchar(255) NOT NULL,
  `issue` text NOT NULL,
  `preferred_date` datetime DEFAULT NULL,
  `status` enum('pending','confirmed','in-progress','completed','cancelled') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_email` (`email`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_preferred_date` (`preferred_date`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'Zainab Aziz','znbaziz2004@gmail.com','+98766554','Mobile Phone — iPhone','iPhone 15','Battery Replacement — Interested in: Screen Replacement','2026-10-21 00:00:00','completed','','2026-10-06 14:56:00','2026-10-06 15:28:12'),(2,'Maryam','maryam@gmail.com','67554646446','Macbook — iPhone','iPhone 16','Battery Replacement — Interested in: Battery Replacement',NULL,'confirmed','','2026-10-06 15:31:17','2026-10-07 16:24:43'),(3,'Tester','test4@gmail.com','+44 3001234567','Gaming Console — Other Android','Motorola','IC Repair — hello','2026-10-23 00:00:00','confirmed',NULL,'2026-10-15 05:52:36','2026-10-15 05:52:47');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `subject` varchar(255) DEFAULT 'General Enquiry',
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_email` (`email`),
  KEY `idx_contact_read` (`is_read`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Zainab Aziz','znbaziz2004@gmail.com','+92 3001234567','Buy & Sell','[Device: Iphone 15 pro max] hello',0,'2026-10-06 14:28:15','2026-10-06 14:28:15'),(2,'tester','tester@gmail.com','09865432','Repair Question','[Device: Iphone 12 pro max] hello',0,'2026-10-06 14:56:51','2026-10-06 14:56:51');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` enum('Mobile Phone','Tablet','iPad','Laptop','Smartwatch','Console','Other') NOT NULL,
  `brand` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT '',
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_devices_category` (`category`),
  KEY `idx_devices_brand` (`brand`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'iPhone 15 Pro','Mobile Phone','Apple','','iphone-15-pro','2026-10-04 10:53:25','2026-10-04 10:53:25'),(2,'iPhone 14','Mobile Phone','Apple','','iphone-14','2026-10-04 10:53:25','2026-10-04 10:53:25'),(3,'Galaxy S24','Mobile Phone','Samsung','','galaxy-s24','2026-10-04 10:53:25','2026-10-04 10:53:25'),(4,'Galaxy A54','Mobile Phone','Samsung','','galaxy-a54','2026-10-04 10:53:25','2026-10-04 10:53:25'),(5,'iPad Pro 12.9\"','iPad','Apple','','ipad-pro-12-9','2026-10-04 10:53:25','2026-10-04 10:53:25'),(6,'iPad Air','iPad','Apple','','ipad-air','2026-10-04 10:53:25','2026-10-04 10:53:25'),(7,'Galaxy Tab S9','Tablet','Samsung','','galaxy-tab-s9','2026-10-04 10:53:25','2026-10-04 10:53:25'),(8,'MacBook Pro 14\"','Laptop','Apple','','macbook-pro-14','2026-10-04 10:53:25','2026-10-04 10:53:25'),(9,'MacBook Air M2','Laptop','Apple','','macbook-air-m2','2026-10-04 10:53:25','2026-10-04 10:53:25'),(10,'Apple Watch Series 9','Smartwatch','Apple','','apple-watch-series-9','2026-10-04 10:53:25','2026-10-04 10:53:25'),(11,'PS5','Console','Sony','','ps5','2026-10-04 10:53:25','2026-10-04 10:53:25');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `item_type` enum('product','accessory') NOT NULL DEFAULT 'accessory',
  `source_item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,2,'Braided USB-C to Lightning Cable',1,10.00,'2026-10-07 15:23:17','accessory',NULL),(2,1,3,'Clear Shockproof Case',1,12.00,'2026-10-07 15:23:17','accessory',NULL),(3,2,6,'Galaxy S22',1,280.00,'2026-10-08 04:37:42','accessory',NULL),(4,3,6,'MagSafe Charging Pad',1,25.00,'2026-10-12 11:08:47','accessory',NULL),(5,4,1,'iPhone 13',2,320.00,'2026-10-14 10:02:23','accessory',NULL),(6,5,NULL,'MagSafe Charging Pad',1,25.00,'2026-10-14 10:37:55','accessory',6),(7,6,NULL,'MagSafe Charging Pad',1,25.00,'2026-10-14 10:40:09','accessory',6),(8,7,2,'iPhone 12',1,240.00,'2026-10-15 05:38:44','product',2),(9,7,4,'iPhone SE (2022)',1,299.00,'2026-10-15 05:38:44','product',4);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(100) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT '',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_orders_email` (`email`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'MTECH-1791386596334','Affan','affan@gmail.com','472373737371',22.00,'pending','processing','Delivery Address: ddhkdhqqhqhdq, UK','2026-10-07 15:23:17','2026-10-07 15:52:59'),(2,'MTECH-1791434261653','Maryam','maryam@gmail.com','3829238292382',280.00,'pending','pending','Delivery Address: gqgqjggqdgqd, ifwhqwh','2026-10-08 04:37:42','2026-10-08 04:37:42'),(3,'MTECH-1791803326995','aaa','aaa@gmail.com','03001112223',25.00,'pending','pending','Delivery Address: deldeledddj3dod3, Pakistan','2026-10-12 11:08:47','2026-10-12 11:08:47'),(4,'MTECH-1791972142728','testing','tst@gmail.com','+18973676432',640.00,'pending','pending','Delivery Address: 2l2ldhl2djl2d2d, turkey','2026-10-14 10:02:23','2026-10-14 10:02:23'),(5,'MTECH-1791974275675-9660','zainab','znb@gmail.com','9876543',25.00,'pending','processing','Delivery Address: abcd, turkey','2026-10-14 10:37:55','2026-10-15 05:04:26'),(6,'MTECH-1791974409236-9700','znb','zn@gmail.com','4312567876543',25.00,'paid','completed','Delivery Address: hsdhqdhkqhwld, turkey','2026-10-14 10:40:09','2026-10-15 05:01:24'),(7,'MTECH-1792042724179-2910','Zainab Aziz','znbaziz2004@gmail.com','+92 3001234567',539.00,'paid','pending','Delivery Address: abcd, Pakistan','2026-10-15 05:38:44','2026-10-15 05:39:58');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `stripe_session_id` varchar(255) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'gbp',
  `status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT 'card',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_stripe_session_id` (`stripe_session_id`),
  KEY `idx_payments_order_id` (`order_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_created_at` (`created_at`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,5,NULL,NULL,25.00,'gbp','pending','card','2026-10-14 10:37:55','2026-10-14 10:37:55'),(2,6,'cs_test_a1kZvKpdntJsayAf2rwBCRFnvuj3ocNz996Oi3LFWB2KmVfxpa71LjXLXx','pi_3UQPbtK9vscOW5zb0FDuC57i',25.00,'gbp','paid','card','2026-10-14 10:40:09','2026-10-14 10:40:40'),(3,7,'cs_test_b1lppGpovb7qNAozL0zSvBSaTk68BCLBTKQCa9TNDtonC9KSUoqadGw5el','pi_3UQhORK9vscOW5zb09mKz6Qi',539.00,'gbp','paid','card','2026-10-15 05:38:44','2026-10-15 05:39:58');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `condition_type` enum('New','Used','Refurbished') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `storage` varchar(100) DEFAULT '',
  `color` varchar(100) DEFAULT '',
  `image` varchar(500) DEFAULT '',
  `in_stock` tinyint(1) DEFAULT '1',
  `description` text,
  `listing_type` enum('buy','sell-request') DEFAULT 'buy',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_products_brand` (`brand`),
  KEY `idx_products_condition` (`condition_type`),
  KEY `idx_products_listing_type` (`listing_type`),
  KEY `idx_products_stock` (`in_stock`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 13','Apple','parts','Refurbished',320.00,'','','/uploads/1791390872567-516991216.jpeg',1,'','buy','2026-10-04 10:53:26','2026-10-07 16:46:49'),(2,'iPhone 12','Apple','parts','Used',240.00,'','','/uploads/1791390939941-395192548.jpeg',11,'','buy','2026-10-04 10:53:26','2026-10-08 04:38:18'),(4,'iPhone SE (2022)','Apple','parts','New',299.00,'','','/uploads/1791390986237-93260284.jpeg',1,'','buy','2026-10-04 10:53:26','2026-10-07 16:46:37'),(5,'iPhone 15 Pro Screen','Apple',NULL,'Used',0.00,'128GB','Grey','',0,'hello','sell-request','2026-10-06 14:29:50','2026-10-06 14:29:50'),(6,'Galaxy S22','Samsung','parts','Refurbished',280.00,'','','/uploads/1791390700160-743212740.webp',1,'','buy','2026-10-07 16:30:36','2026-10-07 16:42:37');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` enum('Repair','Board Level','Microsoldering','IC Work','Buy & Sell','Accessories','Diagnostics') NOT NULL,
  `level` enum('Level 1','Level 2','Level 3','Level 4','N/A') DEFAULT 'N/A',
  `price_from` decimal(10,2) DEFAULT '0.00',
  `est_time` varchar(100) DEFAULT '',
  `icon` varchar(100) DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_category` (`category`),
  KEY `idx_services_level` (`level`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Screen Replacement','Cracked or unresponsive screen replaced with quality parts.','Repair','Level 1',40.00,'30-45 mins','screen','2026-10-04 10:53:25','2026-10-04 10:53:25'),(2,'Battery Replacement','Restore battery health and charging performance.','Repair','Level 1',30.00,'20-30 mins','battery','2026-10-04 10:53:25','2026-10-04 10:53:25'),(3,'Charging Port Repair','Fix loose or non-charging ports.','Repair','Level 2',35.00,'30-45 mins','port','2026-10-04 10:53:25','2026-10-04 10:53:25'),(4,'Board Level Repair','Component-level diagnosis and repair on the logic board.','Board Level','Level 3',60.00,'1-3 days','board','2026-10-04 10:53:26','2026-10-04 10:53:26'),(5,'Microsoldering','Precision soldering for IC replacement, tristar, and CPU-level faults.','Microsoldering','Level 4',90.00,'2-4 days','solder','2026-10-04 10:53:26','2026-10-04 10:53:26'),(6,'IC Chip Replacement','Replacement of faulty power management, NAND, or audio ICs.','IC Work','Level 4',80.00,'1-3 days','chip','2026-10-04 10:53:26','2026-10-04 10:53:26'),(7,'Water Damage Recovery','Ultrasonic cleaning and corrosion treatment for liquid-damaged boards.','Board Level','Level 3',50.00,'1-2 days','water','2026-10-04 10:53:26','2026-10-04 10:53:26'),(8,'Full Diagnostics Check','Complete hardware and software diagnostic report.','Diagnostics','N/A',15.00,'20 mins','diagnostics','2026-10-04 10:53:26','2026-10-04 10:53:26');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT '',
  `message` text NOT NULL,
  `rating` tinyint DEFAULT '5',
  `approved` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_testimonials_approved` (`approved`),
  CONSTRAINT `chk_testimonial_rating` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Sarah Johnson','Small Business Owner','My phone was repaired in under an hour. Professional and honest service.',5,1,'2026-10-04 10:53:26','2026-10-04 10:53:26'),(2,'Michael Chen','IT Manager','We use them for all company devices — reliable, fast, and cost-effective.',5,1,'2026-10-04 10:53:26','2026-10-04 10:53:26'),(3,'Emily Rodriguez','Student','Fixed my water-damaged phone when other shops said it was unfixable.',5,1,'2026-10-04 10:53:26','2026-10-04 10:53:26'),(4,'David Wilson','Retired','Patient, clear explanations, no unnecessary upselling.',4,1,'2026-10-04 10:53:26','2026-10-04 10:53:26');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-15 12:29:16
