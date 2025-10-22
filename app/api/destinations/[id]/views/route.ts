import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    // Get views with user information
    const views = await prisma.view.findMany({
      where: { destinationId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Get total count
    const totalCount = await prisma.view.count({
      where: { destinationId: id },
    });

    return NextResponse.json({
      success: true,
      views,
      totalCount,
      hasMore: skip + limit < totalCount,
    });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
