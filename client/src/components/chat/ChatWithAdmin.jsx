import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/button";

function ChatWithAdmin() {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const API = axios.create({ baseURL: "http://localhost:5000" });
      const { data } = await API.get(`/api/message/${user._id}`, config);

      setLoading(true);

      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    console.log(user, "user check");
    fetchMessages();
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <div>
        <Menu>
          <MenuButton as={Button} bg="white">
            <Avatar size="sm" cursor="pointer" />
          </MenuButton>
          <MenuList>
            <MenuItem>My Profile</MenuItem> <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="80px"
      >
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignSelf="center"
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
          <div style={{ height: "600px", overflowY: "scroll" }}>
            {messages &&
              messages.map((m, i) => (
                <div style={{ display: "flex", overflowY: "auto" }}>
                  <span
                    style={{
                      backgroundColor: `${
                        m.sender === null ? "#B9D" : " #BEE"
                      }`,
                      marginLeft: `${m.sender === null ? "0px" : "1000px"}`,
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "75%",
                      marginTop: "4px",
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
          </div>

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
      </Box>
    </div>
  );
}

export default ChatWithAdmin;
