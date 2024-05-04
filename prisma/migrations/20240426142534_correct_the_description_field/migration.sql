/*
  Warnings:

  - You are about to drop the column `desciption` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `desciption` on the `incomes` table. All the data in the column will be lost.
  - Added the required column `description` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `incomes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expenses" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "incomes" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT NOT NULL;
