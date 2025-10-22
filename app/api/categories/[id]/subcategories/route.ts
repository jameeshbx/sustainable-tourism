import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id: categoryId } = await params
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if subcategory already exists in this category
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        name: {
          equals: nameStr,
          mode: 'insensitive'
        },
        categoryId: categoryId
      }
    })

    if (existingSubcategory) {
      return NextResponse.json(
        { error: 'Subcategory with this name already exists in this category' },
        { status: 400 }
      )
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name: nameStr,
        description: descriptionStr || null,
        categoryId: categoryId,
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

    return NextResponse.json(subcategory, { status: 201 })
  } catch (error) {
    console.error('Error creating subcategory:', error)
    return NextResponse.json(
      { error: 'Failed to create subcategory' },
      { status: 500 }
    )
  }
}