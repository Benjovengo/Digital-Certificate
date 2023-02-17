import React, { useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './DaoInfo.css' // CSS Style


/**
 * DAO Information/Parameters
 * 
 * @returns Display the parameters of the DAO
 */
const DaoInfo = () => {
  // Magnitude of the education
  const [magnitude, setMagnitude] = useState(0);

  // Change in magnitude
  const handleMagnitudeChange = (event) => {
    setMagnitude(event.target.value);
  };

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