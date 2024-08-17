import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1723908200272 implements MigrationInterface {
  name = 'Update1723908200272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying, "password" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "gender" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "province" character varying NOT NULL, "photo" character varying NOT NULL, "profile_desc" text, "phone_number" character varying, "membership" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user-like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "liked_by_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_19407b529b1a0ced5065ee8c4b1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user-view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "viewed_by_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c97d44064b78f05400b51651e9d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "photo_1" character varying NOT NULL, "photo_2" character varying, "photo_3" character varying, "photo_4" character varying, "photo_5" character varying, "descriptions" text, "like" integer DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "album-like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "album_id" uuid NOT NULL, "liked_by_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_220a7e2eccd3c39d0baa51f3444" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user-like" ADD CONSTRAINT "FK_30784e0e3a9f05f51b62786388f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user-like" ADD CONSTRAINT "FK_efa3e0899df1de11869e19f91d8" FOREIGN KEY ("liked_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user-view" ADD CONSTRAINT "FK_b6bd032be592e4544d3c130a10c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user-view" ADD CONSTRAINT "FK_8eea3d9182401f3a9bf9d035b12" FOREIGN KEY ("viewed_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_0a8f3f18f0357876c7b14f123b3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "album-like" ADD CONSTRAINT "FK_5e1c8aeaa4928daadd79128dab4" FOREIGN KEY ("album_id") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "album-like" ADD CONSTRAINT "FK_57fa7cd43f50f89ab0e83d1de3e" FOREIGN KEY ("liked_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album-like" DROP CONSTRAINT "FK_57fa7cd43f50f89ab0e83d1de3e"`
    );
    await queryRunner.query(
      `ALTER TABLE "album-like" DROP CONSTRAINT "FK_5e1c8aeaa4928daadd79128dab4"`
    );
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_0a8f3f18f0357876c7b14f123b3"`
    );
    await queryRunner.query(
      `ALTER TABLE "user-view" DROP CONSTRAINT "FK_8eea3d9182401f3a9bf9d035b12"`
    );
    await queryRunner.query(
      `ALTER TABLE "user-view" DROP CONSTRAINT "FK_b6bd032be592e4544d3c130a10c"`
    );
    await queryRunner.query(
      `ALTER TABLE "user-like" DROP CONSTRAINT "FK_efa3e0899df1de11869e19f91d8"`
    );
    await queryRunner.query(
      `ALTER TABLE "user-like" DROP CONSTRAINT "FK_30784e0e3a9f05f51b62786388f"`
    );
    await queryRunner.query(`DROP TABLE "album-like"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "user-view"`);
    await queryRunner.query(`DROP TABLE "user-like"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
