-- DropForeignKey
ALTER TABLE "expense_histories" DROP CONSTRAINT "expense_histories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_category_id_fkey";

-- DropForeignKey
ALTER TABLE "income_histories" DROP CONSTRAINT "income_histories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "incomes" DROP CONSTRAINT "incomes_category_id_fkey";

-- AlterTable
ALTER TABLE "expense_histories" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "income_histories" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "incomes" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_histories" ADD CONSTRAINT "income_histories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_histories" ADD CONSTRAINT "expense_histories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
