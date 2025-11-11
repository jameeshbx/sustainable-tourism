-- AlterTable
ALTER TABLE "LandingPageConfig" ADD COLUMN     "experiencesCtaLink" TEXT,
ADD COLUMN     "experiencesCtaText" TEXT,
ADD COLUMN     "experiencesDescription" TEXT,
ADD COLUMN     "experiencesSubtitle" TEXT,
ADD COLUMN     "experiencesTitle" TEXT,
ADD COLUMN     "experiencesVideoThumbnail" TEXT,
ADD COLUMN     "experiencesVideoTitle" TEXT,
ADD COLUMN     "experiencesVideoUrl" TEXT;

-- CreateTable
CREATE TABLE "ExperienceActivity" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceCard" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "tourCount" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExperienceActivity_configId_idx" ON "ExperienceActivity"("configId");

-- CreateIndex
CREATE INDEX "ExperienceActivity_enabled_idx" ON "ExperienceActivity"("enabled");

-- CreateIndex
CREATE INDEX "ExperienceCard_configId_idx" ON "ExperienceCard"("configId");

-- CreateIndex
CREATE INDEX "ExperienceCard_enabled_idx" ON "ExperienceCard"("enabled");

-- AddForeignKey
ALTER TABLE "ExperienceActivity" ADD CONSTRAINT "ExperienceActivity_configId_fkey" FOREIGN KEY ("configId") REFERENCES "LandingPageConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceCard" ADD CONSTRAINT "ExperienceCard_configId_fkey" FOREIGN KEY ("configId") REFERENCES "LandingPageConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
