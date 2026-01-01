import { NextResponse } from "next/server";
import { getAllPricing } from "@/app/lib/pricingRepo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Public API - fetch pricing from Firestore
    const { data, updatedAt } = await getAllPricing();
    return NextResponse.json({ data, updatedAt });
  } catch (error: any) {
    console.error('Get pricing error:', error);
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? `Failed to read pricing data: ${error?.message ?? String(error)}` 
          : "Failed to read pricing data." 
      },
      { status: 500 }
    );
  }
}


