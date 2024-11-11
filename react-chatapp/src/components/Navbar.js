import "../css/Navbar.css"


export default function Navbar(){
    return(
        
        <nav>
            <div>
                <h1 id="yaphubtext">YapHub</h1>
            </div>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/About">About</a></li>
                <li><a href="/Create_user">Create User</a></li>
                <li><a href="/Login">Login</a></li>
            </ul>
        </nav>
    )
}