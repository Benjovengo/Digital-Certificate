import React, { useLayoutEffect } from 'react'

import DaoInfo from '../components/ui/DaoInfo/DaoInfo';
import ExpertiseLevel from '../components/ui/ExpertiseLevel/ExpertiseLevel';

/**
 * Governance
 * 
 * @returns Governance Page
 */
const Governance = () => {

  /** Start the page at the top */
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  });

  
  return (
    <>
      <ExpertiseLevel/>
      <DaoInfo/>
    </>
  )
}

export default Governance