import {MigrationInterface, QueryRunner} from "typeorm";

export class pp1571146547909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `pp` CHANGE `r` `tt` char(4) NULL DEFAULT 'null'", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `pp` DROP COLUMN `tt`", undefined);
        await queryRunner.query("ALTER TABLE `pp` ADD `tt` char NULL DEFAULT ''", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `pp` DROP COLUMN `tt`", undefined);
        await queryRunner.query("ALTER TABLE `pp` ADD `tt` char(4) NULL DEFAULT 'null'", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `pp` CHANGE `tt` `r` char(4) NULL DEFAULT 'null'", undefined);
    }

}
