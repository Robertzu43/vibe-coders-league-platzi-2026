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
    const itemsHtml = items.map((item: { name: string; variant?: string; quantity: number; price: number }, index: number) => `
      <tr>
        <td style="padding:16px 20px;${index > 0 ? 'border-top:1px solid #2A2A2A;' : ''}">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:40px;vertical-align:top;">
                <div style="width:36px;height:36px;background:linear-gradient(135deg, #0AE88A 0%, #05824D 100%);border-radius:10px;text-align:center;line-height:36px;font-size:16px;color:#141414;font-weight:bold;">${item.quantity}</div>
              </td>
              <td style="padding-left:14px;vertical-align:top;">
                <p style="margin:0;color:#F7FAF7;font-size:15px;font-weight:600;">${item.name}</p>
                ${item.variant ? `<p style="margin:3px 0 0;color:#0AE88A;font-size:12px;letter-spacing:0.5px;">✦ ${item.variant}</p>` : ''}
              </td>
              <td style="text-align:right;vertical-align:top;padding-left:20px;">
                <p style="margin:0;color:#0AE88A;font-size:16px;font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</p>
                ${item.quantity > 1 ? `<p style="margin:2px 0 0;color:#919996;font-size:11px;">$${item.price.toFixed(2)} c/u</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>`).join('')

    const paymentLabels: Record<string, string> = {
      credit_card: '💳 Tarjeta de Crédito',
      paypal: '🅿️ PayPal',
      platzi_credits: '💚 Platzi Credits',
    }

    const date = new Date()
    const dateStr = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

    const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0F0F0F;font-family:'Helvetica Neue',Arial,sans-serif;">

<!-- Outer wrapper with pattern background -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F0F0F;">
<tr><td align="center" style="padding:40px 20px;">

<!-- Main card -->
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#141414;border-radius:20px;overflow:hidden;border:1px solid #1E1E1E;">

  <!-- Header with gradient -->
  <tr>
    <td style="background:linear-gradient(135deg, #0AE88A 0%, #08B56B 50%, #05824D 100%);padding:35px 30px;text-align:center;">
      <h1 style="margin:0;color:#141414;font-size:28px;font-weight:800;letter-spacing:-0.5px;">🛍️ PLATZI STORE</h1>
      <p style="margin:8px 0 0;color:#141414;font-size:13px;opacity:0.7;letter-spacing:1px;">CONFIRMACIÓN DE PEDIDO</p>
    </td>
  </tr>

  <!-- Success badge -->
  <tr>
    <td style="padding:30px 30px 0;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td style="background:#0AE88A15;border:1px solid #0AE88A30;border-radius:50px;padding:10px 24px;">
            <span style="color:#0AE88A;font-size:14px;font-weight:600;">✅ Pedido Confirmado</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:25px 30px 10px;text-align:center;">
      <h2 style="margin:0;color:#F7FAF7;font-size:22px;font-weight:700;">¡Gracias, ${customerName}!</h2>
      <p style="margin:8px 0 0;color:#919996;font-size:14px;line-height:1.5;">Tu pedido ha sido procesado exitosamente.</p>
    </td>
  </tr>

  <!-- Order number card -->
  <tr>
    <td style="padding:15px 30px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1C1C1C;border-radius:14px;border:1px solid #2A2A2A;">
        <tr>
          <td style="padding:16px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td><p style="margin:0;color:#919996;font-size:12px;letter-spacing:0.5px;">NÚMERO DE PEDIDO</p></td>
                <td><p style="margin:0;color:#919996;font-size:12px;letter-spacing:0.5px;text-align:right;">FECHA</p></td>
              </tr>
              <tr>
                <td><p style="margin:4px 0 0;color:#0AE88A;font-size:16px;font-weight:700;font-family:monospace;">${orderNumber}</p></td>
                <td><p style="margin:4px 0 0;color:#F7FAF7;font-size:14px;text-align:right;">${dateStr}</p></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Products section -->
  <tr>
    <td style="padding:10px 30px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1C1C1C;border-radius:14px;border:1px solid #2A2A2A;">
        <tr>
          <td style="padding:20px 0 5px 20px;">
            <p style="margin:0;color:#F7FAF7;font-size:14px;font-weight:700;letter-spacing:0.5px;">📦 PRODUCTOS</p>
          </td>
        </tr>
        ${itemsHtml}
      </table>
    </td>
  </tr>

  <!-- Totals section -->
  <tr>
    <td style="padding:10px 30px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1C1C1C;border-radius:14px;border:1px solid #2A2A2A;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:6px 0;color:#919996;font-size:14px;">Subtotal</td>
                <td style="padding:6px 0;color:#F7FAF7;font-size:14px;text-align:right;">$${subtotal.toFixed(2)}</td>
              </tr>
              ${discountPercent > 0 ? `<tr>
                <td style="padding:6px 0;color:#0AE88A;font-size:14px;">🏷️ Descuento (-${discountPercent}%)</td>
                <td style="padding:6px 0;color:#0AE88A;font-size:14px;text-align:right;font-weight:600;">-$${discountAmount.toFixed(2)}</td>
              </tr>` : ''}
              <tr><td colspan="2" style="padding:8px 0;"><div style="border-top:2px solid #0AE88A30;"></div></td></tr>
              <tr>
                <td style="padding:6px 0;color:#F7FAF7;font-size:20px;font-weight:800;">Total</td>
                <td style="padding:6px 0;color:#0AE88A;font-size:20px;font-weight:800;text-align:right;">$${total.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:10px 0 0;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background:#0AE88A15;border:1px solid #0AE88A30;border-radius:8px;padding:8px 14px;">
                        <span style="color:#0AE88A;font-size:13px;">${paymentLabels[paymentMethod] || paymentMethod}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Shipping notice -->
  <tr>
    <td style="padding:15px 30px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0AE88A10;border:1px solid #0AE88A20;border-radius:14px;">
        <tr>
          <td style="padding:18px 20px;text-align:center;">
            <p style="margin:0;color:#0AE88A;font-size:14px;">🚚 Recibirás un email con el tracking cuando tu pedido sea enviado</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:25px 30px 35px;text-align:center;border-top:1px solid #1E1E1E;">
      <p style="margin:0;color:#0AE88A;font-size:20px;font-weight:800;">Nunca Pares de Aprender 💚</p>
      <p style="margin:8px 0 0;color:#919996;font-size:13px;">Aprender es el nuevo estilo.</p>
      <p style="margin:15px 0 0;color:#3A3A3A;font-size:11px;">© 2026 Platzi Store — reto-final.vercel.app</p>
    </td>
  </tr>

</table>
<!-- End main card -->

</td></tr>
</table>

</body>
</html>`

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
