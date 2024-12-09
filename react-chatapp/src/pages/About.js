//About = Chat siden
import "../css/Chats.css"
export default function About(){
    return(
      <div id="fatherDiv">
          <div class="chat_header">
            {/* <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/Login">Account</a>
              </li>
            </ul> */}
          <div id="user_search_div">
        </div>
        </div>
        <div class="chat_box">
          <div class="empty_grid_box">
           empty
          </div>
          <div class="searchBar_chatBox">
            <h1 id="search_user">Search user:</h1>
            <form>
              <input type="text" name="user_name" id="find_user"/>
              <button>add</button>
            </form>
            </div>
          <div class="people">
            <h5>People</h5>
          </div>
          <div class="chatpage">
            <h5>Chatbox</h5>
          </div>
        </div>
      </div>
      
    )
}