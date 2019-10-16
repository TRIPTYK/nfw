import {MigrationInterface, QueryRunner} from "typeorm";

export class removeUserFromUser1571143729361 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `user` varchar(55) NOT NULL DEFAULT 'null'", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `user`", undefined);
    }

}
