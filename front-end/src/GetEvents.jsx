import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import $ from 'jquery';

import HelloWorld from './abis/HelloWorld.json' // ABI
import config from './config.json'; // config


const GetEvents = () => {
  let [provider, setProvider] = useState(null)
  let [contract, setContract] = useState(null);
  let [network, setNetwork] = useState(null);
  let [signer, setSigner] = useState(null)


  const setupBlockchainContract = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    network = await provider.getNetwork()
    setNetwork(network)
    signer = provider.getSigner();
    setSigner(signer)
    // Javascript "version" of the smart contracts
    contract = new ethers.Contract(config[network.chainId].helloWorld.address, HelloWorld, signer)
    setContract(contract)
  }



  async function getInstructorData() {
    if (contract === null) {
      await setupBlockchainContract()
    }
    provider.on("block", () => {
      contract.on("Instructor", (resultName, resultAge)=>{
        if (resultName) {
          //$("#instructor").html(resultName+' ('+resultAge+' years old)')
          $("#instructor").html(resultName+' ('+Number(resultAge)+' years old)')
          console.log(resultName)
          console.log(Number(resultAge))
        } else {
          $("#instructor").html('ERROR LISTENING TO NAME AND AGE FROM EVENT')
        }
      })
    })
  }

  async function clickSetInstructor()  {
    if (contract === null) {
      await setupBlockchainContract()
    }
    contract.setInstructor($("#name").val(), $("#age").val())
  }

  useEffect(() => {
    getInstructorData()
  }, [])

  return (
    <>
      <div id="instructor"></div>
      
      <label htmlFor="name">Instructor Name</label>
      <input id="name" type="text" />

      <label htmlFor="name">Instructor Age</label>
      <input id="age" type="text" />

      <button id="button" onClick={() => clickSetInstructor()}>Update Instructor</button>
    </>
  )
}

export default GetEvents