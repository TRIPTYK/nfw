import { Migration } from '@mikro-orm/migrations';

export class Migration20231109141206 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table "documents" ("id" varchar(255) not null, "filename" varchar(255) not null, "original_name" varchar(255) not null, "path" varchar(255) not null, "mimetype" text check ("mimetype" in (\'applcation/vnd.ms-excel\', \'application/msword\', \'application/zip\', \'application/pdf\', \'image/bmp\', \'image/gif\', \'image/jpeg\', \'image/png\', \'text/csv\', \'text/plain\')) not null, "size" int not null, constraint "documents_pkey" primary key ("id"));');

    this.addSql('create table "users" ("id" varchar(255) not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) null, "role" text check ("role" in (\'admin\', \'user\')) not null default \'user\', constraint "users_pkey" primary key ("id"));');

    this.addSql('create table "refresh-token" ("id" varchar(255) not null, "token" varchar(255) not null, "expires" timestamptz(0) not null, "user_id" varchar(255) not null, constraint "refresh-token_pkey" primary key ("id"));');
    this.addSql('alter table "refresh-token" add constraint "refresh-token_user_id_unique" unique ("user_id");');

    this.addSql('create table "users_documents" ("user_model_id" varchar(255) not null, "document_model_id" varchar(255) not null, constraint "users_documents_pkey" primary key ("user_model_id", "document_model_id"));');

    this.addSql('alter table "refresh-token" add constraint "refresh-token_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "users_documents" add constraint "users_documents_user_model_id_foreign" foreign key ("user_model_id") references "users" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "users_documents" add constraint "users_documents_document_model_id_foreign" foreign key ("document_model_id") references "documents" ("id") on update cascade on delete cascade;');
  }
}
