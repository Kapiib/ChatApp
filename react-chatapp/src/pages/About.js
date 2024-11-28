import "../css/Chats.css"
export default function About(){
    return(
      <div id="fatherDiv">
        <div class="chat_header">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/Login">Account</a>
            </li>
          </ul>
        </div>
        <div class="chat_box">
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