-- DropForeignKey
ALTER TABLE "expense_histories" DROP CONSTRAINT "expense_histories_expense_id_fkey";

-- DropForeignKey
ALTER TABLE "income_histories" DROP CONSTRAINT "income_histories_income_id_fkey";

-- AddForeignKey
ALTER TABLE "income_histories" ADD CONSTRAINT "income_histories_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "incomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_histories" ADD CONSTRAINT "expense_histories_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
