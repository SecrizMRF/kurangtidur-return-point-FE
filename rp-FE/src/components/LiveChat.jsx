import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

export default function LiveChat() {
  const roomId = "user-123"; // nanti pakai user ID
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    axios.get(`/api/chat/${roomId}`).then(res => {
      setChats(res.data);
    });

    socket.on("receiveMessage", data => {
      setChats(prev => [...prev, data]);
    });
  }, []);

  const send = () => {
    const data = { roomId, sender: "user", message: msg };
    socket.emit("sendMessage", data);
    setMsg("");
  };

  return (
    <>
      <button style={styles.fab} onClick={() => setOpen(!open)}>💬</button>

      {open && (
        <div style={styles.box}>
          <div style={styles.chat}>
            {chats.map((c,i)=>(
              <p key={i}><b>{c.sender}:</b> {c.message}</p>
            ))}
          </div>
          <input value={msg} onChange={e=>setMsg(e.target.value)} />
          <button onClick={send}>Send</button>
        </div>
      )}
    </>
  );
}

const styles = {
  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    fontSize: 24,
    borderRadius: "50%",
    padding: 15
  },
  box: {
    position: "fixed",
    bottom: 80,
    right: 20,
    width: 300,
    background: "#fff",
    borderRadius: 10,
    padding: 10
  },
  chat: { height: 200, overflowY: "auto" }
};
