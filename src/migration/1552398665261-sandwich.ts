import {MigrationInterface, QueryRunner} from "typeorm";

export class sandwich1552398665261 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `sandwich` (`id` int NOT NULL AUTO_INCREMENT, `title` datetime NULL DEFAULT null, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` CHANGE `createdAt` `createdAt` datetime NOT NULL DEFAULT '2019-03-12'");
        await queryRunner.query("ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime NULL DEFAULT null");
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null");
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null");
        await queryRunner.query("ALTER TABLE `refresh_token` CHANGE `expires` `expires` datetime NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `refresh_token` CHANGE `expires` `expires` datetime(0) NOT NULL");
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime(0) NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime(0) NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(0) NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT '2019-03-12 00:00:00'");
        await queryRunner.query("DROP TABLE `sandwich`");
    }

}
