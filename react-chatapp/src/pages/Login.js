import "../css/Login.css"
export default function Login(){
    return(
        <div class="login_father">
          <h1>Login</h1>
          <div class="form_box_login">
            <form class="Login_form">
            <label>Mail-Address:</label>
              <input type="text" id="mail_address" name="mail_address"></input>
              <label>Password:</label>
              <input type="text" id="password" name="password"></input>
              <button>Submit</button>
            </form>
          </div>
        </div>
    )
}