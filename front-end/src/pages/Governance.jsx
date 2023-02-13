import React, { useLayoutEffect } from 'react'


// DEBUG - cryptography
import Cryptography from '../components/ui/Cryptography/Cryptography';



const Governance = () => {

  /** Start the page at the top */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });

  
  return (
    <>
      <h1>Governance</h1>
      <Cryptography />
    </>
  )
}

export default Governance