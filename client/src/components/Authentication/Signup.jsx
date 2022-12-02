import { React, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => {
    setShow(!show);
  };

  const imageRef = useRef();
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
    handleUpload();
  };
  const handleUpload = async (e) => {
    console.log("hey");
    e.preventDefault();

    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);

      try {
        console.log("uouo");
        const API = axios.create({ baseURL: "http://localhost:5000" });
        const { data } = API.post(`/upload`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const postDetails = (pics) => {
    if (pic === undefined) {
      toast({
        title: "Please upload image",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !code) {
      toast({
        title: "Fill name and suitable code",
        status: "success",
        duration: 6000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const API = axios.create({ baseURL: "http://localhost:5000" });

      const { data } = await API.post(
        "/api/user",
        {
          name,
          code,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      navigate("/adminChat");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "User with this code might be existing",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setPicLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="id" isRequired>
        <FormLabel>Code</FormLabel>
        <InputGroup size="md">
          <Input
            value={code}
            type={show ? "text" : "password"}
            placeholder="Enter Code"
            onChange={(e) => setCode(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept=".png, .jpg, .jpeg"
          name="photo"
          ref={imageRef}
          onChange={onImageChange}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;
