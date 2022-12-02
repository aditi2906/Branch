import { useState, React } from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

function Admin() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const { user } = ChatState();
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !code) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      console.log(user, "first");
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const API = axios.create({ baseURL: "http://localhost:5000" });
      const { data } = await API.post(
        "/api/admin/login",
        { name, code },
        config
      );
      console.log(user, "first");
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(data, "great");
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="10px">
      <FormControl id="name" isRequired>
        <FormLabel>Enter name</FormLabel>
        <InputGroup size="md">
          <Input
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Entry code</FormLabel>
        <InputGroup size="md">
          <Input
            onChange={(e) => setCode(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
}

export default Admin;
