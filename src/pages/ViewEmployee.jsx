import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../service/axiosInstance";
import { toast } from "react-toastify";

const ViewEmployee = () => {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const navigate = useNavigate();

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/getEmployees"
      );
      setEmployee(response.data);
    } catch (error) {
      toast.error("Unable to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await axiosInstance.delete(
        "/deleteEmp/" + id
      );

      toast.success("Employee deleted successfully");
      fetchEmployee();
    } catch (error) {
      toast.error("Employee could not be deleted");
    }
  };

  const loadEdit = (id) => {
    navigate(`/updateEmp/${id}`);
  };

  const viewIndEmp = (id) => {
    navigate(`/viewEmp/${id}`);
  };

  const departments = [...new Set(employee.map((emp) => emp.dept).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  const departmentStats = useMemo(() => {
    const groups = new Map();
    employee.forEach((emp) => {
      const key = emp.dept.trim().toLocaleLowerCase();
      const existing = groups.get(key);
      groups.set(key, {
        name: existing?.name || emp.dept.trim(),
        count: (existing?.count || 0) + 1,
      });
    });
    return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [employee]);

  const recentHires = useMemo(
    () =>
      employee
        .filter((emp) => emp.hireDate)
        .sort((a, b) => b.hireDate.localeCompare(a.hireDate))
        .slice(0, 5),
    [employee]
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = employee.filter((emp) => {
      const matchesSearch =
        !query ||
        String(emp.id).includes(query) ||
        emp.name.toLocaleLowerCase().includes(query) ||
        emp.dept.toLocaleLowerCase().includes(query);
      const matchesDepartment =
        !departmentFilter ||
        emp.dept.toLocaleLowerCase() === departmentFilter.toLocaleLowerCase();
      return matchesSearch && matchesDepartment;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "ageAsc") return a.age - b.age || a.name.localeCompare(b.name);
      if (sortBy === "ageDesc") return b.age - a.age || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [employee, search, departmentFilter, sortBy]);

  return (
    <main className="dashboard-page">

      {/* Hero Section */}
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">
            EMPLOYEE MANAGEMENT
          </span>

          <h1>Employee Dashboard</h1>

          <p>
            Manage your organization's employees, departments,
            and records from one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/addEmp")}
        >
          + Add Employee
        </button>
      </section>

      {/* Statistics */}
      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <span>Total Employees</span>
            <strong>{employee.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div>
            <span>Departments</span>
            <strong>{departments.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <span>System Status</span>
            <strong className="status-active">Active</strong>
          </div>
        </div>

      </section>

      <section className="dashboard-insights">
        <div className="insight-card">
          <div className="insight-heading">
            <h2>Employees by Department</h2>
            <span>{departmentStats.length} departments</span>
          </div>
          {departmentStats.length ? (
            <ul className="insight-list">
              {departmentStats.map((department) => (
                <li key={department.name}>
                  <span>{department.name}</span>
                  <strong>{department.count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="insight-empty">Department totals will appear after you add employees.</p>
          )}
        </div>

        <div className="insight-card">
          <div className="insight-heading">
            <h2>Recent Hires</h2>
            <span>Latest 5</span>
          </div>
          {recentHires.length ? (
            <ul className="insight-list">
              {recentHires.map((emp) => (
                <li key={emp.id}>
                  <span>{emp.name}</span>
                  <strong>{emp.hireDate}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="insight-empty">Add a hire date to an employee to show recent hires here.</p>
          )}
        </div>
      </section>

      {/* Employee Directory */}
      <section className="employee-section">

        <div className="section-heading">
          <div>
            <h2>Employee Directory</h2>
            <p>
              View and manage all registered employees.
            </p>
          </div>

          <span className="employee-count">
            {filteredEmployees.length} of {employee.length} Employees
          </span>
        </div>

        <div className="employee-filters">
          <label className="employee-search">
            <span>Search employees</span>
            <input
              type="search"
              placeholder="Name, ID, or department"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            <span>Department</span>
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="name">Name (A-Z)</option>
              <option value="ageAsc">Age (low to high)</option>
              <option value="ageDesc">Age (high to low)</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading employees...</p>
          </div>
        ) : employee.length > 0 && filteredEmployees.length > 0 ? (

          <div className="table-wrapper">
            <table className="employee-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Age</th>
                  <th>Department</th>
                  <th>Job Title</th>
                  <th>Email</th>
                  <th>Hire Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>

                    <td>
                      <span className="employee-id">
                        #{emp.id}
                      </span>
                    </td>

                    <td>
                      <div className="employee-name">
                        <div className="avatar">
                          {emp.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <span>
                          {emp.name}
                          {emp.jobTitle && <small>{emp.jobTitle}</small>}
                        </span>
                      </div>
                    </td>

                    <td>{emp.age}</td>

                    <td>
                      <span className="department-badge">
                        {emp.dept}
                      </span>
                    </td>

                    <td>{emp.jobTitle || "—"}</td>
                    <td>{emp.email || "—"}</td>
                    <td>{emp.hireDate || "—"}</td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="action-btn view-btn"
                          onClick={() => viewIndEmp(emp.id)}
                        >
                          View
                        </button>

                        <button
                          className="action-btn edit-btn"
                          onClick={() => loadEdit(emp.id)}
                        >
                          Edit
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteEmployee(emp.id)}
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        ) : employee.length > 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>
            <h3>No matching employees</h3>
            <p>Try a different search or clear the department filter.</p>
            <button
              className="secondary-btn"
              onClick={() => {
                setSearch("");
                setDepartmentFilter("");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (

          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No employees yet</h3>
            <p>
              Add your first employee to start managing your directory.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/addEmp")}
            >
              + Add Employee
            </button>
          </div>

        )}

      </section>

    </main>
  );
};

export default ViewEmployee;