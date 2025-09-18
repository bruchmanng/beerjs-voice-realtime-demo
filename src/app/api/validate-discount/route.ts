import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { discountCode } = await request.json();
    
    if (!discountCode || typeof discountCode !== 'string') {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 }
      );
    }

    // Simulate async processing with 25 second delay
    await new Promise(resolve => setTimeout(resolve, 25000));
    
    // Hardcoded logic: always return valid with 30% discount
    const response = {
      isValid: true,
      discountPercentage: 30,
      discountCode: discountCode.toUpperCase(),
      message: "Código de descuento válido",
      validatedAt: new Date().toISOString()
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Error validating discount code:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}