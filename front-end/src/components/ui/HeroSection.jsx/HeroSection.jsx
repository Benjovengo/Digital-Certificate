import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import "./hero-section.css";

import heroImg from "../../../assets/images/hero_diploma.png";

const HeroSection = () => {
  return (
    <section className="hero__section">
      <Container>
        <Row className="align-items-center">
          <Col lg="6" md="6">
            <div className="hero__content">

              <div className="hero__header">
                Your
                <div className="hero__diploma__top">
                  <h3 className="hero__diploma">diplomas</h3>
                  <h3 className="hero__diploma__and">&</h3>
                </div>
                
                <h3 className="hero__diploma">certifications</h3>
                <p className="hero__left">are now the most valuable</p>
                <h4 className="hero__nft">NFTs</h4>
                <p className="hero__left">of your collection</p>
              </div>
              <p className="hero__abstract">
                Have your diplomas and certificates registered and stored as unique, secure NFTs on the blockchain. Preserve and verify your achievements for a lifetime.
              </p>

              <div className="hero__btns d-flex align-items-center gap-4">
                <button className=" explore__btn d-flex align-items-center gap-2">
                  <i className="ri-ball-pen-line"></i>{" "}
                  <Link to="/about">Explore the Features</Link>
                </button>
                <button className=" create__btn d-flex align-items-center gap-2">
                  <i className="ri-rocket-line"></i>
                  <Link to="/about">Your Certifications</Link>
                </button>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="hero__img">
              <img src={heroImg} alt="" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;