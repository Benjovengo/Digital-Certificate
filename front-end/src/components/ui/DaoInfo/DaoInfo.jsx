import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './DaoInfo.css' // CSS Style
import { fetchDaoParams } from '../../../scripts/governance/dao-parameters';
import { addProposal } from '../../../scripts/governance/propose';

/**
 * DAO Information/Parameters
 * 
 * @returns Display the parameters of the DAO
 */
const DaoInfo = () => {
  // Hooks
  const [magnitude, setMagnitude] = useState(0); // Magnitude of the education
  const [weights, setWeights] = useState([0, 0, 0]) // Weights for the certification levels. Indices - 0: novice; 1: intermediate; 2: expert

  
  // Change in magnitude
  const handleMagnitudeChange = (event) => {
    setMagnitude(event.target.value);
  };

  /**
   * Load the DAO parameters
   */
  const params = async () => {
    const weight = await fetchDaoParams()
    setWeights(weight)
  }
  useEffect( () => {
    params()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    const functionToCall = e.target.functionToCall.value
    const weight1 = Number(e.target.weight1.value)
    const weight2 = Number(e.target.weight2.value)
    const weight3 = Number(e.target.weight3.value)
    const args = [1, weight2]
    const description = e.target.description.value
    console.log('DEBUG')
    addProposal(functionToCall, args, description)
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
          <Row>
            <Col>
              <h2>Add proposal</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="functionToCall">Function </label>
                <input type="text" id="functionToCall" name="functionToCall" defaultValue={'storeExpertiseThreshold'}/>
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