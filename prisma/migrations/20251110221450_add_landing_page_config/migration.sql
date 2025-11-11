-- CreateTable
CREATE TABLE "LandingPageConfig" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "heroBackgroundImage" TEXT,
    "heroHeadline" TEXT,
    "heroSubtext" TEXT,
    "heroCtaText" TEXT,
    "heroCtaLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPageConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroCard" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "navigationLink" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingPageConfig_section_key" ON "LandingPageConfig"("section");

-- CreateIndex
CREATE INDEX "LandingPageConfig_section_idx" ON "LandingPageConfig"("section");

-- CreateIndex
CREATE INDEX "HeroCard_configId_idx" ON "HeroCard"("configId");

-- CreateIndex
CREATE INDEX "HeroCard_enabled_idx" ON "HeroCard"("enabled");

-- AddForeignKey
ALTER TABLE "HeroCard" ADD CONSTRAINT "HeroCard_configId_fkey" FOREIGN KEY ("configId") REFERENCES "LandingPageConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
