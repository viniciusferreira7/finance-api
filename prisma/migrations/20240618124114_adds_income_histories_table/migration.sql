-- CreateTable
CREATE TABLE "income_histories" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "income_id" TEXT NOT NULL,

    CONSTRAINT "income_histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "income_histories" ADD CONSTRAINT "income_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "income_histories" ADD CONSTRAINT "income_histories_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "incomes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
