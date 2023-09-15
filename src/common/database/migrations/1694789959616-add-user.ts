import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUser1694789959616 implements MigrationInterface {
    name = "AddUser1694789959616";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE \"user\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"email\" character varying NOT NULL, \"password\" character varying NOT NULL, \"created_at\" TIMESTAMP NOT NULL DEFAULT now(), \"updated_at\" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT \"pkey_user_id\" PRIMARY KEY (\"id\"))");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE \"user\"");
    }

}
