import React, { useEffect, useState  } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WaveMe.json";
import logo from "./Projects_logo.png";
import ilogo from "./instagram.png";
import llogo from "./linkedin.png";
import glogo from "./github.png";
import wlogo from "./whatsapp.png";




export default function App() {

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const [contractBalance, setContractBalance] = useState("");

  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);

  const [formInput, updateFormInput] = useState({message: '' });


  
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  // const contractAddress = "0xEd17370F19912b2D79BCc3a5d65AaDA9A2922457";
  // const contractAddress = "0x8B4AcE09dFB9D777f637eb55f72016BB7a84F1e7";
  const contractAddress = "0xB756cBE3714531ad51BDec9a0b899F207849e399";

  const contractABI = abi.abi;

  // const getContractBalance = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       // const signer = provider.getSigner();
  //       const waveMeContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       /*
  //        * Call the getAllWaves method from your Smart Contract
  //        */
  //       contractBalance = await waveMeContract.getContractBalance();
  //     } else {
  //       console.log("Ethereum object doesn't exist!")
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }

    getAllWaves();
  }


  const wave = async () => {
    const { message } = formInput

    
    try {
      const {ehtereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveMeContract = new ethers.Contract(contractAddress, contractABI, signer)
        let count = await waveMeContract.showTotalCount();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await waveMeContract.waveAtMe(formInput.message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await waveMeContract.showTotalCount();
        console.log("Retrieved total wave count...", count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    }catch (error){
          console.log(error);
        }
  }

  const withdrawFunds = async () => {
    try {
      const {ehtereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveMeContract = new ethers.Contract(contractAddress, contractABI, signer)
      
        /*
        * Execute the Withdraw from your smart contract
        */
        const withdrawTxn = await waveMeContract.withdrawFunds();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        
  }  else {
        console.log("Ethereum object doesn't exist!");
      }
    }catch (error){
          console.log(error);
        }
  }

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveMeContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await waveMeContract.allMessages();
        const _contractBalance = await waveMeContract.getContractBalance();
        console.log(_contractBalance.toNumber());

        setContractBalance(_contractBalance.toString());

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.sender,
            timestamp: wave.date,
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  
  
  return (
    <div className="mainContainer">
    <div className="mainFlex">
    <div className="nav">
        <div className="Logo"><img src={logo} height={100}/></div>
        <div className="infoFlex">
        <div className="WalletBalance">{!setContractBalance ? 'Contract Balance' : contractBalance}</div>
        <div className="WalletAddress"> {!currentAccount ? 'Polygon Testnet' : currentAccount}</div>
          </div>
    </div>
      <div className="dataContainer">
        <div className="allDataElements">
        <div className="header">
        Hey 👋 I'm Yash!
        </div>
        

        <div className="bio">
        Welcome to my corner of Internet✨. Wave at me on Etherium Blockchain! Maybe send a sweet message too? 
        </div>

        <div className="bio">
          Connect your Metamask wallet to Polygon Testnet and write a message to me. There is a 33% chance that you will earn 0.1 MATIC from the message.
          </div>
        
        <textarea type="text" id="message" 
                                    onChange={e => updateFormInput({ ...formInput, message: e.target.value })}
                                    placeholder="Enter your message here :)"></textarea>
        <div className="ButtonFlex">
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
          
          {/*
          * If there is no currentAccount render this button
          */}
          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
      </div>
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>From: {wave.address}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
      </div>
      <div className="footer">
        <div className="Withdraw"><button className="waveButton" onClick={withdrawFunds}>
            Withdraw Funds
          </button></div>
        <div className="infoFlex">
          <div className="SocialFlex">
          <div className="Social fa"><a href="https://github.com/yashpatel4900">
  <img src={glogo} height={50}/>
</a></div>
          <div className="Social fa "><a href="https://www.linkedin.com/in/yash-patel-6632091a8/">
  <img src={llogo} height={50}/>
</a></div>
          <div className="Social fa"><a href="https://www.instagram.com/yash_patel4900/">
  <img src={ilogo} height={50}/>
</a></div>
            <div className="Social fa"><a href="https://wa.me/919824545104">
  <img src={wlogo} height={50}/>
</a></div>
            </div>
        </div>
    </div>
    </div>
    </div>
  );
}
