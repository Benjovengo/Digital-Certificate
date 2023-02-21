import React from 'react'
import { Row, Col } from "reactstrap"

import { queueAndExecute } from '../../../scripts/governance/queue-and-execute'

import './ExecutingProposals.css'


const ExecutingProposals = ( props ) => {

  const proposalId = props['item']['id']
  const proposalDescription = props['item']['desc']
  const proposalFunction = props['item']['func']
  const proposalArgs = props['item']['args']


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
    // const inputProposalId = e.target.selectExecuteProposal.value
    // Queue and Execute proposal
    queueAndExecute(proposalId)
  }
  

  return (
    <>
      <div className="proposal__wrapper">
        <Row>
          <Col>
            <h6><span>Proposal description</span></h6>
            <h4>{proposalDescription}</h4>
            <p>Id: {proposalId}</p>
            <p>Function: <span>{proposalFunction}</span></p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col className='col-auto'>
            
            {(proposalFunction === 'storeExpertiseThreshold')?
              <>
                <table>
                  <thead>
                    <tr>
                      <td colspan="2">Expertise Thresholds</td>
                    </tr>
                    <tr>
                      <td colspan="2"><span>in percentages of the maximum number of points</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Intermediate level</td>
                      <td>{proposalArgs[0]}%</td>
                    </tr>
                    <tr>
                      <td>Expert level</td>
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
                      <td colspan="2">Certification weights<br/><span>the weight of each certification level</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bachelor degree</td>
                      <td style={{textAlign: "center"}}>{proposalArgs[0]}</td>
                    </tr>
                    <tr>
                      <td>Masters degree</td>
                      <td style={{textAlign: "center"}}>{proposalArgs[1]}</td>
                    </tr>
                    <tr>
                      <td>Doctoral degree</td>
                      <td style={{textAlign: "center"}}>{proposalArgs[2]}</td>
                    </tr>
                    <tr>
                      <td>Postdoctoral degree</td>
                      <td style={{textAlign: "center"}}>{proposalArgs[3]}</td>
                    </tr>
                  </tbody>
                </table>
              </>}
          </Col>
          <Col>
            <form className='submit__form' onSubmit={handleSubmitExecution}>
              <div className="submit__wrapper">
                <Row>
                  <Col className="text-center">
                    <button className='execute__button' type='submit'>Execute</button>
                  </Col>
                </Row>
              </div>
            </form>
          </Col>
        </Row>

      </div>
    </>
  )
}

export default ExecutingProposals