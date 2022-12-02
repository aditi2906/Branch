import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Pages/Chat";
import Home from "./Pages/Home";
import AdminPage from "./Pages/AdminPage";
import ChatProvider from "./Context/ChatProvider";
import ChatWithAdmin from "./components/chat/ChatWithAdmin";

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin" element={<AdminPage />}></Route>
          <Route path="chats" element={<Chat />}></Route>
          <Route path="adminChat" element={<ChatWithAdmin />}></Route>
          {/* <Route path="not" element={<SingleChat />}></Route> */}
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
