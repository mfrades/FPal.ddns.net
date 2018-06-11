-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 16, 2018 at 11:14 AM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fpal.es`
--

-- --------------------------------------------------------

--
-- Table structure for table `competencia`
--

DROP TABLE IF EXISTS `competencia`;
CREATE TABLE IF NOT EXISTS `competencia` (
  `codigo` varchar(45) NOT NULL,
  `nivel` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `medios` varchar(2000) DEFAULT NULL,
  `productos` varchar(2000) DEFAULT NULL,
  `informacion` varchar(2000) DEFAULT NULL,
  `realizaciones` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `competencia`
--

INSERT INTO `competencia` (`codigo`, `nivel`, `nombre`, `medios`, `productos`, `informacion`, `realizaciones`) VALUES
('UC0255_1', 1, 'Ejecutar operaciones básicas de aprovisionamiento, preelaboración y conservación culinarios', 'Equipos e instrumentos de medida. Almacenes. Equipos de refrigeración. Mobiliario y maquinaria propia\nde un cuarto frío: abatidor de temperatura, máquinas de vacío, batidoras de brazo, máquina corta\nfiambres, vasos batidores y otros. Equipos de cocción. Pilas estáticas y móviles para lavar géneros\ncrudos. Utensilios y herramientas propios de la preelaboración culinaria. Materias primas, mercancías y\nmaterial de acondicionamiento y etiquetado. ', 'Limpieza y mantenimiento de equipos, máquinas y útiles propios de cuarto frío. Registro\ncumplimentado con datos correspondientes a recepción, almacenamiento y distribución en los soportes\nestablecidos. Mercancías y géneros preelaborados, acondicionados y conservados para su consumo\ninmediato o posterior distribución.', 'Instrucciones de seguridad, uso y manipulación de productos de limpieza y desinfección. Manuales de\nfuncionamiento de equipos, maquinaria e instalaciones propias de cuarto frío. Documentos\nnormalizados como \'relevés\', vales de pedidos, albaranes y fichas de almacén. Órdenes de trabajo.\nTablas de temperaturas de conservación de alimentos. Normativa aplicable de manipulación de\nalimentos, medioambiental y riesgos laborales', '[{\"title\":\"Ejecutar las diferentes operaciones de limpieza y puesta a punto de equipos y utillaje en el \\u00e1rea de producci\\u00f3n culinaria, respetando la normativa aplicable higi\\u00e9nico\\u2010sanitaria y las instrucciones recibidas\",\"criterios\":[\"La limpieza de superficies, equipos y utillaje propios del \\u00e1rea de producci\\u00f3n culinaria se\\nefect\\u00faa seg\\u00fan el sistema establecido, con los productos y m\\u00e9todos determinados.\"]}]'),
('UC0256_1', 1, 'Asistir en la elaboración culinaria y realizar y presentar preparaciones sencillas', 'Equipos e instrumentos de medida. Almacenes. Equipos de refrigeración. Mobiliario y maquinaria propia\nde un cuarto frío: abatidor de temperatura, máquinas de vacío, batidoras de brazo, máquina corta\nfiambres, vasos batidores y otros. Equipos de cocción. Pilas estáticas y móviles para lavar géneros\ncrudos. Utensilios y herramientas propios de la preelaboración culinaria. Materias primas, mercancías y\nmaterial de acondicionamiento y etiquetado. Material de limpieza.', 'Limpieza y mantenimiento de equipos, máquinas y útiles propios de cuarto frío. Registro\ncumplimentado con datos correspondientes a recepción, almacenamiento y distribución en los soportes\nestablecidos. Mercancías y géneros preelaborados, acondicionados y conservados para su consumo\ninmediato o posterior distribución.', 'Instrucciones de seguridad, uso y manipulación de productos de limpieza y desinfección. Manuales de\nfuncionamiento de equipos, maquinaria e instalaciones propias de cuarto frío. Documentos\nnormalizados como \'relevés\', vales de pedidos, albaranes y fichas de almacén. Órdenes de trabajo.\nTablas de temperaturas de conservación de alimentos. Normativa aplicable de manipulación de\nalimentos, medioambiental y riesgos laborales.', '[{\"title\":\"Ejecutar las diferentes operaciones de limpieza y puesta a punto de equipos y utillaje en el \\u00e1rea de producci\\u00f3n culinaria, respetando la normativa aplicable higi\\u00e9nico\\u2010sanitaria y las instrucciones recibidas.\",\"criterios\":[\" La limpieza de superficies, equipos y utillaje propios del \\u00e1rea de producci\\u00f3n culinaria se\\nefect\\u00faa seg\\u00fan el sistema establecido, con los productos y m\\u00e9todos determinados\",\"Las instrucciones de seguridad, uso y manipulaci\\u00f3n de productos utilizados en la\\nlimpieza y puesta a punto se cumplen, teniendo en cuenta su posible toxicidad y contaminaci\\u00f3n\\nmedioambiental\"]}]'),
('UC1769_2', 2, 'Conducir Black Jack', 'Medios', 'Productos', 'Info', '[{\"title\":\"Conducir el turno de apuestas con clientes en el juego de Black Jac\",\"criterios\":[\"Criterio 1\",\"Criterio 2\",\"Criterio 3\"]}]'),
('UC69_2', 2, 'Conducir el juego de Black Jack', 'Medios de producción', 'Productos y resultados', 'Info usada o generada', '[{\"title\":\"Organizar los elementos materiales necesarios\",\"criterios\":[\"Las fichas se exponen sobre la mesa de juego ordenad\",\"Las fichas se cuentan en lo que se refiere a su cantida\",\"Las fichas se guardan de manera ordenada, seg\\u00fan el proced\"]}]');

-- --------------------------------------------------------

--
-- Table structure for table `cualificacion`
--

DROP TABLE IF EXISTS `cualificacion`;
CREATE TABLE IF NOT EXISTS `cualificacion` (
  `codigo` varchar(45) NOT NULL,
  `nivel` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `familia` varchar(255) NOT NULL,
  `descripcion` varchar(2000) DEFAULT NULL,
  `entorno` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cualificacion`
