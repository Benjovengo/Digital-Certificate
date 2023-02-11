import React, { useState } from 'react'
import { Container, Row, Col } from "reactstrap";

import './display-certificates.css'


const DisplayCertificates = () => {


  // HARD-CODED
  const options = [
    {value: 1, label: 'Option 1'},
    {value: 2, label: 'Option 2'},
    {value: 3, label: 'Option 3'},
    {value: 4, label: 'Option 4'}
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  


  return (
    <>
      <section className="display__certificate__wrapper">
        <Container fluid>
          <Row>
            <h2 className="main__header">Display Certificate</h2>
          </Row>
          <Col>
            <form id="form2">
              <select size="8" multiple>
                <option value="" disabled>Select Certification</option>
                <option value='blue'>Blue</option>
                <option value='green'>Green</option>
                <option value='red'>Red</option>
                <option value='yellow'>Yellow</option>
                <option value='orange'>Orange</option>
              </select>

              <select multiple onChange={handleChange}>
                {options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

            </form>
          </Col>

        </Container>
      </section>
    </>
  )
}

export default DisplayCertificates