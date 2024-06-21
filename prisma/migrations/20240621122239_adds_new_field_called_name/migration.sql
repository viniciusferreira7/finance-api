/*
  Warnings:

  - Added the required column `name` to the `balances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `income_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `incomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `monthly_budgets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "balances" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "income_histories" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "incomes" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "monthly_budgets" ADD COLUMN     "name" TEXT NOT NULL;
