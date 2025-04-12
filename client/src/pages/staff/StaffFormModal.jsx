import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import Button from "../../components/button";



const roles = {
  Manager: 30000,
  Chef: 15000,
  Waiter: 6000,
  Cleaner: 4000,
};

const StaffFormModal = ({ onClose, onSave, editingStaff }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "Manager",
    age: "",
    salary: roles["Manager"],
    paymentStatus: "Paid",
  });

  useEffect(() => {
    if (editingStaff && editingStaff.name) {
      setFormData({
        name: editingStaff.name || "",
        role: editingStaff.role || "Manager",
        age: editingStaff.age || "",
        salary: editingStaff.salary || roles["Manager"],
        paymentStatus: editingStaff.paymentStatus || "Paid",
      });
    } else {
      setFormData({
        name: "",
        role: "Manager",
        age: "",
        salary: roles["Manager"],
        paymentStatus: "Paid",
      });
    }
  }, [editingStaff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      const salary = roles[value];
      const paymentStatus = salary >= 5000 ? "Paid" : "Non-Paid";
      setFormData({ ...formData, role: value, salary, paymentStatus });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.age < 18 || formData.age > 60) {
      alert("Age must be between 18 and 60.");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingStaff ? "Edit Staff" : "Add New Staff"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {Object.keys(roles).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Salary</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={formData.salary}
              readOnly
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StaffFormModal;
