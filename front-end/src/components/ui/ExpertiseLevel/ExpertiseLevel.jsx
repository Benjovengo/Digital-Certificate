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
  const [expertiseLevelsProposal, setExpertiseLevelsProposal] = useState([0, 0, 0]) // thresholds for the certification levels. Indices - 0: novice; 1: intermediate; 2: expert
  const [votingProposalIds, setVotingProposalIds] = useState(null) // Array with the active proposal Ids
  const [executingProposalIds, setExecutingProposalIds] = useState(null) // Array with the active proposal Ids
  const [maximumPoints, setMaximumPoints] = useState(0) // Theoretical maximum number of points using the blockchain values
  const [maximumPointsProposal, setMaximumPointsProposal] = useState(0) // Theoretical maximum number of points for the proposal
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
  const handleThresholdSliderChange = (event) => {
    const elementIndex = findNumber(event.target.id)
    if (elementIndex!==-1){
      const newValue = event.target.value;
      eval('setThreshold0' + elementIndex + '(' + newValue + ')')
    }
  }
  // Function handler for changes on the inputs
  const handleThresholdInputChange = (event) => {
    const elementIndex = findNumber(event.target.id)
    const newValue = event.target.value;
    if (newValue>100) {
      event.target.value = 100
    }
    if (elementIndex!==-1){
      eval('setThreshold0' + elementIndex + '(' + newValue + ')')
    }
  };

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
  };
  // Function handler for changes on the inputs
  const handleWeightInputChange = (event) => {
    const elementIndex = findNumber(event.target.id)
    const newValue = event.target.value;
    if (newValue>100) {
      event.target.value = 100
    }
    if (elementIndex!==-1){
      eval('setWeight0' + elementIndex + '(' + newValue + ')')
    }
  };


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
  useEffect(()=>{
    maximumProposal()
  },[threshold01, threshold02, threshold03])

  // Limit the thresholds based on the upper levels
  const limitThresholds = () => {
    if (threshold01>=threshold02){
      setThreshold01(threshold02)
    } else {
      setThreshold01(document.getElementById('threshold01input').value)
    }
    if (threshold02>=threshold03){
      setThreshold02(threshold03)
    } else {
      setThreshold02(document.getElementById('threshold02input').value)
    }
    setThreshold03(document.getElementById('threshold03input').value)
  }
  useEffect(()=>{
    limitThresholds()
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
              <p>Your grades (GPA) are what matters for voting power! Study hard!</p>
              <h2>Levels of Expertise</h2>
              <h2>Your Expertise</h2>
              <div>Expertise Thresholds (current): {expertiseLevels[0].toLocaleString()}, {expertiseLevels[1].toLocaleString()}, {expertiseLevels[2].toLocaleString()}</div>
              <div>Expertise Thresholds (proposal): {expertiseLevelsProposal[0].toLocaleString()}, {expertiseLevelsProposal[1].toLocaleString()}, {expertiseLevelsProposal[2].toLocaleString()}</div>
              <div>Maximum Number of Points (current): {maximumPoints.toLocaleString()}</div>
              <div>Maximum Number of Points (proposal): {maximumPointsProposal.toLocaleString()}</div>
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

                <div>
                  <label htmlFor="threshold01input">Intermediate lower limit:</label>
                  <input id='threshold01slider' type="range" min="0" max="100" value={threshold01>=threshold02? threshold02: threshold01} onChange={handleThresholdSliderChange} />
                  <input id='threshold01input' type="number" min="0" max="100" value={threshold01>=threshold02? threshold02: threshold01} onChange={handleThresholdInputChange} />
                </div>
                <div>
                  <label htmlFor="threshold02input">Expert lower limit:</label>
                  <input id='threshold02slider' type="range" min="0" max="100" value={threshold02>=threshold03? threshold03: threshold02} onChange={handleThresholdSliderChange} />
                  <input id='threshold02input' type="number" min="0" max="100" value={threshold02>=threshold03? threshold03: threshold02} onChange={handleThresholdInputChange} />
                </div>
                <div>
                  <label htmlFor="threshold03input">Jedi lower limit:</label>
                  <input id='threshold03slider' type="range" min="0" max="100" value={threshold03} onChange={handleThresholdSliderChange} />
                  <input id='threshold03input' type="number" min="0" max="100" value={threshold03} onChange={handleThresholdInputChange} />
                </div>
                
                <div>
                  <label htmlFor="weight01input">Bachelor Degree:</label>
                  <input id='weight01slider' type="range" min="0" max="20" value={weight01>=weight02? weight02:weight01} onChange={handleWeightSliderChange} />
                  <input id='weight01input' type="number" min="0" max="20" value={weight01>=weight02? weight02:weight01} onChange={handleWeightInputChange} />
                </div>
                <div>
                  <label htmlFor="weight02input">Masters Degree:</label>
                  <input id='weight02slider' type="range" min="0" max="20" value={weight02>=weight03? weight03:weight02} onChange={handleWeightSliderChange} />
                  <input id='weight02input' type="number" min="0" max="20" value={weight02>=weight03? weight03:weight02} onChange={handleWeightInputChange} />
                </div>
                <div>
                  <label htmlFor="weight03input">Doctoral Degree:</label>
                  <input id='weight03slider' type="range" min="0" max="20" value={weight03>=weight04? weight04:weight03} onChange={handleWeightSliderChange} />
                  <input id='weight03input' type="number" min="0" max="20" value={weight03>=weight04? weight04:weight03} onChange={handleWeightInputChange} />
                </div>
                <div>
                  <label htmlFor="weight04input">Postdoctoral Degree:</label>
                  <input id='weight04slider' type="range" min="0" max="20" value={weight04} onChange={handleWeightSliderChange} />
                  <input id='weight04input' type="number" min="0" max="20" value={weight04} onChange={handleWeightInputChange} />
                </div>



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