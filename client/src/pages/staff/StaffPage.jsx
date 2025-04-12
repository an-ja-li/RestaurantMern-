import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "../../api/axiosInstance";
import StaffFormModal from "./StaffFormModal";
import RemoveStaffModal from "./RemoveStaffModal";
import Button from "../../components/button";
import "./StaffPage.css";



const StaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    axios.get('/staff') // ✅ IF you're using a baseURL of 'http://localhost:5000/api'
      .then(res => setStaffList(res.data))
      .catch(err => console.error("❌ Fetch error:", err));
  }, []);
  

  const handleAddOrUpdateStaff = (staffData) => {
    if (editingStaff) {
      // UPDATE staff
      axios
        .put(`staff/${editingStaff._id}`, staffData)
        .then((res) => {
          setStaffList((prevList) =>
            prevList.map((s) => (s._id === editingStaff._id ? res.data : s))
          );
          setShowModal(false);
          setEditingStaff(null);
        })
        .catch((err) => console.error("❌ Update error:", err));
    } else {
      // ADD new staff
      axios
        .post("/staff", staffData)
        .then((res) => {
          setStaffList((prevList) => [...prevList, res.data]);
          setShowModal(false);
        })
        .catch((err) => console.error("❌ Add error:", err));
    }
  };
  
  const fetchStaff = async () => {
    const res = await axios.get("/staff"); // Goes to /api/staff
  };
  
  const handleRemoveStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const confirmRemove = () => {
    axios.delete(`/staff/${selectedStaff._id}`)

      .then(() => {
        setStaffList((prevList) =>
          prevList.filter((s) => s._id !== selectedStaff._id)
        );
        setSelectedStaff(null);
      })
      .catch((err) => console.error("❌ Delete error:", err));
  };
  
  const togglePaymentStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Non-Paid" : "Paid";
    try {
      const response = await axios.patch(`/staff/${id}/payment`, {
        paymentStatus: newStatus,
      });
      setStaffList((prevList) =>
        prevList.map((staff) =>
          staff._id === id ? { ...staff, paymentStatus: newStatus } : staff
        )
      );
    } catch (error) {
      console.error("Error toggling payment status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <Button
        onClick={() => {
          setShowModal(true);
          setEditingStaff(null);
        }}
      >
        Add New Staff
      </Button>

      {showModal && (
        <StaffFormModal
          onClose={() => {
            setShowModal(false);
            setEditingStaff(null);
          }}
          onSave={handleAddOrUpdateStaff}
          editingStaff={editingStaff}
        />
      )}

      {selectedStaff && (
        <RemoveStaffModal
          staff={selectedStaff}
          onConfirm={confirmRemove}
          onCancel={() => setSelectedStaff(null)}
        />
      )}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Age</th>
            <th>Salary</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.age}</td>
              <td>${member.salary}</td>
              <td className="toggle-container">
                <div className="toggle-switch">
                  <label
                    className={`toggle-label ${
                      member.paymentStatus === "Paid" ? "active" : ""
                    }`}
                    onClick={() =>
                      togglePaymentStatus(member._id, member.paymentStatus)
                    }
                  >
                    Paid
                  </label>
                  <label
                    className={`toggle-label ${
                      member.paymentStatus === "Non-Paid" ? "active" : ""
                    }`}
                    onClick={() =>
                      togglePaymentStatus(member._id, member.paymentStatus)
                    }
                  >
                    Unpaid
                  </label>
                </div>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingStaff(member);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveStaff(member)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StaffPage;
