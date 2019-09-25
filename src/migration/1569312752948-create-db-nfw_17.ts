import {MigrationInterface, QueryRunner} from "typeorm";

export class createDbNfw171569312752948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `services` text NOT NULL, `username` varchar(32) NOT NULL, `password` varchar(128) NOT NULL, `email` varchar(128) NOT NULL, `firstname` varchar(32) NOT NULL, `lastname` varchar(32) NOT NULL, `role` enum ('admin', 'user', 'ghost') NOT NULL DEFAULT 'ghost', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL DEFAULT null, `avatarId` int NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), UNIQUE INDEX `REL_58f5c71eaab331645112cf8cfa` (`avatarId`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `document` (`id` int NOT NULL AUTO_INCREMENT, `fieldname` enum ('picture', 'document', 'avatar') NOT NULL, `filename` varchar(255) NOT NULL, `path` varchar(255) NOT NULL, `mimetype` enum ('application/vnd.ms-excel', 'application/msword', 'application/zip', 'application/pdf', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'text/csv') NOT NULL, `size` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL DEFAULT null, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `refresh_token` (`id` int NOT NULL AUTO_INCREMENT, `refreshToken` varchar(255) NOT NULL, `ip` varchar(45) NOT NULL, `expires` datetime NOT NULL, `userId` int NULL, UNIQUE INDEX `IDX_d3c101c32c10aa50b1f7077a66` (`userId`, `ip`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_58f5c71eaab331645112cf8cfa5` FOREIGN KEY (`avatarId`) REFERENCES `document`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD CONSTRAINT `FK_7424ddcbdf1e9b067669eb0d3fd` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `refresh_token` ADD CONSTRAINT `FK_8e913e288156c133999341156ad` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `refresh_token` DROP FOREIGN KEY `FK_8e913e288156c133999341156ad`", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP FOREIGN KEY `FK_7424ddcbdf1e9b067669eb0d3fd`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_58f5c71eaab331645112cf8cfa5`", undefined);
        await queryRunner.query("DROP INDEX `IDX_d3c101c32c10aa50b1f7077a66` ON `refresh_token`", undefined);
        await queryRunner.query("DROP TABLE `refresh_token`", undefined);
        await queryRunner.query("DROP TABLE `document`", undefined);
        await queryRunner.query("DROP INDEX `REL_58f5c71eaab331645112cf8cfa` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
    }

}
