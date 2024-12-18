import "../css/Navbar.css"
import { useUser } from "../UserContext"



export default function Navbar(){
    const { user, setUser } = useUser();

    const handleLogout = () => {
        setUser(null);
        alert("You have been logged out.")
    };

    return(
        
        <nav>
            <div class="top_text_YH">
                <div class="yaphub_logo">
                    <a href="/"><img  src="/images/Yh.png" alt="Icon" width="100px" heigth="100px"></img></a>
                </div>
                <h1 id="yaphubtext">YapHub</h1>
            </div>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/About">Chats</a></li>
                <li><a href="/Create_user">Create User</a></li>
                {/* <li><a href="/Login">Login</a></li> */}
                {user ? (
                    <>
                        <li>
                            <a href="/Account">Konto ({user.userName})</a>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout_button">
                                logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <a href="/Login">Login</a>
                    </li>
                )}
                
            </ul>
        </nav>
    )
}