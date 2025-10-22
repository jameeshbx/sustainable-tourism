import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { destinationId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.comment.count({
        where: { destinationId: id }
      })
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, rating } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if destination exists
    const destination = await prisma.destination.findUnique({
      where: { id: id }
    })

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Check if user has already commented on this destination
    const existingComment = await prisma.comment.findFirst({
      where: {
        destinationId: id,
        userId: session.user.id
      }
    })

    if (existingComment) {
      return NextResponse.json(
        { error: 'You have already commented on this destination' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        rating: rating ? parseInt(rating) : null,
        destinationId: id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Update destination rating if rating is provided
    if (rating) {
      const avgRating = await prisma.comment.aggregate({
        where: { destinationId: id },
        _avg: { rating: true }
      })

      await prisma.destination.update({
        where: { id: id },
        data: {
          rating: avgRating._avg.rating || 0
        }
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
