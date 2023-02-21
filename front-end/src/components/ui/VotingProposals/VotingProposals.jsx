import React from 'react'
import { Row, Col } from "reactstrap"

import { castVote } from '../../../scripts/governance/vote'

import './VotingProposals.css'


const VotingProposals = ( props ) => {

  const proposalId = props['item']['id']
  const proposalDescription = props['item']['desc']
  const proposalFunction = props['item']['func']
  const proposalArgs = props['item']['args']


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
    const inputVote = e.target.vote.value
    const inputReason = e.target.voteReason.value
    // Vote
    castVote(proposalId, inputVote, inputReason)
  }
  

  return (
    <>
      <div className="proposal__wrapper">
         <Row>
          <Col>
            <p><span>Proposal description</span></p>
            <h5>{proposalDescription}</h5>
            <p>Proposal Id: {proposalId}</p>
            <h6>Function called: {proposalFunction}</h6>
            {(proposalFunction === 'storeExpertiseThreshold')?
              <>
                <table>
                  <thead>
                    <tr>
                      <td colspan="2">Expertise Thresholds<br/><span>percentages of the maximum value</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Intermediate</td>
                      <td>{proposalArgs[0]}%</td>
                    </tr>
                    <tr>
                      <td>Expert</td>
                      <td>{proposalArgs[1]}%</td>
                    </tr>
                    <tr>
                      <td>Jedi Master</td>
                      <td>{proposalArgs[2]}%</td>
                    </tr>
                  </tbody>
                </table>
              </> : <>
              <table>
                  <thead>
                    <tr>
                      <td colspan="2">Certification weights<br/><span>weight of the certification level</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bachelor degree</td>
                      <td>{proposalArgs[0]}</td>
                    </tr>
                    <tr>
                      <td>Masters degree</td>
                      <td>{proposalArgs[1]}</td>
                    </tr>
                    <tr>
                      <td>Doctoral degree</td>
                      <td>{proposalArgs[2]}</td>
                    </tr>
                    <tr>
                      <td>Postdoctoral degree</td>
                      <td>{proposalArgs[3]}</td>
                    </tr>
                  </tbody>
                </table>
              </>}
          </Col>
        </Row>
        <Row>
          <Col>
            <form onSubmit={handleSubmitVote}>
              <label htmlFor="vote">Vote:</label>
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
      </div>
    </>
  )
}

export default VotingProposals