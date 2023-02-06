import React from 'react'
import { Container } from "reactstrap";
import { NavLink, Link } from "react-router-dom";

import './header.css'


const NAV__LINKS = [
  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Certifications",
    url: "/certifications",
  },
  {
    display: "Governance",
    url: "/governance",
  },
  {
    display: "Wallet & ID",
    url: "/wallet",
  },
];



const Header = () => {
  return (
    <>
      <header className="header">
        <Container>
          <div className="navigation">
            <div className="logo">
              <img src='DigitalCertLogo.png' alt='digital certifications logo' className='img__logo' ></img>
            </div>

            <div className="nav__menu">
              <ul className="nav__list">
                {NAV__LINKS.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.url}
                      className={(navClass) =>
                        navClass.isActive ? "active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__right d-flex align-items-center gap-5 ">
              <button className="btn d-flex gap-2 align-items-center">
                <Link to="/wallet">
                  <span>
                    <i class="ri-wallet-line"></i>
                  </span> Connect MetaMask
                </Link>
              </button>

              <span className="mobile__menu">
                <i className="ri-menu-line"></i>
              </span>
            </div>

          </div>
        </Container>
      </header>
    </>
  )
}

export default Header