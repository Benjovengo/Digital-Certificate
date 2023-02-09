import React, { useLayoutEffect } from 'react'

import HeroSection from '../components/ui/HeroSection.jsx/HeroSection'


const Home = () => {


  /** Start the page at the top */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });

  return (
    <>
      <HeroSection />
    </>
  )
}

export default Home