import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }

    // Check if user already liked this destination
    const existingLike = await prisma.like.findUnique({
      where: {
        destinationId_userId: {
          destinationId: id,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      // User already liked, so unlike it
      await prisma.like.delete({
        where: {
          destinationId_userId: {
            destinationId: id,
            userId: session.user.id,
          },
        },
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { destinationId: id },
      });

      return NextResponse.json({ 
        success: true, 
        likeCount,
        liked: false 
      });
    }

    // Create like
    await prisma.like.create({
      data: {
        destinationId: id,
        userId: session.user.id,
      },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { destinationId: id },
    });

    return NextResponse.json({ 
      success: true, 
      likeCount,
      liked: true 
    });
  } catch (error) {
    console.error("Error liking destination:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        destinationId_userId: {
          destinationId: id,
          userId: session.user.id,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json({ error: "Not liked" }, { status: 400 });
    }

    // Delete like
    await prisma.like.delete({
      where: {
        destinationId_userId: {
          destinationId: id,
          userId: session.user.id,
        },
      },
    });

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { destinationId: id },
    });

    return NextResponse.json({ 
      success: true, 
      likeCount,
      liked: false 
    });
  } catch (error) {
    console.error("Error unliking destination:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
