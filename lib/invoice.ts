import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from './orders';

const formatInvoicePrice = (price: number) => `Rs. ${price.toLocaleString('en-IN')}`;

// Define a type for jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export async function generateInvoicePDF(order: Order) {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.width;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 128, 255); // GLOYAS Blue
  doc.text('GLOYAS', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('PREMIUM HEADWEAR CO.', 14, 28);
  
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('INVOICE', pageWidth - 14, 22, { align: 'right' });
  
  doc.setFontSize(10);
  doc.text(`#GLY-${order.id.substring(0, 8).toUpperCase()}`, pageWidth - 14, 28, { align: 'right' });

  // Divider
  doc.setDrawColor(232, 232, 232);
  doc.line(14, 35, pageWidth - 14, 35);

  // Billing Details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 14, 45);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${order.shipping_address.firstName} ${order.shipping_address.lastName}`, 14, 50);
  doc.text(order.shipping_address.address, 14, 55);
  doc.text(`${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.pinCode}`, 14, 60);
  doc.text(`Phone: ${order.shipping_address.phone}`, 14, 65);
  doc.text(`Email: ${order.shipping_address.email}`, 14, 70);

  // Order Info
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER INFO:', pageWidth - 60, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - 60, 50);
  doc.text(`Status: ${order.status.toUpperCase()}`, pageWidth - 60, 55);
  doc.text(`Payment: Secure Card`, pageWidth - 60, 60);

  // Table
  const tableData = order.order_items.map(item => [
    item.name,
    `${item.size} / ${item.color}`,
    item.quantity.toString(),
    formatInvoicePrice(item.price),
    formatInvoicePrice(item.price * item.quantity)
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Product', 'Variant', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    headStyles: { fillColor: [0, 128, 255], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 249, 249] },
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 }
  });

  const finalY = doc.lastAutoTable.finalY || 150;

  // Totals
  const subtotal = order.subtotal_amount;
  const shipping = order.shipping_amount;
  const discount = order.discount_amount;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', pageWidth - 60, finalY + 15);
  doc.text(formatInvoicePrice(subtotal), pageWidth - 14, finalY + 15, { align: 'right' });
  
  doc.text('Shipping:', pageWidth - 60, finalY + 22);
  doc.text(shipping === 0 ? 'FREE' : formatInvoicePrice(shipping), pageWidth - 14, finalY + 22, { align: 'right' });
  
  let currentY = finalY + 22;

  if (discount > 0) {
    currentY += 7;
    doc.setTextColor(0, 150, 0); // Success Green for discount
    doc.text(`Discount (${order.coupon_code || 'Coupon'}):`, pageWidth - 60, currentY);
    doc.text(`-${formatInvoicePrice(discount)}`, pageWidth - 14, currentY, { align: 'right' });
    doc.setTextColor(0); // Reset to black
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', pageWidth - 60, currentY + 10);
  doc.text(formatInvoicePrice(order.total_amount), pageWidth - 14, currentY + 10, { align: 'right' });

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150);
  doc.text('Thank you for shopping with GLOYAS!', pageWidth / 2, 280, { align: 'center' });
  doc.text('Visit us at www.gloyas.com', pageWidth / 2, 285, { align: 'center' });

  doc.save(`GLOYAS-Invoice-${order.id.substring(0, 8).toUpperCase()}.pdf`);
}
