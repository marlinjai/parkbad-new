// Admin endpoint to manually revalidate opening hours
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication to prevent unauthorized revalidation
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATION_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate the opening hours cache
    revalidateTag('opening-hours');
    
    console.log('Opening hours cache manually revalidated');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Opening hours cache revalidated',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error revalidating opening hours:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
}
