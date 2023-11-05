import { Box, Typography, Button } from "@mui/material";

export default function ProductsRoute() {
  return (
    <div className="content text-center">
      <Box className="inline-flex ">
        <Box className="shadow-md my-20 mr-0 ml-20">
          <Box width={375} height={350} marginBottom={5} style={{ background: 'url(vine-background-small.png)', backgroundSize: '100%' }}>
            <img src={'emblem-bronze.png'} alt="Emblem-Logo" style={{ transform: 'scale(0.2)' }} />
            <Box display={'inline-flex'} >
              <Typography color={"rgb(0, 127, 255)"} variant={"h3"} fontWeight={700} letterSpacing={0.2} fontSize={'2.25rem'} marginTop={1} lineHeight={1.2}>$4.99</Typography>
              <Typography variant={"body2"} paragraph={true} fontWeight={400} letterSpacing={0} fontSize={'0.875rem'} lineHeight={1.5} marginTop={2.5} marginLeft={0.5}>month</Typography>
            </Box>
          </Box>
          <Box padding={3}>
            <Button variant="contained" style={{ backgroundColor: 'rgb(49, 151, 254)', width: '60%' }}>Buy now</Button>
            <Box marginTop={2}>
              <Typography variant={"h6"} fontWeight={700}>Bronze Tier</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Memorial Photo</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Obituary</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Unlimited Links</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}># Stories</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>No visits</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="shadow-md my-20 mx-20">
          <Box width={375} height={350} marginBottom={5} style={{ background: 'url(vine-background-small.png)' }}>
            <img src={'emblem-silver.png'} alt="Emblem-Logo" style={{ transform: 'scale(0.2)' }} />
            <Box display={'inline-flex'}>
              <Typography color={"rgb(0, 127, 255)"} variant={"h3"} fontWeight={700} letterSpacing={0.2} fontSize={'2.25rem'} marginTop={1} lineHeight={1.2}>$9.99</Typography>
              <Typography variant={"body2"} paragraph={true} fontWeight={400} letterSpacing={0} fontSize={'0.875rem'} lineHeight={1.5} marginTop={2.5} marginLeft={0.5}>month</Typography>
            </Box>
          </Box>
          <Box padding={3}>
            <Button variant="contained" style={{ backgroundColor: 'rgb(49, 151, 254)', width: '60%' }}>Buy now</Button>
            <Box marginTop={2}>
              <Typography variant={"h6"} fontWeight={700}>Silver Tier</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Memorial Photo</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Obituary</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Unlimited Links</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}># Stories</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>No visits</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="shadow-md my-20 mr-20 ml-0">
          <Box width={375} height={350} marginBottom={5} style={{ background: 'url(vine-background-small.png)', backgroundSize: '100%' }}>
            <img src={'emblem-gold.png'} alt="Emblem-Logo" style={{ transform: 'scale(0.2)' }} />
            <Box display={'inline-flex'}>
              <Typography color={"rgb(0, 127, 255)"} variant={"h3"} fontWeight={700} letterSpacing={0.2} fontSize={'2.25rem'} marginTop={1} lineHeight={1.2}>$14.99</Typography>
              <Typography variant={"body2"} paragraph={true} fontWeight={400} letterSpacing={0} fontSize={'0.875rem'} lineHeight={1.5} marginTop={2.5} marginLeft={0.5}>month</Typography>
            </Box>
          </Box>
          <Box padding={3}>
            <Button variant="contained" style={{ backgroundColor: 'rgb(49, 151, 254)', width: '60%' }}>Buy now</Button>
            <Box marginTop={2}>
              <Typography variant={"h6"} fontWeight={700}>Gold Tier</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Memorial Photo</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Obituary</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Unlimited Links</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Unlimited Stories</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>Unlimited Visits</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}