import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can view service provider categories' },
        { status: 401 }
      )
    }

    const serviceProvider = await prisma.user.findUnique({
      where: { 
        id,
        role: 'SERVICE_PROVIDER'
      },
      include: {
        assignedCategories: {
          include: {
            category: true,
            subcategory: true
          }
        }
      }
    })

    if (!serviceProvider) {
      return NextResponse.json(
        { error: 'Service provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serviceProvider.assignedCategories)
  } catch (error) {
    console.error('Error fetching service provider categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service provider categories' },
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
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can assign categories' },
        { status: 401 }
      )
    }

    const { categoryId, subcategoryId } = await request.json()

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Verify service provider exists
    const serviceProvider = await prisma.user.findUnique({
      where: { 
        id,
        role: 'SERVICE_PROVIDER'
      }
    })

    if (!serviceProvider) {
      return NextResponse.json(
        { error: 'Service provider not found' },
        { status: 404 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // If subcategory is provided, verify it exists and belongs to the category
    if (subcategoryId) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryId }
      })

      if (!subcategory || subcategory.categoryId !== categoryId) {
        return NextResponse.json(
          { error: 'Subcategory not found or does not belong to the specified category' },
          { status: 400 }
        )
      }
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.serviceProviderCategory.findFirst({
      where: {
        serviceProviderId: id,
        categoryId,
        subcategoryId: subcategoryId || null
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Category assignment already exists' },
        { status: 400 }
      )
    }

    // If assigning a subcategory, check if there's already a category-only assignment
    if (subcategoryId) {
      await prisma.serviceProviderCategory.findFirst({
        where: {
          serviceProviderId: id,
          categoryId,
          subcategoryId: null
        }
      })

      // If category-only assignment exists, we can proceed with subcategory assignment
      // The category-only assignment will remain for general category access
    }

    const assignment = await prisma.serviceProviderCategory.create({
      data: {
        serviceProviderId: id,
        categoryId,
        subcategoryId: subcategoryId || null
      },
      include: {
        category: true,
        subcategory: true
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error assigning category to service provider:', error)
    return NextResponse.json(
      { error: 'Failed to assign category to service provider' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Only admins can remove category assignments' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const assignmentId = searchParams.get('id')

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    // Verify the assignment exists and belongs to the service provider
    const assignment = await prisma.serviceProviderCategory.findFirst({
      where: {
        id: assignmentId,
        serviceProviderId: id
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Category assignment not found' },
        { status: 404 }
      )
    }

    await prisma.serviceProviderCategory.delete({
      where: { id: assignmentId }
    })

    return NextResponse.json({ message: 'Category assignment removed successfully' })
  } catch (error) {
    console.error('Error removing category assignment:', error)
    return NextResponse.json(
      { error: 'Failed to remove category assignment' },
      { status: 500 }
    )
  }
}
