-- DropForeignKey
ALTER TABLE "public"."Destination" DROP CONSTRAINT "Destination_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Destination" ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
