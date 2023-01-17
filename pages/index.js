import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { testerAddress } from '../config'
import { Button, TextArea, Info } from 'web3uikit'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractEvent, useContractWrite, usePrepareContractWrite, useProvider, useSigner, useContract } from 'wagmi';
import { useEffect, useState } from 'react';

import contractABI from "../artifacts/contracts/Tester.sol/tester.json"
import { ethers, utils } from 'ethers';

// limit wagmi hooks usage for plain ethers. 
/*
might have to go back on this. 
the issue is that I can't just use rainbowkit wallet connect without wagmi functions 

I'm trying to accomplish 2 things, call a smart contract function passing in arguments,
and viewing contract events. 

I can use ethers easily for this but I would lose the rainbowkit connectwallet ui 
I can choose to use only wagmi but this seems to be given issues

solution
1) find a way to use ethers with rainbowkit
2) use plane ethers and ignore wagmi and rainbowkit 
3) struggle with wagmi as it is 

Issues;
new issue detected

        <p> User Address: {ethers.utils.getAddress(user)}</p>
        <p> User Message: {eventData.userMsg.toString()}</p>
        <p> Message Number: {messageNo.toNumber()}</p>

This is because at the first render of react, the values of user Address, and Messsage Number do not 
exist because they have not been retreived from the smart contract so an error occurs, 
claiming invalid address.

solution: Set a default value for the affected fields on first render, 
and replace when the real values are available.
*/

export default function Home() {
  
  const[ formInput, updateFormInput] = useState("");

  const[ eventData, setEventData ] = useState(
    { 
    user: ethers.constants.AddressZero, 
    userMsg:'no text',
    messageNo:'0' 
  })

  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")

  const {signer} = useSigner()

  // instance of smart contract ethers
  const kontract = new ethers.Contract( testerAddress, contractABI.abi, provider)
 

  let userAdd = ethers.utils.getAddress(eventData.user)
  let usertext = eventData.userMsg.toString()
  let msgNumb = eventData.messageNo//.toNumber()

  // Listening to contract Events with ethers
  function setEvent(){

  kontract.on("jiggy", (userAddress, message, messageNumber) => {
    {setEventData({user: userAddress, userMsg: message, messageNo: messageNumber})}
    console.log((userAddress, message, messageNumber)) }
    )
  }

  // create a wagmi instance of the smart contract 
  const contract = useContract({
    addressOrName: testerAddress,
    abi: contractABI.abi,
    signerOrProvider: signer
  }) 

  // console.log when a transaction was mined 
  /* provider.once(transactionHash)function(transaction){
    console.log("transaction mined" + transaction.hash)
    console.log(transaction)
  }  
  */

  const {config} = usePrepareContractWrite({
    address: testerAddress,
    abi: contractABI.abi,
    functionName: "awardItem",
    args: [formInput],
    onSuccess(data) {
      console.log("success", data)
    }
  })

  const {write , data: number } = useContractWrite(config) 

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
        {/* <p> Message Number: {number} </p> */}
      </section>
      </main>

    </div>
  )
}
