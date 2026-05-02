'use server';

import sgMail from '@sendgrid/mail';

import { Order } from '@/lib/orders';

/**
 * Server-side Email Actions using Twilio SendGrid
 */

// Initialize SendGrid with API Key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendOrderConfirmationAction(order: Order) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is missing from environment variables.');
    return { success: false, error: 'Email configuration missing' };
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'support@gloyas.com';
  const { id, total_amount, shipping_address, order_items } = order;
  const orderId = id.substring(0, 8).toUpperCase();
  
  const itemsHtml = order_items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #EEEEEE;">
        <div style="font-weight: bold; color: #111111;">${item.name}</div>
        <div style="font-size: 11px; color: #666666;">${item.size} / ${item.color}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #EEEEEE; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #EEEEEE; text-align: right;">₹${item.price}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #EEEEEE;">
      <div style="background-color: #0080FF; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; letter-spacing: 5px; font-weight: 300;">GLOYAS</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #111111; margin-top: 0;">Order Confirmed!</h2>
        <p style="color: #666666; line-height: 1.6;">Hi ${shipping_address.firstName},</p>
        <p style="color: #666666; line-height: 1.6;">Thank you for your order. We're getting it ready for shipment!</p>
        
        <div style="background-color: #F9F9F9; padding: 20px; margin: 20px 0;">
          <div style="font-size: 12px; font-weight: bold; color: #999999; margin-bottom: 5px;">ORDER NUMBER</div>
          <div style="font-size: 18px; font-weight: bold; color: #0080FF;">#GLY-${orderId}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #FAFAFA;">
              <th style="padding: 10px; text-align: left; font-size: 12px; color: #999999;">ITEM</th>
              <th style="padding: 10px; text-align: center; font-size: 12px; color: #999999;">QTY</th>
              <th style="padding: 10px; text-align: right; font-size: 12px; color: #999999;">PRICE</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 20px 10px 5px; text-align: right; font-weight: bold; color: #111111;">TOTAL (INCL. TAXES)</td>
              <td style="padding: 20px 10px 5px; text-align: right; font-weight: bold; color: #111111; font-size: 18px;">₹${total_amount}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px; border-top: 1px solid #EEEEEE; padding-top: 20px;">
          <p style="font-size: 12px; color: #999999; margin-bottom: 5px;">SHIPPING TO:</p>
          <p style="font-size: 14px; color: #666666; margin: 0;">
            ${shipping_address.firstName} ${shipping_address.lastName}<br>
            ${shipping_address.address}<br>
            ${shipping_address.city}, ${shipping_address.state} ${shipping_address.pinCode}
          </p>
        </div>
      </div>
      <div style="background-color: #FAFAFA; padding: 20px; text-align: center; font-size: 11px; color: #999999;">
        <p style="margin: 0 0 10px 0;">&copy; 2026 GLOYAS Premium. All rights reserved.</p>
        <p style="margin: 10px 0 0 0; font-size: 10px; color: #BBBBBB;">You received this email because you placed an order on gloyas.com</p>
      </div>
    </div>
  `;

  const msg = {
    to: shipping_address.email,
    from: {
      email: fromEmail,
      name: 'GLOYAS Premium'
    },
    replyTo: fromEmail,
    subject: `Order Confirmed: #GLY-${orderId}`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error: unknown) {
    console.error('SendGrid Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: message };
  }
}
