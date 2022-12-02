import React from "react";
import { Box, Container, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Admin from "../components/Authentication/Admin";
function AdminPage() {
  return (
    <Container maxW="xl" centerContent>
      <Box marginTop="30px"></Box>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        Admin panel
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabPanels>
            <TabPanel>
              <Admin />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default AdminPage;