--

INSERT INTO `cualificacion` (`codigo`, `nivel`, `nombre`, `familia`, `descripcion`, `entorno`) VALUES
('HOT541_2', 2, 'Actividades para el juego en mesas de casinos', 'Hostelería y turismo', 'Facilitar el desarrollo de los juegos de Black Jack, Póquer con descarte y Póquer sin descarte, Pu', 'Desarrolla su actividad pro'),
('HOT91_1', 1, 'Operaciones básicas de cocina', 'Hostelería y turismo', 'Preelaborar alimentos, preparar y presentar elaboraciones culinarias sencillas y asistir en la preparación de elaboraciones más complejas,', 'Desarrolla su actividad profesional como auxiliar o ayudante, tanto en grandes como en medianas y pequeñas empresas, principalmente del sector de hostelería');

-- --------------------------------------------------------

--
-- Table structure for table `cualif_compet`
--

DROP TABLE IF EXISTS `cualif_compet`;
CREATE TABLE IF NOT EXISTS `cualif_compet` (
  `cualifCompetId` int(11) NOT NULL AUTO_INCREMENT,
  `cualificacion` varchar(45) NOT NULL,
  `competencia` varchar(45) NOT NULL,
  PRIMARY KEY (`cualifCompetId`),
  UNIQUE KEY `comp_cualif` (`cualificacion`,`competencia`),
  KEY `competenciaId_idx` (`competencia`),
  KEY `cualificacionId_idx` (`cualificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cualif_compet`
--

INSERT INTO `cualif_compet` (`cualifCompetId`, `cualificacion`, `competencia`) VALUES
(14, 'HOT541_2', 'UC1769_2'),
(15, 'HOT541_2', 'UC69_2'),
(9, 'HOT91_1', 'UC0255_1'),
(10, 'HOT91_1', 'UC0256_1');

-- --------------------------------------------------------

--
-- Table structure for table `itinerario`
--

DROP TABLE IF EXISTS `itinerario`;
CREATE TABLE IF NOT EXISTS `itinerario` (
  `itinerarioId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `cualificacion` varchar(45) NOT NULL,
  `terminada` tinyint(4) DEFAULT NULL,
  `fechaFin` datetime DEFAULT NULL,
  `orden` int(11) NOT NULL,
  `fechaAdd` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userAdd` int(11) NOT NULL,
  PRIMARY KEY (`itinerarioId`),
  UNIQUE KEY `alumno_cualif` (`userId`,`cualificacion`),
  UNIQUE KEY `orden` (`userId`,`orden`),
  KEY `alumno_idx` (`userId`),
  KEY `cualificacion_idx` (`cualificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `itinerario`
--

INSERT INTO `itinerario` (`itinerarioId`, `userId`, `cualificacion`, `terminada`, `fechaFin`, `orden`, `fechaAdd`, `userAdd`) VALUES
(1, 5, 'HOT91_1', NULL, NULL, 1, '2018-04-09 20:32:10', 4),
(2, 5, 'HOT541_2', NULL, NULL, 2, '2018-04-09 21:04:44', 1),
(3, 7, 'HOT91_1', NULL, NULL, 1, '2018-04-10 13:19:00', 1),
(4, 8, 'HOT541_2', NULL, NULL, 1, '2018-04-11 09:48:51', 6);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `messageId` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `fechaAdd` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subject` varchar(255) DEFAULT NULL,
  `body` varchar(2000) DEFAULT NULL,
  `senderDelete` tinyint(4) DEFAULT NULL,
  `receiverDelete` tinyint(4) DEFAULT NULL,
  `leido` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `sender_idx` (`senderId`),
  KEY `receiver_idx` (`receiverId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`messageId`, `senderId`, `receiverId`, `fechaAdd`, `subject`, `body`, `senderDelete`, `receiverDelete`, `leido`) VALUES
(9, 1, 1, '2017-06-08 21:23:28', 'Otro asunto', 'Y un texto', 1, 1, NULL),
(10, 1, 1, '2017-06-12 20:20:33', 'asdf', 'asdf', 1, 1, NULL),
(11, 5, 4, '2018-04-09 18:27:45', 'Inicio de mi formación', 'Me gustaría obtener mi itinerario formativo', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET latin1 NOT NULL,
  `passwd` varchar(255) CHARACTER SET latin1 NOT NULL,
  `formacion` varchar(3000) CHARACTER SET latin1 DEFAULT NULL,
  `intereses` varchar(3000) CHARACTER SET latin1 DEFAULT NULL,
  `perspectivas` varchar(3000) CHARACTER SET latin1 DEFAULT NULL,
  `activo` tinyint(4) DEFAULT NULL,
  `foto` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET latin1 NOT NULL,
  `apellido` varchar(255) CHARACTER SET latin1 NOT NULL,
  `fechaAdd` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `email`, `passwd`, `formacion`, `intereses`, `perspectivas`, `activo`, `foto`, `nombre`, `apellido`, `fechaAdd`) VALUES
(1, 'admin@fpal.es', '$2y$10$rcjv7TKjET9fXHgaiWSR9uD5bAiNJvwuO8IOrhWwMqcrAg6/9EqGC', NULL, NULL, NULL, 1, '', 'Admin', '-', '2017-05-08 21:35:48'),
(3, 'admin2@fpal.es', '$2y$10$xiWVVGv9qwdTIVf1rc51N.5xAmPdoDhQvfYtKjFkZnig.cws.Dkga', '', '', '', NULL, '', 'A', 'S', '2018-04-05 14:56:04'),
(4, 'maria.frades.3@fpal.es', '$2y$10$0J2X6NpLOWlQcArBe6FqFurLdattajh6R7HCDFaII.8g8tRZSoY7G', 'Otra formación', 'Otros intereses', 'Otras perspectivas', 1, 'files/profile5.png', 'María', 'Frades', '2018-04-09 20:17:04'),
(5, 'julia.frades@fpal.es', '$2y$10$WUigvGR2kiCqcmYqbI1m9.TfmJ2oAK3NTur6HEHynLNgZhnSDDV8m', 'Formación de Julia', 'Intereses de Julia', 'Perspectivas de Julia', 1, 'files/profile2.png', 'Julia', 'Frades Castro', '2018-04-09 20:25:28'),
(6, 'irene.frades@fpal.es', '$2y$10$XBqq2xGA.OkWyhCeqTzb1e9zd8eG/58w/WBUT278s05pSvUcl4Yi.', 'Formación de Irene', 'Intereses de Irene', 'Perspectivas de Irene', 1, 'files/profile4.png', 'Irene', 'Frades', '2018-04-09 20:54:01'),
(7, 'rodrigo.sanchez@fpal.es', '$2y$10$HYiAcSBKRN8sVfHah84USezelvqjnfCohRLT17fa9b7NiU5kEsLN.', 'Formación de Rodrigo', 'Intereses de Rodrigo', 'Perspectivas de Rodrigo', 1, 'files/profile_0.png', 'Rodrigo', 'Sánchez', '2018-04-09 20:54:47'),
(8, 'carlos@fpal.es', '$2y$10$h/VXXCmv65BfQUyumxCFX.dtkSnBLSfhIWkX41Ie4oHV6dVOjipOe', 'Ingeniería en Informática', '', '', 1, '', 'Carlos ', 'González Contreras', '2018-04-11 09:46:41');

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

DROP TABLE IF EXISTS `usertype`;
CREATE TABLE IF NOT EXISTS `usertype` (
  `userTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `type` enum('Administrador','Formador','Alumno') CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`userTypeId`),
  UNIQUE KEY `userType` (`userId`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`userTypeId`, `userId`, `type`) VALUES
(3, 1, 'Administrador'),
(8, 4, 'Formador'),
(7, 5, 'Alumno'),
(11, 6, 'Formador'),
(10, 7, 'Alumno'),
(12, 8, 'Alumno');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cualif_compet`
--
ALTER TABLE `cualif_compet`
  ADD CONSTRAINT `compet` FOREIGN KEY (`competencia`) REFERENCES `competencia` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cualif` FOREIGN KEY (`cualificacion`) REFERENCES `cualificacion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `itinerario`
--
ALTER TABLE `itinerario`
  ADD CONSTRAINT `alumno` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cualificacion` FOREIGN KEY (`cualificacion`) REFERENCES `cualificacion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `receiver` FOREIGN KEY (`receiverId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sender` FOREIGN KEY (`senderId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usertype`
--
ALTER TABLE `usertype`
  ADD CONSTRAINT `user-type` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
