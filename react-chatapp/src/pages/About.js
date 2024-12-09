//About = Chat siden
import { useState } from "react"
import "../css/Chats.css"
export default function About() {

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [createdChannel, setCreatedChannel] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("/api/chat/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: searchInput}),
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.user);
      } else {
        setError(data.message);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setError("Something went wrong while searching...");
    }

    }
  // };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: channelName}),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedChannel(data); //update created channel
        alert("Channel created!")
      } else {
        setError(data.error || data.message);
      }
    } catch (err) {
      console.error("Channel creation ERROR:", err);
      setError("An error occured while creating the channel");
    }
  };

  return(
    <div id="fatherDiv">
      <div class="chat_header">
      <div id="user_search_div">
      </div>
      </div>
      <div class="chat_box">
        <div class="empty_grid_box">empty</div>

        {/*Søk på bruker seksjon*/}
        <div class="searchBar_chatBox">
          <h1 id="search_user">Search user:</h1>
          <form onSubmit={handleSearch}>
            <input
            type="text"
            name="user_name"
            id="find_user"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter username"
          />
            <button type="submit">Search</button>
          </form>
          {error && <p className="error">{error}</p>}
          <div className="search_results">
            {searchResults.map((user, index) => (
              <div key={index} className="user_item">
                <p>{user.name} ({user.email})</p>
              </div>
            ))}
          </div>
        </div>

        {/*Channel Creation og text box*/}
        <div classname="channel_creation">
          <h1>Create Channel:</h1>
          <form onSubmit={handleCreateChannel}>
            <input
            type="text"
            placeholder="Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
          />
          <button type="submit">Create</button>
        </form>
        {error && <p classname="error">{error}</p>}
        {createdChannel && (
          <div className="channel_info">
            <p>Channel ID: {createdChannel.channelId}</p>
            <p>Admin User: {createdChannel.adminUser}</p>
          </div>
        )}
        </div>

        <div class="people">
          <h5>People</h5>
        </div>
        <div class="chatpage">
          <h5>Chatbox</h5>
        </div>
      </div>
    </div>
  );
}