import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'Delphine <orders@delphineswimwear.com>';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, order } = body;

    if (!resend) {
      console.log('📧 Email skipped - RESEND_API_KEY not configured');
      return NextResponse.json({ success: true, skipped: true });
    }

    if (!order || !order.userEmail) {
      return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
    }

    let subject = '';
    let html = '';

    const headerHtml = `
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1a1a2e; font-size: 28px; margin: 0; letter-spacing: 3px; font-weight: 300;">DELPHINE</h1>
        <p style="color: #6b7280; margin: 8px 0 0; font-size: 11px; letter-spacing: 2px;">SWIMWEAR</p>
      </div>
    `;

    const footerHtml = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">Delphine Swimwear</p>
        <p style="margin: 4px 0 0;">Tirana, Albania</p>
        <p style="margin: 8px 0 0;"><a href="https://delphineswimwear.com" style="color: #1a1a2e;">delphineswimwear.com</a></p>
      </div>
    `;

    const addressHtml = `
      <p style="margin: 0; line-height: 1.6;">
        ${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}<br>
        ${order.shippingAddress?.address || ''}<br>
        ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}<br>
        ${order.shippingAddress?.country || ''}
      </p>
    `;

    const itemsHtml = order.items?.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0; font-weight: 500;">${item.productName}</p>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">${item.variantName || ''} × ${item.quantity}</p>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `).join('') || '';

    if (type === 'confirmation') {
      subject = `Order Confirmed - ${order.orderId}`;
      html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${headerHtml}
          
          <div style="background: #d1fae5; border: 1px solid #6ee7b7; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="color: #065f46; font-size: 18px; margin: 0;">✓ Order Confirmed!</p>
          </div>
          
          <p>Hi ${order.shippingAddress?.firstName || order.userName?.split(' ')[0] || 'there'},</p>
          
          <p>Thank you for your order! We've received it and will begin processing shortly.</p>
          
          <div style="background: #f9fafb; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-weight: 600; font-size: 14px; color: #6b7280;">ORDER NUMBER</p>
            <p style="margin: 0; font-size: 24px; font-family: monospace; color: #1a1a2e; font-weight: 600;">${order.orderId}</p>
          </div>
          
          <h3 style="font-size: 14px; color: #6b7280; margin: 24px 0 12px; font-weight: 600;">ORDER DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>
          
          <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #1a1a2e;">
            <table style="width: 100%;">
              <tr><td style="padding: 4px 0; color: #6b7280;">Subtotal</td><td style="text-align: right;">${formatPrice(order.subtotal)}</td></tr>
              <tr><td style="padding: 4px 0; color: #6b7280;">Shipping</td><td style="text-align: right;">${formatPrice(order.shipping)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; font-size: 18px;">Total</td><td style="text-align: right; font-weight: 600; font-size: 18px;">${formatPrice(order.total)}</td></tr>
            </table>
          </div>
          
          <div style="margin: 24px 0;">
            <h3 style="font-size: 14px; color: #6b7280; margin: 0 0 12px; font-weight: 600;">SHIPPING TO</h3>
            <div style="background: #f9fafb; padding: 16px;">
              ${addressHtml}
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>💳 Payment on Delivery</strong><br>
              Please have <strong>${formatPrice(order.total)}</strong> ready when your order arrives.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">We'll send you another email when your order ships.</p>
          
          ${footerHtml}
        </body>
        </html>
      `;
    } else if (type === 'shipped') {
      subject = `Your Order Has Shipped - ${order.orderId}`;
      html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${headerHtml}
          
          <div style="background: #dbeafe; border: 1px solid #93c5fd; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="color: #1e40af; font-size: 18px; margin: 0;">📦 Your Order Has Shipped!</p>
          </div>
          
          <p>Hi ${order.shippingAddress?.firstName || order.userName?.split(' ')[0] || 'there'},</p>
          
          <p>Great news! Your order <strong>${order.orderId}</strong> is on its way.</p>
          
          ${order.trackingNumber ? `
            <div style="background: #f9fafb; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-weight: 600; font-size: 14px; color: #6b7280;">TRACKING NUMBER</p>
              <p style="margin: 0; font-size: 20px; font-family: monospace; color: #1a1a2e;">${order.trackingNumber}</p>
            </div>
          ` : ''}
          
          <div style="margin: 24px 0;">
            <p style="margin: 0 0 8px; font-weight: 600; font-size: 14px; color: #6b7280;">SHIPPING TO</p>
            <div style="background: #f9fafb; padding: 16px;">
              ${addressHtml}
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>💳 Payment on Delivery</strong><br>
              Total to pay: <strong>${formatPrice(order.total)}</strong>
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">If you have any questions, simply reply to this email.</p>
          
          ${footerHtml}
        </body>
        </html>
      `;
    } else if (type === 'delivered') {
      subject = `Your Order Has Been Delivered - ${order.orderId}`;
      html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${headerHtml}
          
          <div style="background: #d1fae5; border: 1px solid #6ee7b7; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="color: #065f46; font-size: 18px; margin: 0;">✓ Your Order Has Been Delivered!</p>
          </div>
          
          <p>Hi ${order.shippingAddress?.firstName || order.userName?.split(' ')[0] || 'there'},</p>
          
          <p>Your order <strong>${order.orderId}</strong> has been delivered. We hope you love your new swimwear!</p>
          
          <div style="background: #f9fafb; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 16px; font-weight: 600;">Order Summary</p>
            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
              <table style="width: 100%;">
                <tr><td style="padding: 4px 0; color: #6b7280;">Order ID</td><td style="text-align: right; font-family: monospace;">${order.orderId}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280;">Total Paid</td><td style="text-align: right; font-weight: 600;">${formatPrice(order.total)}</td></tr>
              </table>
            </div>
          </div>
          
          <p>Thank you for shopping with Delphine. We'd love to see you wearing our pieces - tag us on Instagram <strong>@delphineswimwear</strong>!</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://delphineswimwear.com/shop" style="display: inline-block; background: #1a1a2e; color: white; padding: 14px 40px; text-decoration: none; font-size: 13px; letter-spacing: 1px;">SHOP MORE</a>
          </div>
          
          ${footerHtml}
        </body>
        </html>
      `;
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.userEmail,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`📧 Email sent: ${type} to ${order.userEmail}`);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
