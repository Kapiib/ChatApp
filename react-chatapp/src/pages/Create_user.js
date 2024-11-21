import "../css/create_user.css"
export default function Create_user(){
    return(
        <div class="cu_father">
          <h1>Create User</h1>
          <div class="form_box">
            <form class="create_user_form">
              <label>Mail-Address:</label>
              <input type="text" id="mail_address" name="mail_address"></input>
              <label>Password:</label>
              <input type="text" id="password" name="password"></input>
              <label>Confirm Password:</label>
              <input type="text" id="confirm_password" name="confirm_password"></input>
              <button>Submit</button>
            </form>
          </div>
        </div>
    )
}