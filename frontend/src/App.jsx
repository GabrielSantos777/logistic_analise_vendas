import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/api")
      .then(res => setMsg(res.data.message))
      .catch(() => setMsg("Erro ao conectar com backend"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Frontend conectado</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;