import React, { useLayoutEffect } from 'react'

import CreateCertification from '../components/ui/CreateCertification/CreateCertification';

const Certifications = () => {

  /** Start the page at the top */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });


  return (
    <>
      <div>Certifications</div>
      <CreateCertification />
    </>
  )
}

export default Certifications