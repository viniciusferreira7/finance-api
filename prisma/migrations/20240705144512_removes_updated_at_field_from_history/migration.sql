/*
  Warnings:

  - You are about to drop the column `update_at` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `income_histories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "update_at";

-- AlterTable
ALTER TABLE "income_histories" DROP COLUMN "update_at";
