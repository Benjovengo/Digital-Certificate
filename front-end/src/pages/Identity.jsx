import React, { useLayoutEffect } from 'react'

// TEMP
import Cryptography from '../components/ui/Cryptography/Cryptography'
import CreateId from '../components/ui/CreateID/CreateId'

const Identity = () => {

  /** Start the page at the top */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });

  return (
    <>
      <div>Identity</div>
      <CreateId />
      <Cryptography />
    </>
  )
}

export default Identity