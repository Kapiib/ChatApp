import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    axios.post("http://localhost:4000/api/login", formData)
      .then((response) => {
        console.log("Login successful:", response);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="login_father">
      <h1>Login</h1>
      <div className="form_box_login">
        <form className="Login_form" onSubmit={handleSubmit}>
          <label>Mail-Address:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}