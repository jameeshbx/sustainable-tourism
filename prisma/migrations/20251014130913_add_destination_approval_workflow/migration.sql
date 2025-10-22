-- CreateEnum
CREATE TYPE "DestinationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "DestinationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "ServiceProviderCategory" (
    "id" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProviderCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceProviderCategory_serviceProviderId_idx" ON "ServiceProviderCategory"("serviceProviderId");

-- CreateIndex
CREATE INDEX "ServiceProviderCategory_categoryId_idx" ON "ServiceProviderCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderCategory_serviceProviderId_categoryId_subcat_key" ON "ServiceProviderCategory"("serviceProviderId", "categoryId", "subcategoryId");

-- CreateIndex
CREATE INDEX "Destination_status_idx" ON "Destination"("status");

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProviderCategory" ADD CONSTRAINT "ServiceProviderCategory_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProviderCategory" ADD CONSTRAINT "ServiceProviderCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProviderCategory" ADD CONSTRAINT "ServiceProviderCategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
