import { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Ensure we have pgcrypto for UUID generation if needed, though Postgres 13+ has gen_random_uuid built-in
  pgm.createExtension("pgcrypto", { ifNotExists: true });

  pgm.createTable("users", {
    id: "id", // shorthand for serial primary key
    uuid: { type: "uuid", default: pgm.func("gen_random_uuid()") },
    first_name: { type: "varchar(255)", notNull: true },
    last_name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    date_of_birth: { type: "date", notNull: true },
    city: { type: "varchar(255)", notNull: true },
    country: { type: "varchar(255)", notNull: true },
    profession: { type: "varchar(255)", notNull: true },
    marital_status: { type: "varchar(255)", notNull: true },
    income_frequency: { type: "varchar(50)" },
    income_amount: { type: "integer" },
    created_at: { type: "timestamp", default: pgm.func("CURRENT_TIMESTAMP") },
    updated_at: { type: "timestamp", default: pgm.func("CURRENT_TIMESTAMP") },
  });

  pgm.createTable("otps", {
    email: { type: "varchar(255)", primaryKey: true },
    code: { type: "varchar(10)", notNull: true },
    expires_at: { type: "timestamp", notNull: true },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("otps");
  pgm.dropTable("users");
  pgm.dropExtension("pgcrypto");
}
