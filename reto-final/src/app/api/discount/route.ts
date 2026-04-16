import { NextRequest } from "next/server";
import { validateDiscountCode } from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return Response.json(
        { error: "Discount code is required" },
        { status: 400 }
      );
    }

    const discount = await validateDiscountCode(code);

    if (!discount) {
      return Response.json(
        { error: "Invalid or expired discount code" },
        { status: 404 }
      );
    }

    return Response.json({
      valid: true,
      code: discount.code,
      percent_off: discount.percent_off,
      description: discount.description,
    });
  } catch (error) {
    console.error("Discount validation error:", error);
    return Response.json(
      { error: "Failed to validate discount code" },
      { status: 500 }
    );
  }
}
