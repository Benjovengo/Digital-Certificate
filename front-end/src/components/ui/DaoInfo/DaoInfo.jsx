import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './DaoInfo.css' // CSS Style
import { fetchDaoParams } from '../../../scripts/governance/dao-parameters';
import { addProposal } from '../../../scripts/governance/propose';
import { fetchActiveProposals } from '../../../scripts/governance/active-proposals';
import { castVote } from '../../../scripts/governance/vote';

/**
 * DAO Information/Parameters
 * 
 * @returns Display the parameters of the DAO
 */
const DaoInfo = () => {
  // Hooks
  const [magnitude, setMagnitude] = useState(0); // Magnitude of the education
  const [weights, setWeights] = useState([0, 0, 0]) // Weights for the certification levels. Indices - 0: novice; 1: intermediate; 2: expert
  const [proposalIds, setProposalIds] = useState(null) // Array with the active proposal Ids

  
  // Change in magnitude
  const handleMagnitudeChange = (event) => {
    setMagnitude(event.target.value);
  };


  /**
   * Load the proposals
   */
  const activeProposalsList = async () => {
    const proposalsObject = await fetchActiveProposals()
    setProposalIds(proposalsObject)
  }
  useEffect( () => {
    // useState is asynchronous, right?
    // document.get...
    if (proposalIds !== null) {
      const selectElement = document.getElementById("proposalSelect")
      selectElement.innerHTML = ''
      for (let i = 0; i < proposalIds.length; i++) {
        const option = document.createElement("option")
        option.value = proposalIds[i]['id']
        option.text = proposalIds[i]['desc'];
        selectElement.appendChild(option)
      }
    }
  }, [proposalIds])



  /**
   * Load the DAO parameters
   */
  const params = async () => {
    const weight = await fetchDaoParams()
    setWeights(weight)
  }
  useEffect( () => {
    params()
    activeProposalsList()
  }, [])



  const handleSubmitProposal = async (e) => {
    e.preventDefault()
    const functionToCall = e.target.functionToCall.value
    const weight1 = Number(e.target.weight1.value)
    const weight2 = Number(e.target.weight2.value)
    const weight3 = Number(e.target.weight3.value)
    const args = [1, weight2]
    const description = e.target.description.value
    addProposal(functionToCall, args, description)
  }


  const handleSubmitVote = async (e) => {
    e.preventDefault()
    const inputProposalId = e.target.proposalSelect.value
    const inputVote = e.target.vote.value
    const inputReason = e.target.voteReason.value
    // Vote
    castVote(inputProposalId, inputVote, inputReason)

    /* console.log('Proposal Id: ', e.target.proposalSelect.value)
    console.log('Vote yes: ', e.target.vote.value)
    console.log('Reason: ', e.target.voteReason.value) */
  }

  /**
   * Return the page elements based on the ExpertiseClusters smart contract
   */
  return (
    <>
      <section className='dao__wrapper'>
        <Container fluid>
          <Row>
            <Col>
              <h1>Dao Information</h1>
              <h2>Expertise Levels</h2>
              <h2>Your Expertise</h2>
              <div>Expertise Threshold: {weights[0]}, {weights[1]}, {weights[2]} </div>
            </Col>
          </Row>
          {/** Add proposal */}
          <Row>
            <Col>
              <h2>Add proposal</h2>
              <form onSubmit={handleSubmitProposal}>
                <label htmlFor="functionToCall">Function </label>
                <select id="functionToCall" name="functionToCall">
                  <option value="storeExpertiseThreshold">Change Expertise Threshold</option>
                </select>
                <label htmlFor="weight1">Weight 1 </label>
                <input type="number" id="weight1" name="weight1" defaultValue={1}/>
                <label htmlFor="weight2">Weight 2 </label>
                <input type="number" id="weight2" name="weight2" defaultValue={1}/>
                <label htmlFor="weight3">Weight 3 </label>
                <input type="number" id="weight3" name="weight3" defaultValue={1}/>
                <label htmlFor="description">Description </label>
                <input type="text" id="description" name="description" placeholder='Describe action to be proposed.' defaultValue={'DEBUG'}/>
                <button type='submit'>Add proposal</button>
              </form>
            </Col>
          </Row>
          {/** Vote in a proposal */}
          <Row>
            <Col>
              <h2>Vote</h2>
              <form onSubmit={handleSubmitVote}>
                <label htmlFor="vote">Vote:</label>
                <select name="proposalSelect" id="proposalSelect"></select>
                <select id="vote" name="vote">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                  <option value="2">Abstain</option>
                </select>
                <label htmlFor="voteReason">Reason </label>
                <input type="text" id="voteReason" name="voteReason"/>
                <button type='submit'>Vote</button>
              </form>
            </Col>
          </Row>
          {/* Slider to control the width of the div. */}
          <Row>
            <Col>
              <input type="range" min="0" max="10" value={magnitude} onChange={handleMagnitudeChange} />
              <div style={{width: magnitude * 25}}>
                This is a rectangle with width {magnitude * 25}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default DaoInfo