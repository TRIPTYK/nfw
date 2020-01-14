import {MigrationInterface, QueryRunner} from "typeorm";

export class test1578061632974 implements MigrationInterface {
    name = 'test1578061632974'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_d3c101c32c10aa50b1f7077a66` ON `refresh_token`", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `createdAt`", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `updatedAt`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `refresh_token` ADD `pid` int NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `fieldname`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `fieldname` varchar(255) ('picture', 'document', 'avatar') NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `mimetype`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `mimetype` varchar(255) ('application/vnd.ms-excel', 'application/msword', 'application/zip', 'application/pdf', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'text/csv') NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `size`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `size` int NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL DEFAULT null", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_fd232a2ab74eb52217b050cfb1` ON `refresh_token` (`userId`, `ip`, `pid`)", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_fd232a2ab74eb52217b050cfb1` ON `refresh_token`", undefined);
        await queryRunner.query("ALTER TABLE `document` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `size`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `size` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `mimetype`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `mimetype` enum ('application/vnd.ms-excel', 'application/msword', 'application/zip', 'application/pdf', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'text/csv') NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `fieldname`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `fieldname` enum ('picture', 'document', 'avatar') NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `deletedAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `refresh_token` DROP COLUMN `pid`", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `updated_at`", undefined);
        await queryRunner.query("ALTER TABLE `document` DROP COLUMN `created_at`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `updated_at`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `created_at`", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("ALTER TABLE `document` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_d3c101c32c10aa50b1f7077a66` ON `refresh_token` (`userId`, `ip`)", undefined);
    }

}
