import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";

import io from "socket.io-client";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../utils/Implement";
import ChatWindow from "./ChatWindow";

const ENDPOINT = "http://localhost:5000";
var socket, selChatCompare;

const PersonalChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selChat, setselChat, user } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user?._id);
    socket.on("connection", () => setSocketConnected(true));
    {
      console.log(selChat, "indicate");
    }
  }, []);

  const fetchMessages = async () => {
    if (!selChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const API = axios.create({ baseURL: "http://localhost:5000" });
      const { data } = await API.get(`/api/message/${selChat._id}`, config);

      setLoading(true);

      setMessages(data);
      setLoading(false);

      socket.emit("joining", selChat._id);
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
    fetchMessages();

    selChatCompare = selChat;
  }, [selChat]);

  useEffect(() => {
    socket.on("received msg", (newm) => {
      if (!selChatCompare || selChatCompare._id !== newm.chat._id) {
      } else {
        setMessages([...messages, newm]);
      }
    });
  });

  const sending = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        {
          console.log(selChat, "hehe");
        }
        const API = axios.create({ baseURL: "http://localhost:5000" });
        const { data } = await API.post(
          `/api/message`,
          { content: newMessage, chatId: selChat },
          config
        );

        socket.emit("new msg", data);
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

    if (!socketConnected) return;
  };

  return (
    <>
      {selChat ? (
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
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselChat("")}
            />
            {selChat ? (
              <>
                {" "}
                <img
                  src={selChat.users[0].pic}
                  width="20px"
                  borderRadius="100%"
                />
                {selChat.users[0].name}
              </>
            ) : null}
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
            {loading ? (
              "loading..."
            ) : (
              <div
                className="messages"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "hidden",
                  height: "87%",
                  top: "20%",
                }}
              >
                {console.log(messages, "fine")}
                <ChatWindow messages={messages} />
              </div>
            )}

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
      ) : // to get socket.io on same page
      null}
    </>
  );
};

export default PersonalChat;
