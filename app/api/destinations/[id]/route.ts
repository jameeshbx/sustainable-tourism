import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const formData = await request.formData()
    const {
      name,
      description,
      location,
      latitude,
      longitude,
      pickupLocation,
      basePrice,
      markupPercentage,
      finalPrice,
      imageUrl,
      categoryId,
      subcategoryId,
      status
    } = Object.fromEntries(formData.entries())
    
    // Ensure all string fields are properly typed
    const nameStr = typeof name === 'string' ? name : ''
    const descriptionStr = typeof description === 'string' ? description : ''
    const locationStr = typeof location === 'string' ? location : ''
    const latitudeStr = typeof latitude === 'string' ? latitude : ''
    const longitudeStr = typeof longitude === 'string' ? longitude : ''
    const pickupLocationStr = typeof pickupLocation === 'string' ? pickupLocation : ''
    const basePriceStr = typeof basePrice === 'string' ? basePrice : ''
    const markupPercentageStr = typeof markupPercentage === 'string' ? markupPercentage : ''
    const finalPriceStr = typeof finalPrice === 'string' ? finalPrice : ''
    const imageUrlStr = typeof imageUrl === 'string' ? imageUrl : ''
    const categoryIdStr = typeof categoryId === 'string' ? categoryId : ''
    const subcategoryIdStr = typeof subcategoryId === 'string' ? subcategoryId : ''
    const statusStr = typeof status === 'string' ? status : ''


    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { id }
    })

    if (!existingDestination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
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
    if (subcategoryIdStr && subcategoryIdStr !== 'none') {
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

    // Calculate final price if markup is provided
    let calculatedFinalPrice = parseFloat(finalPriceStr)
    if (markupPercentageStr && basePriceStr) {
      const base = parseFloat(basePriceStr)
      const markup = parseFloat(markupPercentageStr)
      calculatedFinalPrice = base + (base * markup / 100)
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

    try {
      const destination = await prisma.destination.update({
        where: { id },
        data: {
          name: nameStr || '',
          description: descriptionStr || '',
          location: locationStr || '',
          latitude: parseFloat(latitudeStr || '0'),
          longitude: parseFloat(longitudeStr || '0'),
          pickupLocation: pickupLocationStr || undefined,
          basePrice: parseFloat(basePriceStr || '0'),
          markupPercentage: parseFloat(markupPercentageStr || '0'),
          finalPrice: calculatedFinalPrice,
          price: calculatedFinalPrice, // Keep price field for backward compatibility
          imageUrl: imageUrlStr || undefined,
          categoryId: categoryIdStr,
          subcategoryId: subcategoryIdStr && subcategoryIdStr !== 'none' ? subcategoryIdStr : undefined,
          status: statusStr as 'PENDING' | 'APPROVED' | 'REJECTED',
          approvedById: statusStr === 'APPROVED' ? session.user.id : existingDestination.approvedById,
          approvedAt: statusStr === 'APPROVED' ? new Date() : existingDestination.approvedAt,
          rejectionReason: statusStr === 'REJECTED' ? 'Updated by admin' : undefined
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

      return NextResponse.json(destination)
    } catch (dbError) {
      console.error('Database update error:', dbError)
      return NextResponse.json(
        { error: 'Database update failed', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating destination:', error)
    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if destination exists
    const existingDestination = await prisma.destination.findUnique({
      where: { id }
    })

    if (!existingDestination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    await prisma.destination.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting destination:', error)
    return NextResponse.json(
      { error: 'Failed to delete destination' },
      { status: 500 }
    )
  }
}