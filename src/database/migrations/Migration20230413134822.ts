import { Migration } from '@mikro-orm/migrations';

export class Migration20230413134822 extends Migration {
  async up (): Promise<void> {
    this.addSql('create table `documents` (`id` varchar(255) not null, `filename` varchar(255) not null, `original_name` varchar(255) not null, `path` varchar(255) not null, `mimetype` enum(\'applcation/vnd.ms-excel\', \'application/msword\', \'application/zip\', \'application/pdf\', \'image/bmp\', \'image/gif\', \'image/jpeg\', \'image/png\', \'text/csv\', \'text/plain\') not null, `size` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `users` (`id` varchar(255) not null, `first_name` varchar(255) not null, `last_name` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) null, `role` enum(\'admin\', \'user\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `refresh-token` (`id` varchar(255) not null, `token` varchar(255) not null, `expires` datetime not null, `user_id` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `refresh-token` add unique `refresh-token_user_id_unique`(`user_id`);');

    this.addSql('create table `users_documents` (`user_model_id` varchar(255) not null, `document_model_id` varchar(255) not null, primary key (`user_model_id`, `document_model_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `users_documents` add index `users_documents_user_model_id_index`(`user_model_id`);');
    this.addSql('alter table `users_documents` add index `users_documents_document_model_id_index`(`document_model_id`);');

    this.addSql('alter table `refresh-token` add constraint `refresh-token_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade;');

    this.addSql('alter table `users_documents` add constraint `users_documents_user_model_id_foreign` foreign key (`user_model_id`) references `users` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `users_documents` add constraint `users_documents_document_model_id_foreign` foreign key (`document_model_id`) references `documents` (`id`) on update cascade on delete cascade;');
  }

  async down (): Promise<void> {
    this.addSql('alter table `users_documents` drop foreign key `users_documents_document_model_id_foreign`;');

    this.addSql('alter table `refresh-token` drop foreign key `refresh-token_user_id_foreign`;');

    this.addSql('alter table `users_documents` drop foreign key `users_documents_user_model_id_foreign`;');

    this.addSql('drop table if exists `documents`;');

    this.addSql('drop table if exists `users`;');

    this.addSql('drop table if exists `refresh-token`;');

    this.addSql('drop table if exists `users_documents`;');
  }
}
