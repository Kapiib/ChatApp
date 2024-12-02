import React, {useState} from "react";
import axios from "axios";
import "../css/create_user.css"
export default function Create_user(){

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    name: "",
  });

  const[msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    axios.post("http://localhost:4000/api/user/register", {email: formData.email, password: formData.password, repeatPassword: formData.repeatPassword, name: formData.name})
      .then((response) => {
        console.log("User Successfully created!:", response);
        setMsg(response.data.msg)
        setTimeout(() => {
          window.location.href="/login"
        }, 3000)
      })
      .catch((error) => {
        console.error("Creation failed...", error);
      });
  };
    return(
        <div class="cu_father">
          <h1>Create User</h1>

          <div class="form_box">
            <form class="create_user_form" onSubmit={handleSubmit}>
            <label>Username:</label>
              <input 
              type="text"
              id="userName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              />
              <label>Mail-Address:</label>
              <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              />
              <label>Password:</label>
              <input 
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              />
              <label>Confirm Password:</label>
              <input 
              type="text"
              id="repeatPassword"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              />

              <button type="submit">Submit</button>

            </form>

          </div>
          {msg ? <div id="response_cu">{msg}!</div> : <div></div>}
        </div>
)}