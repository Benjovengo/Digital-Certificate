import React from 'react'

import './VotingProposals.css'


const VotingProposals = ( {proposalStatus, proposalDescription, proposalFunction, proposalArgs }) => {
  return (
    <>
      <div>VotingProposals</div>
      <p>Status: {proposalStatus}</p>
      <p>Description: {proposalDescription}</p>
      <p>Function called: {proposalFunction}</p>
      <p>Arguments: {proposalArgs}</p>
    </>
  )
}

export default VotingProposals