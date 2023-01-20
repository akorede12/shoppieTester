import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { testerAddress } from '../config'
import { Button, TextArea, Info } from 'web3uikit'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {useContractWrite, usePrepareContractWrite, useContract } from 'wagmi';
import {useState } from 'react';

import contractABI from "../artifacts/contracts/Tester.sol/tester.json"
import { ethers} from 'ethers';


export default function Home() {
  
  const[ formInput, updateFormInput] = useState("");

  const[ eventData, setEventData ] = useState(
    { 
    user: ethers.constants.AddressZero, 
    userMsg:'no text',
    messageNo:'0' 
  })

  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")

  // instance of smart contract ethers
  const kontract = new ethers.Contract( testerAddress, contractABI.abi, provider)
 
  // variables to store and view event data
  let userAdd = ethers.utils.getAddress(eventData.user)
  let usertext = eventData.userMsg.toString()
  let msgNumb = eventData.messageNo

  // Listening to contract Events with ethers
  function setEvent(){

  kontract.on("jiggy", (userAddress, message, messageNumber) => {
    {setEventData({user: userAddress, userMsg: message, messageNo: messageNumber.toNumber()})}
    console.log((userAddress, message, messageNumber)) }
    )
  }

  const {config} = usePrepareContractWrite({
    address: testerAddress,
    abi: contractABI.abi,
    functionName: "awardItem",
    args: [formInput],
    onSuccess(data) {
      console.log("success", data)
    }
  })

  const {write } = useContractWrite(config) 

  return (
    <div>
      <Head>
        <title>Shoppie-tester</title>
        <meta name="description" content="This page was created to test smart contract events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <ConnectButton/>
        <p>Write a message and click the button</p>
        
        <TextArea
        label="UserMessage"
        placeholder="Write a message and click the button"
        onChange={ (e) => updateFormInput(e.target.value)}
        />
        <Button
        text="Send Message"
        onClick={() => {
          write?.()
        }}
        
        />
      <section>
        <h1> Information from smart contract Event </h1>
        <Button 
        text='get event data'
        onClick={() => {setEvent()}}
        />
        <p> User Address: {userAdd}</p>
        <p> User Message: {usertext}</p>
        <p> Message Number: {msgNumb}</p>
      </section>
      </main>

    </div>
  )
}
