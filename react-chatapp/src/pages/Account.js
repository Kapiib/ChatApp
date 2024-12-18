import { useUser } from "../UserContext";
import "../css/Account.css"

export default function AccountPage() {
    const { user } = useUser();

    if (!user) {
        return <p>You need to log in to access this page!</p>
    }

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}