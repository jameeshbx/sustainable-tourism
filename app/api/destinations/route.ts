import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const subcategoryId = searchParams.get('subcategoryId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    
    // Only show approved destinations to public users
    if (!session?.user || session.user.role === 'USER') {
      where.status = 'APPROVED'
    }
    
    // Admins can filter by status
    if (session?.user?.role === 'ADMIN' && status) {
      where.status = status
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (subcategoryId) {
      where.subcategoryId = subcategoryId
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
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
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.destination.count({ where })
    ])

    return NextResponse.json({
      destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin or service provider
    if (!['ADMIN', 'SERVICE_PROVIDER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and service providers can create destinations' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const {
      name,
      description,
      location,
      latitude,
      longitude,
      pickupLocation,
      price,
      imageUrl,
      categoryId,
      subcategoryId
    } = Object.fromEntries(formData.entries())
    
    // Ensure all string fields are properly typed
    const nameStr = typeof name === 'string' ? name : ''
    const descriptionStr = typeof description === 'string' ? description : ''
    const locationStr = typeof location === 'string' ? location : ''
    const latitudeStr = typeof latitude === 'string' ? latitude : ''
    const longitudeStr = typeof longitude === 'string' ? longitude : ''
    const pickupLocationStr = typeof pickupLocation === 'string' ? pickupLocation : ''
    const priceStr = typeof price === 'string' ? price : ''
    const imageUrlStr = typeof imageUrl === 'string' ? imageUrl : ''
    const categoryIdStr = typeof categoryId === 'string' ? categoryId : ''
    const subcategoryIdStr = typeof subcategoryId === 'string' ? subcategoryId : ''

    // For service providers, check if they have permission for the selected category/subcategory
    if (session.user.role === 'SERVICE_PROVIDER') {
      const hasPermission = await prisma.serviceProviderCategory.findFirst({
        where: {
          serviceProviderId: session.user.id,
          categoryId: categoryIdStr,
          subcategoryId: subcategoryIdStr || null
        }
      })

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'You do not have permission to create destinations in this category/subcategory' },
          { status: 403 }
        )
      }
    }

    // Get all form data including dynamic fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _allFormData = Object.fromEntries(formData.entries())
    
    // Separate file uploads from other data
    const fileUploads: { [key: string]: File } = {}
    const otherData: { [key: string]: string } = {}
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileUploads[key] = value
      } else {
        otherData[key] = value as string
      }
    }

    // Get the category's form fields to validate required fields
    const categoryFormFields = await prisma.formField.findMany({
      where: { categoryId: categoryIdStr },
      orderBy: { order: 'asc' }
    })

    // Validate required fields based on form configuration
    const requiredFields = categoryFormFields.filter(field => field.required)
    const missingFields = requiredFields.filter(field => {
      const value = otherData[field.name]
      return !value || value.trim() === ''
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.map(f => f.label).join(', ')}` },
        { status: 400 }
      )
    }

    // Handle image uploads
    const uploadedImages: { [key: string]: string } = {}
    
    for (const [fieldName, file] of Object.entries(fileUploads)) {
      if (file.type.startsWith('image/')) {
        try {
          // Upload file to S3 or your preferred storage
          const uploadResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/upload`, {
            method: 'POST',
            body: (() => {
              const uploadFormData = new FormData()
              uploadFormData.append('file', file)
              return uploadFormData
            })()
          })
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            uploadedImages[fieldName] = uploadData.url
          } else {
            console.error(`Failed to upload ${fieldName}:`, await uploadResponse.text())
          }
        } catch (error) {
          console.error(`Error uploading ${fieldName}:`, error)
        }
      }
    }

    // Validate imageUrl if provided
    if (imageUrlStr && imageUrlStr.trim()) {
      try {
        new URL(imageUrlStr.trim())
      } catch {
        return NextResponse.json(
          { error: 'Invalid image URL format' },
          { status: 400 }
        )
      }
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryIdStr }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Verify subcategory if provided
    let subcategory = null
    if (subcategoryIdStr) {
      subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryIdStr }
      })

      if (!subcategory || subcategory.categoryId !== categoryIdStr) {
        return NextResponse.json(
          { error: 'Invalid subcategory' },
          { status: 400 }
        )
      }
    }

    // Prepare additional data from dynamic fields
    const additionalData: { [key: string]: string } = {}
    
    // Add uploaded images
    Object.entries(uploadedImages).forEach(([fieldName, url]) => {
      additionalData[fieldName] = url
    })
    
    // Add other dynamic field data
    Object.entries(otherData).forEach(([key, value]) => {
      // Skip standard fields that are already handled
      const standardFields = ['name', 'description', 'location', 'latitude', 'longitude', 'pickupLocation', 'price', 'imageUrl', 'categoryId', 'subcategoryId']
      if (!standardFields.includes(key) && value && value.trim()) {
        additionalData[key] = value
      }
    })

    // Extract standard fields from form data
    const standardFields = {
      name: nameStr || '',
      description: descriptionStr || '',
      location: locationStr || '',
      latitude: parseFloat(latitudeStr || '0'),
      longitude: parseFloat(longitudeStr || '0'),
      pickupLocation: pickupLocationStr || '',
      price: parseFloat(priceStr || '0'),
      imageUrl: imageUrlStr || undefined,
    }

    const destination = await prisma.destination.create({
      data: {
        ...standardFields,
        categoryId: categoryIdStr,
        subcategoryId: subcategoryIdStr || undefined,
        createdById: session.user.id,
        status: session.user.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        approvedById: session.user.role === 'ADMIN' ? session.user.id : undefined,
        approvedAt: session.user.role === 'ADMIN' ? new Date() : undefined,
        customFields: Object.keys(additionalData).length > 0 ? additionalData : undefined
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
        }
      }
    })

    return NextResponse.json(destination, { status: 201 })
  } catch (error) {
    console.error('Error creating destination:', error)
    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    )
  }
}
