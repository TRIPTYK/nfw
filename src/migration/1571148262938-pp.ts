import {MigrationInterface, QueryRunner} from "typeorm";

export class pp1571148262938 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `pp` ADD `r` char(3) NULL DEFAULT 'null'", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `pp` DROP COLUMN `r`", undefined);
    }

}
