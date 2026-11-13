# EmployeeHub

EmployeeHub is a full-stack employee management application built with React, Vite, Spring Boot, Java 21, Spring Data JPA, and MySQL.

## Features

- Register, sign in, manage a profile, and access protected pages.
- Add, view, edit, and delete employee records.
- Search employees by name, ID, or department; filter by department; sort by name or age.
- Store optional email, phone, job title, hire date, and salary for each employee.
- View employee counts by department and the five most recent hires.
- Responsive interface with form validation and duplicate employee ID protection.

## Requirements

- Node.js and npm
- JDK 21
- MySQL

## Run locally

1. Create a MySQL database:

   ```sql
   CREATE DATABASE excelr_employee_management;
   ```

2. Copy `backend/employee-management-system/src/main/resources/application-example.properties` to `application.properties`. Set the MySQL username and password in the new file.
3. In a terminal, start the backend:

   ```powershell
   cd backend/employee-management-system
   .\mvnw.cmd spring-boot:run
   ```

4. In a second terminal, from the project root, install dependencies and start the frontend:

   ```powershell
   npm ci
   $env:VITE_API_URL = "http://localhost:8085"
   npm run dev
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`). Keep both terminals running.



## Notes

The backend listens on port `8085` locally. Keep database credentials out of source control. The current authentication is intended for demonstration; add password hashing and robust authorization before using real employee data.
