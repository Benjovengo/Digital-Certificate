import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap"

import './ExpertiseLevel.css' // CSS Style

// Blockchain integration
import { fetchCertificatesList, fetchCertificateJSON } from '../../../scripts/certificates/fetchCertificate';
import { addProposal } from '../../../scripts/governance/propose'
import { fetchExpertiseParams } from '../../../scripts/governance/expertise-parameters'
import { fetchActiveProposals } from '../../../scripts/governance/active-proposals'
import VotingProposals from '../VotingProposals/VotingProposals'
import ExecutingProposals from '../ExecutingProposals/ExecutingProposals'


/**
 * React component
 * 
 * @returns React component
 * @dev The elements of the component are based
 *      on the ExpertiseClusters smart contract
 */
const ExpertiseLevel = () => {
  /**
   * Definitions
   */
  // Hooks
  const [expertiseLevels, setExpertiseLevels] = useState([0, 0, 0]) // thresholds for the certification levels. Indices - 0: novice; 1: intermediate; 2: expert
  const [expertiseLevelsProposal, setExpertiseLevelsProposal] = useState([0, 0, 0]) // thresholds for the certification levels. Indices - 0: novice; 1: intermediate; 2: expert
  const [votingProposalIds, setVotingProposalIds] = useState(null) // Array with the active proposal Ids
  const [executingProposalIds, setExecutingProposalIds] = useState(null) // Array with the active proposal Ids
  const [maximumPoints, setMaximumPoints] = useState(0) // Theoretical maximum number of points using the blockchain values
  const [userPoints, setUserPoints] = useState(0) // Number of points for the combination of the user's certificates and the current weights
  const [maximumPointsProposal, setMaximumPointsProposal] = useState(0) // Theoretical maximum number of points for the proposal
  const [expertiseFunction, setExpertiseFunction] = useState('storeExpertiseThreshold')
  // Hooks to sliders and inputs
  // Thresholds
  const [threshold01, setThreshold01] = useState(0);
  const [threshold02, setThreshold02] = useState(0);
  const [threshold03, setThreshold03] = useState(0);
  // Weights of each academic degree
  const [weight01, setWeight01] = useState(1);
  const [weight02, setWeight02] = useState(2);
  const [weight03, setWeight03] = useState(4);
  const [weight04, setWeight04] = useState(8);
  

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
    // Hooks - update thresholds
    setThreshold01(thresholdPercentages[0])
    setThreshold02(thresholdPercentages[1])
    setThreshold03(thresholdPercentages[2])
    // Hooks - update weights
    setWeight01(weightParams[0])
    setWeight02(weightParams[1])
    setWeight03(weightParams[2])
    setWeight04(weightParams[3])
    // Hooks - maximum number of points
    const DEGREEmax = 15 // times 10 for first degree; times 5 for the second for the same level
    const GPAmax  = 400 // 100*GPA with 2 decimals
    const THRESHOLDmax = 100 // to compare with the thresholds
    const WEIGHTSsum = weightParams[0] + weightParams[1] + weightParams[2] + weightParams[3]
    setMaximumPoints(DEGREEmax*GPAmax*THRESHOLDmax*WEIGHTSsum)
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

  useEffect( () => {
    userCertificates()
  }, [weight01, weight02, weight03, weight04])


  /**
   * Input values and Sliders for the threshold
   */
  // Find a number in a string
  function findNumber(str) {
    var num = str.match(/[1-9]/); // search for a number between 1 and 9 in the string
    if (num !== null) { // if a number is found
      return num[0]; // return the first match (which is the number)
    } else { // if no number is found
      return -1; // return -1 as a flag value
    }
  }


  // Function handler for changes on the sliders
  const handleThresholdChanger = (event) => {
    const elementIndex = Number(findNumber(event.target.id))
    if (elementIndex!==-1){
      // const newValue = event.target.value;
      let newValue
      if (elementIndex === 1) {
        newValue = (event.target.value >= threshold02)? threshold02 : event.target.value
        setThreshold01(newValue)
      } else if (elementIndex === 2) {
        newValue = (event.target.value >= threshold03)? threshold03 : event.target.value
        setThreshold02(newValue)
      } else if (elementIndex === 3) {
        newValue = (event.target.value >= 100)? 100 : event.target.value
        setThreshold03(newValue)
      }
    }
  }


  /**
   * Input values and Sliders for the weights
   */
  // Function handler for changes on the sliders
  const handleWeightSliderChange = (event) => {
    const elementIndex = findNumber(event.target.id)
    if (elementIndex!==-1){
      const newValue = event.target.value;
      eval('setWeight0' + elementIndex + '(' + newValue + ')')
    }
  }
  // Function handler for changes on the inputs
  const handleWeightInputChange = (event) => {
    const elementIndex = findNumber(event.target.id)
    const newValue = event.target.value;
    if (newValue>20) {
      event.target.value = 20
    }
    if (elementIndex!==-1){
      eval('setWeight0' + elementIndex + '(' + newValue + ')')
    }
  }


  const maximumProposal = () => {
    // Hooks - maximum number of points
    const DEGREEmax = 15 // times 10 for first degree; times 5 for the second for the same level
    const GPAmax  = 400 // 100*GPA with 2 decimals
    const THRESHOLDmax = 100 // to compare with the thresholds
    const WEIGHTSsum = weight01 + weight02 + weight03 + weight04
    setMaximumPointsProposal(DEGREEmax*GPAmax*THRESHOLDmax*WEIGHTSsum)
    // Hooks - levels of expertise according to this proposal
    const basePoints = DEGREEmax*GPAmax*WEIGHTSsum
    setExpertiseLevelsProposal([threshold01*basePoints, threshold02*basePoints, threshold03*basePoints])
  }


  // Limit the thresholds based on the upper levels
  const limitThresholds = () => {
    if (threshold01>=threshold02){
      setThreshold01(threshold02)
    }
    if (threshold02>=threshold03){
      setThreshold02(threshold03)
    }
    if (threshold03>=100){
      setThreshold03(100)
    }
  }
  useEffect(()=>{
    limitThresholds()
    maximumProposal()
  },[threshold01, threshold02, threshold03])


  // Limit the thresholds based on the upper levels
  const limitWeights = () => {
    if (weight01>=weight02){
      setWeight01(weight02)
    }
    if (weight02>=weight03){
      setWeight02(weight03)
    }
    if (weight03>=weight04){
      setWeight03(weight04)
    }
  }
  useEffect(()=>{
    limitWeights()
  },[weight01, weight02, weight03, weight04])



  /**
   * Set the function to be called on submitting new proposal
   * 
   * @param {event} event Event value for the select element
   */
  const proposalArguments = (event) => {
    setExpertiseFunction(event.target.value)
  }


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
      const novice = Number(e.target.threshold01input.value)
      const intermediate = Number(e.target.threshold02input.value)
      const expert = Number(e.target.threshold03input.value)
      args = [novice, intermediate, expert]
    } else {
      const weight1 = Number(e.target.weight01input.value)
      const weight2 = Number(e.target.weight02input.value)
      const weight3 = Number(e.target.weight03input.value)
      const weight4 = Number(e.target.weight04input.value)
      args = [weight1, weight2, weight3, weight4]
    }
    const description = e.target.description.value

    // Submit new proposal
    await addProposal(functionToCall, args, description)
  }


  /** Get the degrees for the certificates owned by the logged address
    * 
    */
  const userCertificates = async () => {
    const list = await fetchCertificatesList() // list of certificates for the logged account
    
    let points = 0
    let numberOfCertificates = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // placeholder for the number of degrees for each level
    let JSON // placeholder for the TokenURI

    // loop through all the certificates
    for (let i = 0; i < list.length; i++) {
      JSON = await fetchCertificateJSON(list[i])
      const certificateDegree = Number(JSON.degree)
      const certificateGPA = Number(JSON.gpa)

      if (certificateDegree === 1 || certificateDegree === 2) {
        points += (certificateGPA * 100) * weight01 * 100
      } else if (certificateDegree === 3 || certificateDegree === 4) {
        points += 3 * (certificateGPA * 100) * weight02 * 100
      } else if (certificateDegree > 4 && certificateDegree < 10) {
        points += 7 * (certificateGPA * 100) * weight03 * 100
      } else if (certificateDegree === 10) {
        points += 10 * 400 * weight04 * 100
      }

      numberOfCertificates[certificateDegree-1] += 1

    }

    console.log('Number of points:', points)
    console.log('Number of certificates:', numberOfCertificates)
  }


  // Components for the ui
  return (
    <>
      <section className='dao__wrapper'>
        <Container fluid>
          {/** Header */}
          <Row>
            <Col>
              <h1>Expertise</h1>
              <p>Your grades (GPA) are what matters for voting power! Study hard!</p>
            </Col>
          </Row>

          {/** Levels of Expertise */}
          <Row className='row__wrapper mb-5 align-items-start'>
            
            <Col xs="9">
              {/** Bar chart */}
              <Row className='mb-5'>
                <Col>
                  <h2>Levels of Expertise - Blockchain Values</h2>
                  <h5>Blockchain current thresholds</h5>
                  <div className='containerStyles'>
                    <div className="App">
                      <div className='fillerStyles jediBar' style={{width: 100 + "%"}}>
                        <span className='labelStyles'>Jedi</span>
                      </div>
                      <div className='fillerStyles expertBar' style={{width: expertiseLevels[2]/maximumPoints*100 + "%"}}>
                        <span className='labelStyles'>Expert</span>
                      </div>
                      <div className='fillerStyles intermediateBar' style={{width: expertiseLevels[1]/maximumPoints*100 + "%"}}>
                        <span className='labelStyles'>Intermediate</span>
                      </div>
                      <div className='fillerStyles noviceBar' style={{width: expertiseLevels[0]/maximumPoints*100 + "%"}}>
                        <span className='labelStyles'>Novice</span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <table className='table__settings mt-2'>
                <thead>
                  <tr>
                  <th>Threshold</th>
                  <th>Points</th>
                  <th>Percentages</th>
                  <th style={{paddingLeft: '6em', textAlign: 'center'}}>Maximum number of points</th>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Novice to Intermediate</td>
                    <td align='right'>{expertiseLevels[0].toLocaleString()}</td>
                    <td align='right' style={{textAlign: 'center'}}>{(expertiseLevels[0]/maximumPoints*100).toFixed(2)}%</td>
                    <td style={{paddingLeft: '6em', textAlign: 'center'}}>{maximumPoints.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Intermediate to Expert</td>
                    <td align='right'>{expertiseLevels[1].toLocaleString()}</td>
                    <td align='right' style={{textAlign: 'center'}}>{(expertiseLevels[1]/maximumPoints*100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Expert to Jedi Master</td>
                    <td align='right'>{expertiseLevels[2].toLocaleString()}</td>
                    <td align='right' style={{textAlign: 'center'}}>{(expertiseLevels[2]/maximumPoints*100).toFixed(2)}%</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col>
              <h2>Information</h2>
              <h5>Maximum Number of Points</h5>
              <p><i>The theoretical maximum value considers the values of the weights for each degree level as well as the limits on the number of certifications for each level one can have.</i></p>
              <h5>Thresholds</h5>
              <p><i>The thresholds are defined as a percentage of the maximum theoretical number of points. These values are preserved when changing the weights for the different degree levels.</i></p>
            </Col>
          </Row>

          {/** Add proposal */}
          <Row>
            <Col>
              <h2>Add proposal</h2>
              <form onSubmit={handleSubmitProposal}>
                
                <div className="add__proposal__wrapper">
                  <div className='proposal__function'>
                    <Row>
                      <Col className='col-auto'>
                        <label htmlFor="functionToCall">Select Function</label>
                      </Col>
                      <Col> 
                        <select className='select__function' id="functionToCall" name="functionToCall" onChange={proposalArguments} >
                          <option value="storeExpertiseThreshold">Change expertise thresholds</option>
                          <option value="storeCertificateWeight">Change the weights for each of the academic degrees</option>
                        </select>
                      </Col>
                    </Row>
                  </div>

                  {/** Arguments */}
                  {(expertiseFunction === 'storeExpertiseThreshold')? <div className="change__parameters__wrapper">
                    <h4>Proposal - Change Expertise Thresholds</h4>
                    <Row className='expertise__proposal__plot'>
                      <Col>
                        <p>Thresholds for the Different Expertise Levels</p>
                        <div className='containerStyles'>
                          <div className="App">
                          <div className='fillerStyles jediBar' style={{width: 100 + "%"}}>
                              <span className='labelStyles'>Jedi</span>
                            </div>
                            <div className='fillerStyles expertBar' style={{width: threshold03 + "%"}}>
                              <span className='labelStyles'>Expert</span>
                            </div>
                            <div className='fillerStyles intermediateBar' style={{width: threshold02 + "%"}}>
                              <span className='labelStyles'>Intermediate</span>
                            </div>
                            <div className='fillerStyles noviceBar' style={{width: threshold01 + "%"}}>
                              <span className='labelStyles'>Novice</span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <table className='table__input__settings'>
                          <tbody>
                            <tr>
                              <td><label htmlFor="threshold01input">Intermediate lower limit</label></td>
                              <td><input id='threshold01slider' type="range" min="0" max="98" value={threshold01} onChange={handleThresholdChanger} /></td>
                              <td><input id='threshold01input' type="number" min="0" max="98" value={threshold01} onChange={handleThresholdChanger} /></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="threshold02input">Expert lower limit</label></td>
                              <td><input id='threshold02slider' type="range" min="0" max="99" value={threshold02} onChange={handleThresholdChanger} /></td>
                              <td><input id='threshold02input' type="number" min="0" max="99" value={threshold02} onChange={handleThresholdChanger} /></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="threshold03input">Jedi lower limit</label></td>
                              <td><input id='threshold03slider' type="range" min="0" max="100" value={threshold03} onChange={handleThresholdChanger} /></td>
                              <td><input id='threshold03input' type="number" min="0" max="100" value={threshold03} onChange={handleThresholdChanger} /></td>
                            </tr>
                            <tr>
                              <td colSpan="3">
                                <label htmlFor="description">Description </label>
                                <input type="text" id="description" name="description" placeholder='Describe action to be proposed.'/>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col>
                        <table className='table__input__settings  mt-1'>
                          <thead>
                            <tr>
                              <td>Thresholds</td>
                              <td>Points</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>From novice to intermediate:</td>
                              <td>{(threshold01*maximumPoints/100).toLocaleString()} points</td>
                            </tr>
                            <tr>
                              <td>From intermediate to expert:</td>
                              <td>{(threshold02*maximumPoints/100).toLocaleString()} points</td>
                            </tr>
                            <tr>
                              <td>From expert to a jedi master:</td>
                              <td>{(threshold03*maximumPoints/100).toLocaleString()} points</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </div> : <div className="change__parameters__wrapper">
                    <h4>Proposal - Change Certifications Weight</h4>
                    <Row className='expertise__proposal__plot'>
                      <Col>
                        <p>Contribution of each certification level for one certification per level</p>
                        <div className='containerStyles'>
                          <div className="App">
                          <div className='fillerStyles postdoctoralBar' style={{width: 100 + "%"}}>
                              <span className='labelStyles'>Postdoctoral</span>
                            </div>
                            <div className='fillerStyles doctoralBar' style={{width: 100*weight01/(weight01+weight02+weight03+weight04)+100*weight02/(weight01+weight02+weight03+weight04)+100*weight03/(weight01+weight02+weight03+weight04) + "%"}}>
                              <span className='labelStyles'>Doctoral</span>
                            </div>
                            <div className='fillerStyles mastersBar' style={{width: 100*weight01/(weight01+weight02+weight03+weight04)+100*weight02/(weight01+weight02+weight03+weight04) + "%"}}>
                              <span className='labelStyles'>Masters</span>
                            </div>
                            <div className='fillerStyles bachelorBar' style={{width: 100*weight01/(weight01+weight02+weight03+weight04) + "%"}}>
                              <span className='labelStyles'>Bachelor</span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <table className='table__input__settings'>
                          <tbody>
                            <tr>
                              <td><label htmlFor="weight01input">Bachelor Degree:</label></td>
                              <td><input id='weight01slider' type="range" min="0" max="20" value={weight01>=weight02? weight02:weight01} onChange={handleWeightSliderChange} /></td>
                              <td><input id='weight01input' type="number" min="0" max="20" value={weight01>=weight02? weight02:weight01} onChange={handleWeightInputChange} /></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="weight02input">Masters Degree:</label></td>
                              <td><input id='weight02slider' type="range" min="0" max="20" value={weight02>=weight03? weight03:weight02} onChange={handleWeightSliderChange} /></td>
                              <td><input id='weight02input' type="number" min="0" max="20" value={weight02>=weight03? weight03:weight02} onChange={handleWeightInputChange} /></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="weight03input">Doctoral Degree:</label></td>
                              <td><input id='weight03slider' type="range" min="0" max="20" value={weight03>=weight04? weight04:weight03} onChange={handleWeightSliderChange} /></td>
                              <td><input id='weight03input' type="number" min="0" max="20" value={weight03>=weight04? weight04:weight03} onChange={handleWeightInputChange} /></td>
                            </tr>
                            <tr>
                              <td><label htmlFor="weight04input">Postdoctoral Degree:</label></td>
                              <td><input id='weight04slider' type="range" min="0" max="20" value={weight04} onChange={handleWeightSliderChange} /></td>
                              <td><input id='weight04input' type="number" min="0" max="20" value={weight04} onChange={handleWeightInputChange} /></td>
                            </tr>
                            <tr>
                              <td colSpan="3">
                                <label htmlFor="description">Description </label>
                                <input type="text" id="description" name="description" placeholder='Describe action to be proposed.'/>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                      <Col>
                        <table className='table__input__settings  mt-1'>
                          <thead>
                            <tr>
                              <td>Thresholds</td>
                              <td>Points</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>From novice to intermediate:</td>
                              <td>{(threshold01*maximumPoints).toLocaleString()} points</td>
                            </tr>
                            <tr>
                              <td>From intermediate to expert:</td>
                              <td>{(threshold02*maximumPoints).toLocaleString()} points</td>
                            </tr>
                            <tr>
                              <td>From expert to a jedi master:</td>
                              <td>{(threshold03*maximumPoints).toLocaleString()} points</td>
                            </tr>
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </div>
                  }                  
                  <div className="submit__wrapper">
                    <Row>
                      <Col className="text-center">
                        <button className='submit__button' type='submit'>Add proposal</button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </form>
            </Col>
          </Row>

          {/** Vote in a proposal */}
          <Row>
            <Col>
              <h2>Opened for voting</h2>
              {(votingProposalIds===null)? <></> : votingProposalIds.map((item, index) => (
                <VotingProposals key={index} item={item} />
                ))}
            </Col>
          </Row>

          {/** Execute an approved proposal */}
          <Row>
            <Col>
              <h2>Execute approved proposals</h2>
              {(executingProposalIds===null)? <></> : executingProposalIds.map((item, index) => (
                <ExecutingProposals key={index} item={item} />
                ))}
            </Col>
          </Row>
          
        </Container>
      </section>
    </>
  )
}

export default ExpertiseLevel