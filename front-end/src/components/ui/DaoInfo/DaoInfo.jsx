import React from 'react'
import { Container, Row, Col } from "reactstrap";

// CSS Style
import './DaoInfo.css'

/**
 * DAO Information/Parameters
 * 
 * @returns Display the parameters of the DAO
 */
const DaoInfo = () => {

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
        </Container>
      </section>
    </>
  )
}

export default DaoInfo