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
    const itemsHtml = items.map((item: { name: string; variant?: string; quantity: number; price: number }, i: number) =>
      `<tr><td style="padding:10px 16px;${i > 0 ? 'border-top:1px solid #2A2A2A;' : ''}color:#F7FAF7;font-size:14px;">${item.quantity}x ${item.name}${item.variant ? ` <span style="color:#0AE88A;">(${item.variant})</span>` : ''}</td><td style="padding:10px 16px;${i > 0 ? 'border-top:1px solid #2A2A2A;' : ''}color:#0AE88A;font-size:14px;font-weight:700;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td></tr>`
    ).join('')

    const paymentLabels: Record<string, string> = { credit_card: '💳 Tarjeta de Crédito', paypal: '🅿️ PayPal', platzi_credits: '💚 Platzi Credits' }

    const emailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0F0F0F;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F0F;"><tr><td align="center" style="padding:30px 16px;">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#141414;border-radius:16px;overflow:hidden;border:1px solid #1E1E1E;">
<tr><td style="background:linear-gradient(135deg,#0AE88A,#05824D);padding:24px;text-align:center;">
  <h1 style="margin:0;color:#141414;font-size:22px;font-weight:800;">🛍️ PLATZI STORE</h1>
  <p style="margin:4px 0 0;color:#141414;font-size:11px;opacity:0.7;letter-spacing:1px;">CONFIRMACIÓN DE PEDIDO</p>
</td></tr>
<tr><td style="padding:20px 24px 8px;text-align:center;">
  <p style="margin:0;color:#0AE88A;font-size:13px;font-weight:600;">✅ Pedido Confirmado</p>
  <h2 style="margin:8px 0 0;color:#F7FAF7;font-size:18px;">¡Gracias, ${customerName}!</h2>
</td></tr>
<tr><td style="padding:8px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1C1C;border-radius:10px;">
    <tr><td style="padding:12px 16px;color:#919996;font-size:11px;">PEDIDO</td><td style="padding:12px 16px;color:#919996;font-size:11px;text-align:right;">FECHA</td></tr>
    <tr><td style="padding:0 16px 12px;color:#0AE88A;font-size:13px;font-weight:700;font-family:monospace;">${orderNumber}</td><td style="padding:0 16px 12px;color:#F7FAF7;font-size:12px;text-align:right;">${new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</td></tr>
  </table>
</td></tr>
<tr><td style="padding:8px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1C1C;border-radius:10px;">
    <tr><td colspan="2" style="padding:12px 16px 6px;color:#F7FAF7;font-size:12px;font-weight:700;">📦 PRODUCTOS</td></tr>
    ${itemsHtml}
  </table>
</td></tr>
<tr><td style="padding:8px 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1C1C;border-radius:10px;">
    <tr><td style="padding:12px 16px;color:#919996;font-size:13px;">Subtotal</td><td style="padding:12px 16px;color:#F7FAF7;font-size:13px;text-align:right;">$${subtotal.toFixed(2)}</td></tr>
    ${discountPercent > 0 ? `<tr><td style="padding:4px 16px;color:#0AE88A;font-size:13px;">🏷️ Descuento (-${discountPercent}%)</td><td style="padding:4px 16px;color:#0AE88A;font-size:13px;text-align:right;">-$${discountAmount.toFixed(2)}</td></tr>` : ''}
    <tr><td colspan="2" style="padding:4px 16px;"><div style="border-top:1px solid #0AE88A30;"></div></td></tr>
    <tr><td style="padding:8px 16px 12px;color:#F7FAF7;font-size:18px;font-weight:800;">Total</td><td style="padding:8px 16px 12px;color:#0AE88A;font-size:18px;font-weight:800;text-align:right;">$${total.toFixed(2)}</td></tr>
    <tr><td colspan="2" style="padding:0 16px 12px;color:#919996;font-size:12px;">${paymentLabels[paymentMethod] || paymentMethod}</td></tr>
  </table>
</td></tr>
<tr><td style="padding:12px 24px;text-align:center;">
  <p style="margin:0;color:#0AE88A;font-size:12px;">🚚 Recibirás tracking por email cuando sea enviado</p>
</td></tr>
<tr><td style="padding:16px 24px 20px;text-align:center;border-top:1px solid #1E1E1E;">
  <p style="margin:0;color:#0AE88A;font-size:16px;font-weight:800;">Nunca Pares de Aprender 💚</p>
  <p style="margin:4px 0 0;color:#919996;font-size:11px;">Aprender es el nuevo estilo. — reto-final.vercel.app</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`

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
