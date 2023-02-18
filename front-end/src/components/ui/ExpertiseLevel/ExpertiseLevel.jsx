import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap"

import './ExpertiseLevel.css' // CSS Style

import { addProposal } from '../../../scripts/governance/propose'
import { castVote } from '../../../scripts/governance/vote'
import { queueAndExecute } from '../../../scripts/governance/queue-and-execute'
import { fetchExpertiseParams } from '../../../scripts/governance/expertise-parameters'
import { fetchActiveProposals } from '../../../scripts/governance/active-proposals'


/**
 * React component
 * 
 * @returns React component
 *  @ dev The elements of the component are based
 *        on the ExpertiseClusters smart contract
 */
const ExpertiseLevel = () => {
  /**
   * Definitions
   */
  // Hooks
  const [expertiseLevels, setExpertiseLevels] = useState([0, 0, 0]) // thresholds for the certification levels. Indices - 0: novice; 1: intermediate; 2: expert
  const [votingProposalIds, setVotingProposalIds] = useState(null) // Array with the active proposal Ids
  const [executingProposalIds, setExecutingProposalIds] = useState(null) // Array with the active proposal Ids
  

  /**
   * Fetch the active proposals
   * 
   * @dev Active for voting: status of the proposal = 1
   * @dev Active for executing: status of the proposal = 4
   */
  const activeProposalsList = async () => {
    const activeForVoting = 1
    const votingProposalsObject = await fetchActiveProposals(activeForVoting)
    setVotingProposalIds(votingProposalsObject)
    const activeForExecuting = 4
    const executingProposalsObject = await fetchActiveProposals(activeForExecuting)
    setExecutingProposalIds(executingProposalsObject)
  }


  /**
   * Refresh elements on changing states
   */
  useEffect( () => {
    if (votingProposalIds !== null) {
      const selectElement = document.getElementById("proposalSelect")
      selectElement.innerHTML = ''
      for (let i = 0; i < votingProposalIds.length; i++) {
        const option = document.createElement("option")
        option.value = votingProposalIds[i]['id']
        option.text = votingProposalIds[i]['desc'];
        selectElement.appendChild(option)
      }
    }
    if (executingProposalIds !== null) {
      const selectExecute = document.getElementById("selectExecuteProposal")
      selectExecute.innerHTML = ''
      for (let i = 0; i < executingProposalIds.length; i++) {
        const option = document.createElement("option")
        option.value = executingProposalIds[i]['id']
        option.text = executingProposalIds[i]['desc'];
        selectExecute.appendChild(option)
      }
    }
  }, [votingProposalIds, executingProposalIds])


  /**
   * Load the expertise parameters
   * 
   * @dev The expertise parameter are the array with
   *      the thresholds for the levels of expertise
   */
  const expertiseParams = async () => {
    const expertise = await fetchExpertiseParams()
    const thresholdParams = expertise[0]
    const thresholdPercentages = expertise[1]
    const weightParams = expertise[2]
    setExpertiseLevels(thresholdParams)
    // Update input values
    document.getElementById('threshold1').value = thresholdPercentages[0]
    document.getElementById('threshold2').value = thresholdPercentages[1]
    document.getElementById('threshold3').value = thresholdPercentages[2]
    /// WEIGHTS
    document.getElementById('weight1').value = weightParams[0]
    document.getElementById('weight2').value = weightParams[1]
    document.getElementById('weight3').value = weightParams[2]
    document.getElementById('weight4').value = weightParams[3]
  }


  /**
   * Update the ui with the parameters from the
   * ExpertiseClusters smart contract
   * 
   * @dev The last brackets is empty to automatically
   *      update on entering the page only
   */
  useEffect( () => {
    expertiseParams()
    activeProposalsList()
  }, [])


  /**
   * Submit proposal
   * 
   * @param {event} e Submitting form event
   * @dev The event has all the information about the
   *      submission of all the fields inside the form
   */
  const handleSubmitProposal = async (e) => {
    e.preventDefault()

    let args
    // Get values from the component's input fields
    const functionToCall = e.target.functionToCall.value
    // Parse arguments
    if (functionToCall==='storeExpertiseThreshold') {
      const threshold1 = Number(e.target.threshold1.value)
      const threshold2 = Number(e.target.threshold2.value)
      const threshold3 = Number(e.target.threshold3.value)
      args = [threshold1, threshold2, threshold3]
    } else {
      const weight1 = Number(e.target.weight1.value)
      const weight2 = Number(e.target.weight2.value)
      const weight3 = Number(e.target.weight3.value)
      const weight4 = Number(e.target.weight4.value)
      args = [weight1, weight2, weight3, weight4]
    }
    const description = e.target.description.value

    // Submit new proposal
    await addProposal(functionToCall, args, description)
  }


  /**
   * Submit votes
   * 
   * @param {event} e Submitting form event
   * @dev The event has all the information about the
   *      submission of all the fields inside the form
   */
  const handleSubmitVote = async (e) => {
    e.preventDefault()
    // Get values from the component's input fields
    const inputProposalId = e.target.proposalSelect.value
    const inputVote = e.target.vote.value
    const inputReason = e.target.voteReason.value
    // Vote
    castVote(inputProposalId, inputVote, inputReason)
  }


   /**
   * Submit queue and execute for a successful proposal
   * 
   * @param {event} e Submitting form event
   * @dev The event has all the information about the
   *      submission of all the fields inside the form
   */
   const handleSubmitExecution = async (e) => {
    e.preventDefault()
    // Get values from the component's input fields
    const inputProposalId = e.target.selectExecuteProposal.value
    // Queue and Execute proposal
    queueAndExecute(inputProposalId)
  }

  // Components for the ui
  return (
    <>
      <section className='dao__wrapper'>
        <Container fluid>
          <Row>
            <Col>
              <h1>Expertise</h1>
              <h2>Levels of Expertise</h2>
              <h2>Your Expertise</h2>
              <div>Expertise Threshold: {expertiseLevels[0]}, {expertiseLevels[1]}, {expertiseLevels[2]}</div>
            </Col>
          </Row>
          {/** Add proposal */}
          <Row>
            <Col>
              <h2>Add proposal</h2>
              <form onSubmit={handleSubmitProposal}>
                <label htmlFor="functionToCall">Function </label>
                <select id="functionToCall" name="functionToCall">
                  <option value="storeExpertiseThreshold">Change expertise threshold</option>
                  <option value="storeCertificateWeight">Change the weights for the academic degrees</option>
                </select>
                <p>Weights: from 0 to 20</p>
                <p>Threshold: from o to 100%</p>
                <label htmlFor="threshold1">Threshold 1 </label>
                <input type="number" id="threshold1" name="threshold1" defaultValue={1}/>
                <label htmlFor="threshold2">Threshold 2 </label>
                <input type="number" id="threshold2" name="threshold2" defaultValue={1}/>
                <label htmlFor="threshold3">Threshold 3 </label>
                <input type="number" id="threshold3" name="threshold3" defaultValue={1}/>
                <label htmlFor="description">Description </label>
                <label htmlFor="weight1">Weight 1 </label>
                <input type="number" id="weight1" name="weight1" defaultValue={1}/>
                <label htmlFor="weight2">Weight 2 </label>
                <input type="number" id="weight2" name="weight2" defaultValue={1}/>
                <label htmlFor="weight3">Weight 3 </label>
                <input type="number" id="weight3" name="weight3" defaultValue={1}/>
                <label htmlFor="weight4">Weight 4 </label>
                <input type="number" id="weight4" name="weight4" defaultValue={1}/>
                <label htmlFor="description">Description </label>
                <input type="text" id="description" name="description" placeholder='Describe action to be proposed.'/>
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
          {/** Queue and Execute */}
          <Row>
            <Col>
              <h2>Queue and Execute</h2>
              <form onSubmit={handleSubmitExecution}>
                <label htmlFor="selectExecuteProposal">Execute:</label>
                <select name="selectExecuteProposal" id="selectExecuteProposal"></select>
                <button type='submit'>Execute</button>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default ExpertiseLevel