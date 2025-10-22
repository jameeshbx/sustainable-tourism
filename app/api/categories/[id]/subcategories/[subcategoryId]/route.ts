import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subcategoryId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: categoryId, subcategoryId } = await params
    const formData = await request.formData()
    const { name, description } = Object.fromEntries(formData.entries())
    
    // Ensure name is a string
    const nameStr = typeof name === 'string' ? name : ''
    const descriptionStr = typeof description === 'string' ? description : ''

    // Validate required fields
    if (!nameStr) {
      return NextResponse.json(
        { error: 'Subcategory name is required' },
        { status: 400 }
      )
    }

    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId }
    })

    if (!existingSubcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      )
    }

    // Check if another subcategory with the same name exists in the same category
    const duplicateSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: {
          equals: nameStr,
          mode: 'insensitive'
        },
        categoryId: categoryId,
        id: {
          not: subcategoryId
        }
      }
    })

    if (duplicateSubcategory) {
      return NextResponse.json(
        { error: 'Subcategory with this name already exists in this category' },
        { status: 400 }
      )
    }

    const subcategory = await prisma.subcategory.update({
      where: { id: subcategoryId },
      data: {
        name: nameStr,
        description: descriptionStr || null,
      },
      include: {
        category: true,
        _count: {
          select: {
            destinations: true
          }
        }
      }
    })

    return NextResponse.json(subcategory)
  } catch (error) {
    console.error('Error updating subcategory:', error)
    return NextResponse.json(
      { error: 'Failed to update subcategory' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; subcategoryId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { subcategoryId } = await params

    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: subcategoryId },
      include: {
        _count: {
          select: {
            destinations: true
          }
        }
      }
    })

    if (!existingSubcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      )
    }

    // Check if subcategory has destinations
    if (existingSubcategory._count.destinations > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subcategory with destinations. Please move or delete destinations first.' },
        { status: 400 }
      )
    }

    await prisma.subcategory.delete({
      where: { id: subcategoryId }
    })

    return NextResponse.json({
      success: true,
      message: 'Subcategory deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    return NextResponse.json(
      { error: 'Failed to delete subcategory' },
      { status: 500 }
    )
  }
}
