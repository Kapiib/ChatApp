import React, {useState} from "react";
import axios from "axios";
import "../css/create_user.css"
export default function Create_user(){

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    userName: "",
  });

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    axios.post("http://localhost:4000/api/register", formData)
      .then((response) => {
        console.log("Response:", response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
    return(
        <div class="cu_father">
          <h1>Create User</h1>

          <div class="form_box">
            <form class="create_user_form">
            <label>Username:</label>
              <input 
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              />
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
            
        </div>
)}