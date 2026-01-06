-- AlterTable: Add owner_id column as nullable first
ALTER TABLE "category" ADD COLUMN "owner_id" INTEGER;

-- Set default owner_id to the first user for existing categories
UPDATE "category" SET "owner_id" = (SELECT id FROM "user" ORDER BY id LIMIT 1);

-- Make owner_id NOT NULL
ALTER TABLE "category" ALTER COLUMN "owner_id" SET NOT NULL;

-- DropIndex: Remove old unique constraint on name
DROP INDEX "category_name_key";

-- CreateIndex: Add new unique constraint on name and owner_id
CREATE UNIQUE INDEX "category_name_owner_id_key" ON "category"("name", "owner_id");

-- CreateIndex: Add index on owner_id
CREATE INDEX "category_owner_id_idx" ON "category"("owner_id");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
