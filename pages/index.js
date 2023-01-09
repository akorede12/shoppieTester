import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { testerAddress } from '../config'
import { Button, TextArea, Info } from 'web3uikit'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractEvent, useContractWrite, usePrepareContractWrite, useProvider } from 'wagmi';
import { useState } from 'react';

import contractABI from "../artifacts/contracts/Tester.sol/tester.json"
import { ethers } from 'ethers';



export default function Home() {
  
  const[ formInput, updateFormInput] = useState("");

  const[ eventData, setEventData ] = useState({ user:'', userMsg:'', messageNo:'' })

  const provider = useProvider()

  // instance of smart contract ethers
  const contract = new ethers.Contract( testerAddress, contractABI.abi, provider)

  useContractEvent({
    addressOrName: testerAddress,
    abi: contractABI.abi,
    eventName: "jiggy",
    listener: (userAddress, message, messageNumber) => setEventData({user: userAddress, userMsg: message, messageNo: messageNumber})
  })

  const {config} = usePrepareContractWrite({
    address: testerAddress,
    abi: contractABI.abi,
    functionName: "awardItem",
    args: [formInput],
    onSuccess(data) {
      console.log("success", data)
    }
  })

  const {write} = useContractWrite(config) 

  // Listening to contract Events with ethers
  function setEvent(){
  // const {user, userMsg, messageNo } = eventData
  contract.on("jiggy", (userAddress, message, messageNumber) => {
    //{setEventData({user: userAddress, userMsg: message, messageNo: messageNumber})}
    console.log((userAddress, message, messageNumber)) }
  )
  }

   
  // listening to events from transaction receipts 

  // async function getEvent() { 
  // let receipt = await write().wait()
  // console.log(receipt.events?.filter((x) => {return x.event == "jiggy"}));
  // }


  // use a useEffect hook to display the event data 
  
  // address userAddress,
  // string message,
  // uint messageNumber


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
        text="Mint NFT"
        onClick={() => {
          write?.()
        }}
        // color='white'
        // theme='colored'
        />
      <section>
        <h1> Information from smart contract Event </h1>
        <Button 
        text='Populate'
        onClick={() => {setEvent()}}
        />
        <p>{eventData.user}</p>
        <p>{eventData.userMsg}</p>
        <Info
        information= {eventData.user.toString()}
        topic= {eventData.userMsg.toString()}
        />
      </section>
      </main>

    </div>
  )
}
