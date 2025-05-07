// PrintableBill.js
import React, { forwardRef } from 'react';

const PrintableBill = forwardRef(({ bill }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20mm',
        maxWidth: '210mm', // A4 width
        margin: 'auto',
        color: '#000',
        backgroundColor: '#fff'
      }}
    >
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
            }
            ul {
              padding-left: 20px;
            }
          }
        `}
      </style>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bill Receipt</h2>

      <section style={{ marginBottom: '15px' }}>
        <p><strong>Customer:</strong> {bill.customer?.name}</p>
        <p><strong>Contact:</strong> {bill.customer?.contact}</p>
        <p><strong>Payment Method:</strong> {bill.paymentMethod}</p>
      </section>

      <section style={{ marginBottom: '15px' }}>
        <h3>Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Item</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>Qty</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>Price</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>₹{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '15px', textAlign: 'right' }}>
        <h3>Total: ₹{bill.totalAmount.toFixed(2)}</h3>
      </section>

      <section style={{ textAlign: 'right' }}>
        <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleString()}</p>
      </section>
    </div>
  );
});

export default PrintableBill;
