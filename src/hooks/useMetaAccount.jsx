import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const useMetaAccount = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    useEffect(() => {
        checkIfWalletConnected();
    },[]);

    const checkIfWalletConnected = async () => {
        try {
            const {ethereum} = window;
            if (!ethereum) {
                console.log("make sure you have metamask");
                return;
            }
            console.log("We have the ethereum object ", ethereum);

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            
        if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
            } else {
                console.log("No authorized account found")
            }
        } catch (error) {
            console.log(error);
        }
    }
    
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
  }
     return {currentAccount, connectWallet}
}

export default useMetaAccount;