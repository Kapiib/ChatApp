import "../css/Navbar.css"


export default function Navbar(){
    return(
        
        <nav>
            <div class="top_text_YH">
                <div class="yaphub_logo">
                    <img src="/images/Yh.png" alt="Icon" width="100px" heigth="100px"></img>
                </div>
                <h1 id="yaphubtext">YapHub</h1>
            </div>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/About">Chats</a></li>
                <li><a href="/Create_user">Create User</a></li>
                <li><a href="/Login">Login</a></li>
            </ul>
        </nav>
    )
}