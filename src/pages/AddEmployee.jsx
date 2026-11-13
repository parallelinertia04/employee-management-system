import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";
import { toast } from "react-toastify";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    age: "",
    dept: "",
    email: "",
    phone: "",
    jobTitle: "",
    hireDate: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id ||
      !formData.name.trim() ||
      !formData.age ||
      !formData.dept.trim()
    ) {
      toast.error("Please complete all employee details.");
      return;
    }

    if (Number(formData.age) < 18) {
      toast.error("Employee age must be at least 18.");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.salary && Number(formData.salary) < 0) {
      toast.error("Salary cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post(
        "/addEmployee",
        {
          id: Number(formData.id),
          name: formData.name.trim(),
          age: Number(formData.age),
          dept: formData.dept.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          jobTitle: formData.jobTitle.trim() || null,
          hireDate: formData.hireDate || null,
          salary: formData.salary ? Number(formData.salary) : null,
        }
      );

      toast.success("Employee added successfully!");

      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Employee could not be added."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">

      <div className="form-card employee-form-card">

        <div className="form-header">

          <div className="form-icon">
            +
          </div>

          <div>

            <span className="dashboard-eyebrow">
              EMPLOYEE DIRECTORY
            </span>

            <h1>
              Add Employee
            </h1>

            <p>
              Create a new employee record
              and add it to your directory.
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="id">
              Employee ID
            </label>

            <input
              id="id"
              type="number"
              name="id"
              min="1"
              placeholder="e.g. 101"
              value={formData.id}
              onChange={handleInputChange}
            />

            <small className="field-help">
              Employee ID must be unique.
            </small>

          </div>

          <div className="form-group">

            <label htmlFor="name">
              Employee Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter employee name"
              value={formData.name}
              onChange={handleInputChange}
            />

          </div>

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="age">
                Age
              </label>

              <input
                id="age"
                type="number"
                name="age"
                min="18"
                placeholder="e.g. 24"
                value={formData.age}
                onChange={handleInputChange}
              />

            </div>

            <div className="form-group">

              <label htmlFor="dept">
                Department
              </label>

              <input
                id="dept"
                type="text"
                name="dept"
                placeholder="e.g. Development"
                value={formData.dept}
                onChange={handleInputChange}
              />

            </div>

          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title (optional)</label>
              <input
                id="jobTitle"
                type="text"
                name="jobTitle"
                placeholder="e.g. Software Engineer"
                value={formData.jobTitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hireDate">Hire Date (optional)</label>
              <input
                id="hireDate"
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary (optional)</label>
            <input
              id="salary"
              type="number"
              name="salary"
              min="0"
              step="0.01"
              placeholder="e.g. 50000"
              value={formData.salary}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Employee"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
};

export default AddEmployee;