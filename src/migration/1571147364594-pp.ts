import {MigrationInterface, QueryRunner} from "typeorm";

export class pp1571147364594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `pp` CHANGE `tt` `t` char NULL DEFAULT ''", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `pp` DROP COLUMN `t`", undefined);
        await queryRunner.query("ALTER TABLE `pp` ADD `t` char(3) NOT NULL DEFAULT 'null'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `pp` DROP COLUMN `t`", undefined);
        await queryRunner.query("ALTER TABLE `pp` ADD `t` char NULL DEFAULT ''", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `pp` CHANGE `t` `tt` char NULL DEFAULT ''", undefined);
    }

}
