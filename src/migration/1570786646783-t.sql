/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: document
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: refresh_token
# ------------------------------------------------------------

INSERT INTO `refresh_token` (`id`,`refreshToken`,`ip`,`expires`,`userId`) VALUES (2,'2.120e861964f1b8a801fb21c8131e9b078a2c5e4d87bcc05de4f9d085f5893e79d2c3c3b478fc1044','::ffff:127.0.0.1','2019-10-15 09:30:23',2);
INSERT INTO `refresh_token` (`id`,`refreshToken`,`ip`,`expires`,`userId`) VALUES (6,'5.31d2a98614014663ca5f24e70078b63349e1bd6b79e6bacbfd0a1efc5fe99ca0fa1f29baf364d6fc','::ffff:127.0.0.1','2019-10-15 09:42:31',5);
INSERT INTO `refresh_token` (`id`,`refreshToken`,`ip`,`expires`,`userId`) VALUES (10,'8.7476108b053e22b4d93555731c6c6eedfc6a94155a4e1180a6e4eb6df5bfdc6d4396aca5f4a0baf7','::ffff:127.0.0.1','2019-10-15 14:15:13',8);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user
# ------------------------------------------------------------

INSERT INTO `user` (`id`,`services`,`username`,`password`,`email`,`firstname`,`lastname`,`role`,`createdAt`,`updatedAt`,`deletedAt`,`avatarId`) VALUES (2,'{}','16308aaf-d01c-4232-a059-721a1ad4','$2b$10$kmdeheP/XXzdSerek5ddW.79tDhddXTCK/fWuGfe49RnkEU1V.RVO','c9d37db4-23dc-4875-831b-156503c8@triptyk.be','tinKoMXV','GDXAknKe','admin','2019-10-15 07:15:23.073454','2019-10-15 07:15:23.073454',NULL,NULL);
INSERT INTO `user` (`id`,`services`,`username`,`password`,`email`,`firstname`,`lastname`,`role`,`createdAt`,`updatedAt`,`deletedAt`,`avatarId`) VALUES (5,'{}','dfa28a75-dbd6-454c-bffe-20edf3af','$2b$10$txqLnBeGsRxTe/dSSEVUUuiTdnqsHQL/Nce3joXYC96mOL6VmwiX2','ac5b085d-d87d-415d-8eab-005f06c2@triptyk.be','EjRlhKTe','cRxzCuoO','admin','2019-10-15 07:27:30.868441','2019-10-15 07:27:30.868441',NULL,NULL);
INSERT INTO `user` (`id`,`services`,`username`,`password`,`email`,`firstname`,`lastname`,`role`,`createdAt`,`updatedAt`,`deletedAt`,`avatarId`) VALUES (8,'{}','3865e0b0-74f0-4eb0-8ee1-f3a76e16','$2b$10$iWZP/FYlx9ijscFRTMwZsOPJZdp4lTr7qRk8BjhVvA8PBAY0stqdi','c266d86a-db28-46d6-a444-84f5356b@triptyk.be','GReWdQql','qxozHhEc','admin','2019-10-15 12:00:12.813296','2019-10-15 12:00:12.813296',NULL,NULL);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
