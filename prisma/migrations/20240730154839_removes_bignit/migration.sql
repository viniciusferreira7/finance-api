/*
  Warnings:

  - You are about to alter the column `value` on the `incomes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "incomes" ALTER COLUMN "value" SET DATA TYPE INTEGER;
