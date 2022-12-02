import { Box, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";

function ChatWithAdmin() {
  const [newMessage, setNewMessage] = useState();
  const [messages, setMessages] = useState([]);
  const { user } = ChatState();
  const toast = useToast();
  const sending = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const API = axios.create({ baseURL: "http://localhost:5000" });
        const { data } = await API.post(
          `/api/message/support`,
          { content: newMessage, chatId: user._id },
          config
        );

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const inputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
      >
        Support Chat
      </Text>
      <Box
        d="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {console.log(messages, "checkkk")}
        <ScrollableFeed></ScrollableFeed>
        <FormControl onKeyDown={sending} id="first-name" isRequired mt={3}>
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={inputChange}
          />
        </FormControl>
      </Box>
    </>
  );
}

export default ChatWithAdmin;
