import {MigrationInterface, QueryRunner} from "typeorm";

export class tt1573557433416 implements MigrationInterface {
    name = 'tt1573557433416'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" number GENERATED ALWAYS AS IDENTITY, "services" clob NOT NULL, "username" varchar2(32) NOT NULL, "password" varchar2(128) NOT NULL, "email" varchar2(128) NOT NULL, "firstname" varchar2(32) NOT NULL, "lastname" varchar2(32) NOT NULL, "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP, "deletedAt" timestamp, "avatarId" number, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_58f5c71eaab331645112cf8cfa" UNIQUE ("avatarId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "document" ("id" number GENERATED ALWAYS AS IDENTITY, "fieldname" varchar2(255) NOT NULL, "filename" varchar2(255) NOT NULL, "path" varchar2(255) NOT NULL, "mimetype" varchar2(255) NOT NULL, "size" varchar2(255) NOT NULL, "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP, "deletedAt" timestamp, "userId" number, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" number GENERATED ALWAYS AS IDENTITY, "refreshToken" varchar2(255) NOT NULL, "ip" varchar2(45) NOT NULL, "expires" timestamp NOT NULL, "userId" number, CONSTRAINT "UQ_d3c101c32c10aa50b1f7077a664" UNIQUE ("userId", "ip"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "document" ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`, undefined);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`, undefined);
        await queryRunner.query(`DROP TABLE "refresh_token"`, undefined);
        await queryRunner.query(`DROP TABLE "document"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
