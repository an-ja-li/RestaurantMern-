import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Trash2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import "./Billing.css";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/bills/all');
      setBills(res.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (billId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bill?');
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(`http://localhost:5000/api/bills/${billId}`);
      console.log('Response:', res);
      setBills((prevBills) => prevBills.filter((bill) => bill._id !== billId));
      alert('Bill deleted successfully.');
    } catch (error) {
      console.error('Error deleting bill:', error);
      alert('Failed to delete bill. Please try again.');
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const generatePDF = (bill) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Bill Details', 20, 20);
    doc.text(`Customer: ${bill.customer?.name}`, 20, 30);
    doc.text(`Contact: ${bill.customer?.contact}`, 20, 40);
    doc.text(`Payment Method: ${bill.paymentMethod}`, 20, 50);
    doc.text('Items:', 20, 60);
    bill.items.forEach((item, index) => {
      doc.text(`${item.name} x${item.quantity} - ₹${item.price * item.quantity}`, 20, 70 + index * 10);
    });
    doc.text(`Total: ₹${bill.totalAmount}`, 20, 70 + bill.items.length * 10);
    doc.save(`Bill_${bill._id}.pdf`);
  };

  const filteredBills = bills.filter((bill) => {
    const billDate = new Date(bill.createdAt).toISOString().slice(0, 10);
    const matchesSearch = bill.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? billDate === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="billing-container">
      <h2 className="billing-title">🧾 All Bills</h2>

      {/* Search and Filter */}
      <div className="search-bar">
        <div className="search-controls">
          {/* Search Input */}
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Date Input */}
          <div className="search-input-wrapper">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-input"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredBills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <div className="table-container">
         <table className="billing-table">
  <thead>
    <tr>
      <th>No.</th>
      <th>Customer</th>
      <th>Contact</th>
      <th>Items</th>
      <th>Total (₹)</th>
      <th>Payment</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredBills.map((bill, index) => (
      <tr key={bill._id}>
        <td>{index + 1}</td>
        <td>{bill.customer?.name}</td>
        <td>{bill.customer?.contact}</td>
        <td>
          {bill.items.map((item, idx) => (
            <div key={idx}>
              {item.name} x{item.quantity}
            </div>
          ))}
        </td>
        <td>₹{bill.totalAmount}</td>
        <td>{bill.paymentMethod}</td>
        <td>{new Date(bill.createdAt).toLocaleString()}</td>
        <td>
          <button className="download-button" onClick={() => generatePDF(bill)}>
            Download
          </button>
          <button className="delete-button" onClick={() => deleteBill(bill._id)}>
            Delete
          </button>

         
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}
    </div>
  );
};

export default Billing;






