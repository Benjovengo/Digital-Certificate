import React from "react";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import "./footer.css";

import { Link } from "react-router-dom";

const MY__ACCOUNT = [
  {
    display: "Identity",
    url: "#",
  },
  {
    display: "Certificates",
    url: "#",
  },
  {
    display: "Governance",
    url: "#",
  },
];

const RESOURCES = [
  {
    display: "Help Center",
    url: "#",
  },
  {
    display: "References",
    url: "#",
  },
  {
    display: "Community",
    url: "#",
  },
];

const COMPANY = [
  {
    display: "About",
    url: "#",
  },
  {
    display: "Contact Us",
    url: "/contact",
  },
];

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3" md="6" sm="6" className="mb-2">
            <div className="logo">
              <img src='DigitalCertLogo.png' alt='digital certifications logo' className='img__logo' ></img>
              <p>
              Digital diploma leverages blockchain technology to enhance the security and validity of degrees from courses and universities, making it easier for companies to select top candidates.
              </p>
            </div>
          </Col>

          <Col lg="2" md="3" sm="6" className="mb-4">
            <h5>My Account</h5>
            <ListGroup className="list__group">
              {MY__ACCOUNT.map((item, index) => (
                <ListGroupItem key={index} className="list__item">
                  <Link to={item.url}> {item.display} </Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="2" md="3" sm="6" className="mb-4">
            <h5>Resources</h5>
            <ListGroup className="list__group">
              {RESOURCES.map((item, index) => (
                <ListGroupItem key={index} className="list__item">
                  <Link to={item.url}> {item.display} </Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="2" md="3" sm="6" className="mb-4">
            <h5>Company</h5>
            <ListGroup className="list__group">
              {COMPANY.map((item, index) => (
                <ListGroupItem key={index} className="list__item">
                  <Link to={item.url}> {item.display} </Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>

          <Col lg="3" md="6" sm="6" className="mb-4">
            <h5>Newsletter</h5>
            <input type="text" className="newsletter" placeholder="Email" />
            <div className="social__links d-flex gap-3 align-items-center ">
              <span>Follow us!!!</span>
              <span>
                <a href="https://www.facebook.com" target="_blank">
                  <i className="ri-facebook-line"></i>
                </a>
              </span>
              <span>
                <a href="https://www.instagram.com" target="_blank">
                  <i className="ri-instagram-line"></i>
                </a>
              </span>
              <span>
                <a href="https://www.twitter.com" target="_blank">
                  <i className="ri-twitter-line"></i>
                </a>
              </span>
              <span>
                <a href="https://web.telegram.org" target="_blank">
                  <i className="ri-telegram-line"></i>
                </a>
              </span>
              <span>
                <a href="https://discord.com" target="_blank">
                  <i className="ri-discord-line"></i>
                </a>
              </span>
            </div>
          </Col>

          <Col lg="12" className=" mt-4 text-center">
            <p className="copyright">
              {" "}
              Copyrights 2023, Developed by Fábio Benjovengo.
              All Rights Reserved.{" "}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;