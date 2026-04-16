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

    // Build items HTML for email
    const itemsHtml = items.map((item: { name: string; variant?: string; quantity: number; price: number }) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#F7FAF7;font-size:14px;">${item.name}${item.variant ? ` <span style="color:#919996;">(${item.variant})</span>` : ''}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#919996;text-align:center;font-size:14px;">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2A2A2A;color:#0AE88A;text-align:right;font-size:14px;font-weight:bold;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`).join('')

    const paymentLabels: Record<string, string> = {
      credit_card: 'Tarjeta de Crédito',
      paypal: 'PayPal',
      platzi_credits: 'Platzi Credits',
    }

    const emailHtml = `<div style="background:#141414;padding:40px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#1C1C1C;border-radius:16px;overflow:hidden;">
    <div style="background:#0AE88A;padding:20px;text-align:center;">
      <h1 style="color:#141414;margin:0;font-size:24px;">🛍️ Platzi Store</h1>
    </div>
    <div style="padding:30px;">
      <h2 style="color:#F7FAF7;margin-top:0;">¡Gracias por tu compra, ${customerName}!</h2>
      <p style="color:#919996;">Tu pedido <strong style="color:#0AE88A;">#${orderNumber}</strong> ha sido confirmado.</p>
      <div style="background:#141414;border-radius:12px;padding:20px;margin:20px 0;">
        <h3 style="color:#0AE88A;margin-top:0;">Tu Pedido</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <th style="text-align:left;color:#919996;font-size:12px;padding-bottom:8px;border-bottom:1px solid #2A2A2A;">Producto</th>
            <th style="text-align:center;color:#919996;font-size:12px;padding-bottom:8px;border-bottom:1px solid #2A2A2A;">Cant.</th>
            <th style="text-align:right;color:#919996;font-size:12px;padding-bottom:8px;border-bottom:1px solid #2A2A2A;">Precio</th>
          </tr>
          ${itemsHtml}
        </table>
      </div>
      <div style="background:#141414;border-radius:12px;padding:20px;margin:20px 0;">
        <table style="width:100%;">
          <tr><td style="color:#919996;padding:4px 0;">Subtotal</td><td style="color:#F7FAF7;text-align:right;">$${subtotal.toFixed(2)}</td></tr>
          ${discountPercent > 0 ? `<tr><td style="color:#0AE88A;padding:4px 0;">Descuento (-${discountPercent}%)</td><td style="color:#0AE88A;text-align:right;">-$${discountAmount.toFixed(2)}</td></tr>` : ''}
          <tr><td colspan="2" style="border-top:1px solid #2A2A2A;padding-top:10px;"></td></tr>
          <tr><td style="color:#F7FAF7;font-weight:bold;font-size:18px;">Total</td><td style="color:#0AE88A;font-weight:bold;font-size:18px;text-align:right;">$${total.toFixed(2)}</td></tr>
        </table>
        <p style="color:#919996;font-size:13px;margin-top:10px;">Método de pago: ${paymentLabels[paymentMethod] || paymentMethod}</p>
      </div>
      <p style="color:#919996;font-size:14px;">Recibirás un email con el tracking cuando tu pedido sea enviado.</p>
      <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #2A2A2A;">
        <p style="color:#0AE88A;font-size:18px;font-weight:bold;">Nunca Pares de Aprender 💚</p>
        <p style="color:#919996;font-size:12px;">Platzi Store — Aprender es el nuevo estilo.</p>
      </div>
    </div>
  </div>
</div>`

    // Fire Make.com webhook
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          emailHtml,
          subtotal,
          total,
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
