import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can approve/reject destinations' },
        { status: 401 }
      )
    }

    const { action, rejectionReason } = await request.json()
    
    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be APPROVE or REJECT' },
        { status: 400 }
      )
    }

    if (action === 'REJECT' && !rejectionReason?.trim()) {
      return NextResponse.json(
        { error: 'Rejection reason is required when rejecting a destination' },
        { status: 400 }
      )
    }

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    if (destination.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Destination is not in pending status' },
        { status: 400 }
      )
    }

    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        approvedById: session.user.id,
        approvedAt: new Date(),
        rejectionReason: action === 'REJECT' ? rejectionReason : null
      },
      include: {
        category: true,
        subcategory: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedDestination)
  } catch (error) {
    console.error('Error updating destination status:', error)
    return NextResponse.json(
      { error: 'Failed to update destination status' },
      { status: 500 }
    )
  }
}
