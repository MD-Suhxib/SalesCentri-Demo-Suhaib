import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedUser } from '../../../lib/authMiddleware';

const handleCreateList = async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { listData, listType, metadata } = await request.json();
    
    if (!listData || !listType) {
      return NextResponse.json({ error: 'List data and type are required' }, { status: 400 });
    }

    // Create list object
    const list = {
      id: `list_${Date.now()}`,
      userId: user.uid,
      userEmail: user.email,
      type: listType,
      data: listData,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // TODO: Store list in database
    console.log(`List created by ${user.email}:`, {
      id: list.id,
      type: listType,
      dataLength: Array.isArray(listData) ? listData.length : 'non-array'
    });

    // Simulate database storage delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      list: {
        id: list.id,
        type: list.type,
        createdAt: list.createdAt,
        itemCount: Array.isArray(listData) ? listData.length : 1
      },
      message: 'List created successfully'
    });

  } catch (error) {
    console.error('Create list error:', error);
    return NextResponse.json({ 
      error: 'Failed to create list' 
    }, { status: 500 });
  }
};

export const POST = requireAuth(handleCreateList);
