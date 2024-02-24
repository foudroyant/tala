'use client'
import Image from "next/image";
import { Box, PaletteMode, Typography } from "@mui/material";
import React from "react";
import Hero from "./components/Hero";
import Features from "./components/features";
import Pricing from "./components/Princing";


export default function Home() {
  
  return (
    <>
      <Hero />
      {/*<Features />*/}
      <Pricing />

      <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Typography variant="body2" color="warning" >
              Contact : stephanebazebibouta@gmail.com
          </Typography>
          </Box>
    </>
  );
}
