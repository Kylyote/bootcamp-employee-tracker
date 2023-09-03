DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (employees) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_first VARCHAR(30) NOT NULL,
  employee_last VARCHAR(30) NOT NULL,
  employee_department VARCHAR(100) NOT NULL,
  employee_salary INT NOT NULL,
  FOREIGN KEY (roles) REFERENCES roles(id) ON DELETE SET NULL,
  -- Need to put more here.--
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(64) NOT NULL,
);