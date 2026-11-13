import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";
import { toast } from "react-toastify";

const UpdateEmployee = () => {
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { eid } = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/getEmpById/${eid}`
        );

        const data = response.data;

        setFormData({
          id: data.id,
          name: data.name || "",
          age: data.age || "",
          dept: data.dept || "",
          email: data.email || "",
          phone: data.phone || "",
          jobTitle: data.jobTitle || "",
          hireDate: data.hireDate || "",
          salary: data.salary ?? "",
        });
      } catch (error) {
        toast.error("Unable to load employee details.");

        setTimeout(() => {
          navigate("/");
        }, 800);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [eid, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
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
      setSaving(true);

      await axiosInstance.put(
        "/updateEmployee",
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

      toast.success(
        "Employee information updated successfully!"
      );

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Employee information could not be updated."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="form-page">
        <div className="form-loading">
          <div className="loader"></div>
          <p>Loading employee information...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="form-page">

      <div className="form-card employee-form-card">

        <div className="form-header">

          <div className="form-icon edit-form-icon">
            ✎
          </div>

          <div>
            <span className="dashboard-eyebrow">
              EMPLOYEE DIRECTORY
            </span>

            <h1>Edit Employee</h1>

            <p>
              Update the employee information below.
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
              value={formData.id}
              disabled
            />

            <small className="field-help">
              Employee ID cannot be changed.
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
              onChange={handleChange}
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
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hireDate">Hire Date (optional)</label>
              <input
                id="hireDate"
                type="date"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
};

export default UpdateEmployee;