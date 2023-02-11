import React, { useLayoutEffect } from 'react'

import CreateCertificate from '../components/ui/CreateCertificate/CreateCertificate';

const Certificates = () => {

  /** Start the page at the top */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });


  return (
    <>
      <div>Certificates</div>
      <CreateCertificate />
    </>
  )
}

export default Certificates