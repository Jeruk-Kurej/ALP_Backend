/*
  Warnings:

  - You are about to drop the column `toko_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `toko` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_toko_id_fkey";

-- DropIndex
DROP INDEX "user_toko_id_idx";

-- AlterTable
ALTER TABLE "toko" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "toko_id";

-- CreateIndex
CREATE INDEX "toko_owner_id_idx" ON "toko"("owner_id");

-- AddForeignKey
ALTER TABLE "toko" ADD CONSTRAINT "toko_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
