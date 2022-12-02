import { React, useState } from "react";
import { Box, Container } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/chat/SideDrawer";
import ChatBox from "../components/chat/ChatBox";
import MyChat from "../components/chat/MyChat";

function Chat() {
  const { user } = ChatState();
  console.log(user, "hello");
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <SideDrawer />
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        <MyChat fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  );
}

export default Chat;
