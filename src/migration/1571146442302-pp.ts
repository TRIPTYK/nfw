import {MigrationInterface, QueryRunner} from "typeorm";

export class pp1571146442302 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `pp` (`id` int NOT NULL AUTO_INCREMENT, `r` char(4) NULL DEFAULT 'null', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `user`", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `user` varchar(55) NOT NULL DEFAULT 'null'", undefined);
        await queryRunner.query("DROP TABLE `pp`", undefined);
    }

}
