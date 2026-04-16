import { NextRequest } from "next/server";
import {
  createOrder,
  generateOrderNumber,
  validateDiscountCode,
} from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, items, paymentMethod, discountCode } =
      body;

    // Validate required fields
    if (!customerName || !customerEmail || !items?.length || !paymentMethod) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Validate discount if provided
    let discountPercent = 0;
    if (discountCode) {
      const discount = await validateDiscountCode(discountCode);
      if (discount) {
        discountPercent = discount.percent_off;
      }
    }

    // Calculate total
    const discountAmount = subtotal * (discountPercent / 100);
    const total = Math.round((subtotal - discountAmount) * 100) / 100;

    const orderNumber = generateOrderNumber();

    // Save to Supabase
    await createOrder({
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      items,
      subtotal,
      discount_code: discountCode || null,
      discount_percent: discountPercent,
      total,
      payment_method: paymentMethod,
      status: "confirmed",
    });

    // Fire Make.com webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items,
          subtotal,
          discountCode: discountCode || null,
          discountPercent,
          total,
          paymentMethod,
          orderNumber,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    return Response.json({
      success: true,
      orderNumber,
      total,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
