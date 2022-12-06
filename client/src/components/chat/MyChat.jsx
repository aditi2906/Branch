import { useToast } from "@chakra-ui/react";
import { Box, Stack, Text } from "@chakra-ui/layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import Loader from "../Loader.jsx";
import { getSender } from "../utils/Implement";

function MyChat({ fetchAgain }) {
  const toast = useToast();
  const { selChat, setselChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(user, "fetch check");
      const API = axios.create({ baseURL: "http://localhost:5000" });
      const { data } = await API.get(`/api/chat`, config);
      console.log(data, "heyo");
      setChats(data);
      console.log(chats, "chatting");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    fetchChats();
  }, [user]);

  const getSender = (user, users) => {
    return users[0]
      ? users[0]._id === user._id
        ? users[1].name
        : users[0].name
      : null;
  };
  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        onClick={fetchChats}
        cursor="pointer"
      >
        Tap to Load User List
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
      >
        <Stack overflowY="auto">
          {chats?.map((chat) => (
            <Box
              onClick={() => setselChat(chat)}
              cursor="pointer"
              bg={selChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >
              {chat.users ? getSender(user, chat.users) : null}

              {chat.latestMessage ? (
                <Text fontSize="xs">
                  <b>
                    {chat.latestMessage ? (
                      <>
                        {chat.latestMessage.sender ? (
                          <>{chat.latestMessage.sender.name}</>
                        ) : (
                          <>admin</>
                        )}
                        :{chat.latestMessage.content}
                      </>
                    ) : (
                      <></>
                    )}
                  </b>
                </Text>
              ) : (
                <></>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default MyChat;
