import React, { useEffect, useRef, useState } from 'react'
import { Container } from "reactstrap";
import { NavLink, Link } from "react-router-dom";

import './header.css'
import { connectHandler } from './Connect';


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

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  let [provider, setProvider] = useState(null)
  let [account, setAccount] = useState(null)

  connectHandler(account, setAccount)

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    });
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("active__menu");


  return (
    <>
      <header className="header">
        <Container>
          <div className="navigation">
            <div className="logo">
              <img src='DigitalCertLogo.png' alt='digital certifications logo' className='img__logo' ></img>
            </div>

            <div className="nav__menu" ref={menuRef} onClick={toggleMenu}>
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
              <button className="btn d-flex gap-2 align-items-center"  onClick={connectHandler}>
                <Link to="/wallet">
                  <span>
                    <i className="ri-wallet-line"></i>
                  </span> Connect MetaMask
                </Link>
              </button>

              <span className="mobile__menu">
                <i className="ri-menu-line lines__menu" onClick={toggleMenu}></i>
              </span>
            </div>

          </div>
        </Container>
      </header>
    </>
  )
}

export default Header