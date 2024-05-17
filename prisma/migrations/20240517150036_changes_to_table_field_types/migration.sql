-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "icon_name" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "incomes" ALTER COLUMN "description" DROP NOT NULL;
