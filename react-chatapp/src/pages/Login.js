import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/api/user/login", { email: formData.email, password: formData.password }, { withCredentials: true })
      .then((response) => {
        console.log("Login successful:", response);
        setMsg(response.data.msg)
        setTimeout(() =>{
          window.location.href="/About"
        }, 3000)
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
          {/* <label>Username:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          /> */}
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
      {msg ? <div id="response_login">{msg}!</div> : <div></div>}
    </div>
  );
}