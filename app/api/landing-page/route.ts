import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch landing page configuration
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get("section") || "hero";

    const config = await prisma.landingPageConfig.findUnique({
      where: { section },
      include: {
        heroCards: {
          where: { enabled: true },
          orderBy: { order: "asc" },
        },
        experienceActivities: {
          where: { enabled: true },
          orderBy: { order: "asc" },
        },
        experienceCards: {
          where: { enabled: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!config) {
      return NextResponse.json({
        section,
        heroBackgroundImage: null,
        heroHeadline: null,
        heroSubtext: null,
        heroCtaText: null,
        heroCtaLink: null,
        heroCards: [],
        experiencesTitle: null,
        experiencesSubtitle: null,
        experiencesDescription: null,
        experiencesVideoUrl: null,
        experiencesVideoThumbnail: null,
        experiencesVideoTitle: null,
        experiencesCtaText: null,
        experiencesCtaLink: null,
        experienceActivities: [],
        experienceCards: [],
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching landing page config:", error);
    return NextResponse.json(
      { error: "Failed to fetch landing page configuration" },
      { status: 500 }
    );
  }
}

// POST/PUT - Create or update landing page configuration
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      section = "hero",
      heroBackgroundImage,
      heroHeadline,
      heroSubtext,
      heroCtaText,
      heroCtaLink,
      heroCards = [],
      experiencesTitle,
      experiencesSubtitle,
      experiencesDescription,
      experiencesVideoUrl,
      experiencesVideoThumbnail,
      experiencesVideoTitle,
      experiencesCtaText,
      experiencesCtaLink,
      experienceActivities = [],
      experienceCards = [],
    } = body;

    // Build update object - only include fields that are explicitly provided
    const updateData: any = {};
    
    // Hero section fields - only update if provided
    if (heroBackgroundImage !== undefined) updateData.heroBackgroundImage = heroBackgroundImage;
    if (heroHeadline !== undefined) updateData.heroHeadline = heroHeadline;
    if (heroSubtext !== undefined) updateData.heroSubtext = heroSubtext;
    if (heroCtaText !== undefined) updateData.heroCtaText = heroCtaText;
    if (heroCtaLink !== undefined) updateData.heroCtaLink = heroCtaLink;
    
    // Experiences section fields - only update if provided
    if (experiencesTitle !== undefined) updateData.experiencesTitle = experiencesTitle;
    if (experiencesSubtitle !== undefined) updateData.experiencesSubtitle = experiencesSubtitle;
    if (experiencesDescription !== undefined) updateData.experiencesDescription = experiencesDescription;
    if (experiencesVideoUrl !== undefined) updateData.experiencesVideoUrl = experiencesVideoUrl;
    if (experiencesVideoThumbnail !== undefined) updateData.experiencesVideoThumbnail = experiencesVideoThumbnail;
    if (experiencesVideoTitle !== undefined) updateData.experiencesVideoTitle = experiencesVideoTitle;
    if (experiencesCtaText !== undefined) updateData.experiencesCtaText = experiencesCtaText;
    if (experiencesCtaLink !== undefined) updateData.experiencesCtaLink = experiencesCtaLink;

    // Build create object with defaults
    const createData: any = {
      section,
      heroBackgroundImage: heroBackgroundImage || null,
      heroHeadline: heroHeadline || null,
      heroSubtext: heroSubtext || null,
      heroCtaText: heroCtaText || null,
      heroCtaLink: heroCtaLink || null,
      experiencesTitle: experiencesTitle || null,
      experiencesSubtitle: experiencesSubtitle || null,
      experiencesDescription: experiencesDescription || null,
      experiencesVideoUrl: experiencesVideoUrl || null,
      experiencesVideoThumbnail: experiencesVideoThumbnail || null,
      experiencesVideoTitle: experiencesVideoTitle || null,
      experiencesCtaText: experiencesCtaText || null,
      experiencesCtaLink: experiencesCtaLink || null,
    };

    // Upsert the config - only update provided fields
    const config = await prisma.landingPageConfig.upsert({
      where: { section },
      update: updateData,
      create: createData,
    });

    // Handle hero cards - only if provided and section is hero
    if (section === "hero" && Array.isArray(heroCards)) {
      await prisma.heroCard.deleteMany({
        where: { configId: config.id },
      });
      if (heroCards.length > 0) {
        await prisma.heroCard.createMany({
          data: heroCards.map((card: any, index: number) => ({
            configId: config.id,
            image: card.image || "",
            title: card.title || "",
            subtitle: card.subtitle || null,
            navigationLink: card.navigationLink || null,
            enabled: card.enabled !== undefined ? card.enabled : true,
            order: card.order !== undefined ? card.order : index,
          })),
        });
      }
    }

    // Handle experience activities - only if provided and section is experiences
    if (section === "experiences" && Array.isArray(experienceActivities)) {
      await prisma.experienceActivity.deleteMany({
        where: { configId: config.id },
      });
      if (experienceActivities.length > 0) {
        await prisma.experienceActivity.createMany({
          data: experienceActivities.map((activity: any, index: number) => ({
            configId: config.id,
            name: activity.name || "",
            enabled: activity.enabled !== undefined ? activity.enabled : true,
            order: activity.order !== undefined ? activity.order : index,
          })),
        });
      }
    }

    // Handle experience cards - only if provided and section is experiences
    if (section === "experiences" && Array.isArray(experienceCards)) {
      await prisma.experienceCard.deleteMany({
        where: { configId: config.id },
      });
      if (experienceCards.length > 0) {
        await prisma.experienceCard.createMany({
          data: experienceCards.map((card: any, index: number) => ({
            configId: config.id,
            title: card.title || "",
            image: card.image || "",
            isNew: card.isNew !== undefined ? card.isNew : false,
            tourCount: card.tourCount || null,
            enabled: card.enabled !== undefined ? card.enabled : true,
            order: card.order !== undefined ? card.order : index,
          })),
        });
      }
    }

    // Fetch updated config with all related data
    const updatedConfig = await prisma.landingPageConfig.findUnique({
      where: { id: config.id },
      include: {
        heroCards: {
          orderBy: { order: "asc" },
        },
        experienceActivities: {
          orderBy: { order: "asc" },
        },
        experienceCards: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error("Error saving landing page config:", error);
    return NextResponse.json(
      { error: "Failed to save landing page configuration" },
      { status: 500 }
    );
  }
}

// PUT - Update landing page configuration
export async function PUT(request: NextRequest) {
  return POST(request); // Same logic as POST
}

