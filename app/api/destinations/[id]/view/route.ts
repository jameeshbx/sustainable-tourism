import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    // Check if user already viewed this destination recently (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentView = await prisma.view.findFirst({
      where: {
        destinationId: id,
        OR: [
          session?.user ? { userId: session.user.id } : { ipAddress },
        ],
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (recentView) {
      return NextResponse.json({ 
        success: true, 
        viewCount: destination.viewCount,
        alreadyViewed: true 
      });
    }

    // Create view record
    await prisma.view.create({
      data: {
        destinationId: id,
        userId: session?.user?.id || null,
        ipAddress: session?.user ? null : ipAddress,
        userAgent: session?.user ? null : userAgent,
      },
    });

    // Update destination view count
    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      viewCount: updatedDestination.viewCount,
      alreadyViewed: false 
    });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
