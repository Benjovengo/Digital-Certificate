import React, { useRef } from 'react'
import { Container } from "reactstrap";
import { NavLink } from "react-router-dom";
import './header.css'

const ethers = require("ethers")


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



const Header = ({ account, setAccount }) => {

  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

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

            <div className="nav__right d-flex align-items-center gap-3 ">
              <button className="btn d-flex gap-1 align-items-center"  onClick={connectHandler}>
                  {account? (
                    <div><i className="ri-wallet-line"></i> {account.slice(0,6) + '...' + account.slice(38,42)}</div>
                    //<p><b>Address:</b> {account}</p>
                  ) : (
                    <div><i className="ri-wallet-line"></i> Connect MetaMask</div>
                  )}
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