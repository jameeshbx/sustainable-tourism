import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { CategoryType } from '@prisma/client'

const VALID_CATEGORY_TYPES: CategoryType[] = ['DESTINATION', 'ACTIVITY', 'BUYLOCAL']

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: {
            name: 'asc'
          }
        },
        _count: {
          select: {
            destinations: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const { name, description, type } = Object.fromEntries(formData.entries())
    
    // Ensure name is a string
    const nameStr = typeof name === 'string' ? name : ''
    const descriptionStr = typeof description === 'string' ? description : ''
    const typeStr = typeof type === 'string' ? type : ''

    // Validate required fields
    if (!nameStr) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    if (!typeStr || !VALID_CATEGORY_TYPES.includes(typeStr as CategoryType)) {
      return NextResponse.json(
        { error: 'Category type is required and must be DESTINATION, ACTIVITY, or BUYLOCAL' },
        { status: 400 }
      )
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: nameStr,
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: nameStr,
        description: descriptionStr || null,
        type: typeStr as CategoryType,
      },
      include: {
        subcategories: true,
        _count: {
          select: {
            destinations: true
          }
        }
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
