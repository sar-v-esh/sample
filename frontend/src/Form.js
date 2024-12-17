import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    employeeId: yup
      .string()
      .max(10, "Employee ID must be max 10 characters")
      .required("Employee ID is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    department: yup.string().required("Department is required"),
    dateOfJoining: yup
      .date()
      .max(new Date(), "Date of Joining cannot be in the future")
      .required("Date of Joining is required"),
    role: yup.string().required("Role is required"),
  })
  .required();
const Form = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
      setMessage("Data fetched successfully!");
    } catch (error) {
      console.error("Error Details:", error.response?.data || error.message);
      setMessage("Error fetching employees.");
    }
  };
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
      setMessage("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setMessage("Failed to delete employee. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/employees", data);
      setMessage("Employee added successfully!");
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage("Failed to add employee. Please check the data.");
    }
  };

  return (
    <div className="container">
      <h1>Add Employee</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input {...register("name")} placeholder="Name" className="input" />
        <input
          {...register("employeeId")}
          placeholder="Employee ID"
          className="input"
        />
        <input {...register("email")} placeholder="Email" className="input" />
        <input
          {...register("phone")}
          placeholder="Phone Number"
          className="input"
        />
        <select {...register("department")} className="input">
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
        </select>
        <input
          type="date"
          {...register("dateOfJoining")}
          placeholder="Date of Joining"
          className="input"
        />
        <input {...register("role")} placeholder="Role" className="input" />

        <br />
        <br />
        <div class="button-container">
          <button type="submit" className="submit-button ">
            Submit
          </button>
        </div>
      </form>
      <br />
      <br />
      <br />
      <div class="button-container">
        <button onClick={fetchEmployees} className="submit-button">
          Fetch Employees
        </button>
      </div>
      <br />
      <br />
      <br />
      <div class="button-container">
        <input
          type="text"
          placeholder="Enter the id of the employee to delete"
          className="delete inp"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>
      <br />
      <br />
      <br />
      <div class="button-container">
        <button onClick={deleteEmployee} className="submit-button">
          Delete Employee
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      <h2>Employee List</h2>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id}>
              <td>{employee.name}</td>
              <td>{employee.employee_id}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.department}</td>
              <td>{new Date(employee.date_of_joining).toLocaleDateString()}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form;
