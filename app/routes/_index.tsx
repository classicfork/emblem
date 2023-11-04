import { Link as ScrollLink } from "@remix-run/react";
import { Box, Button, Link, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function IndexRoute() {
  return (
    <Box className="content text-center mt-80 mb-80">
      <Box marginBottom={80}>
        <img src={"emblem-home.png"} alt={"emblem-logo"} className="block mr-auto ml-auto w-1/4" />
        <Typography marginBottom={2}>It's good to see you again</Typography>
        <Button variant="outlined"> 
          <Link target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfASM7dvV7unmAE30ATXFHvBIbE8Ag7cjOY8dvOZbZVzwL-Hw/viewform" underline="none">Join Waitlist</Link>
        </Button>
        {/* <Box marginTop={"14%"}>
            <ScrollLink to="#aboutEmblem">
              <KeyboardArrowDownIcon fontSize="large" className="hover:text-gray-400" />
            </ScrollLink>
        </Box> */}
      </Box>
      <div id="aboutEmblem" style={{marginBottom: 60}}>
        <Typography marginBottom={2} variant="h3">Create, preserve, and share a legacy</Typography>
        <Typography marginBottom={3}>Collaborative. Dynamic. Simple.</Typography>
        <img src={"smart-phone-layout.png"} alt={"Smart Phone Layout"} className="block mr-auto ml-auto w-1/6" />
      </div>
    </Box>
  );
}