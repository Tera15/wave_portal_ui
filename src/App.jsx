import React, { useState } from "react";
import useMetaAccount from './hooks/useMetaAccount.jsx';
import useContractService from './hooks/useContractService.jsx';
import ErrorToast from './Toast.jsx';
import './App.css';
export default function App() {
    const {currentAccount, connectWallet} = useMetaAccount();
    const {wave, allWaves, isMining} = useContractService();
    const [userMessage, setUserMessage] = useState("");
    const [errors, setErrors] = useState({})
    const handleMessageChange = (event) => {
        const {value} = event.target;
        setUserMessage(value);
    }
    const handleWave = () => {
        if (userMessage) {
            wave(userMessage);
            setUserMessage("");
            return;
        }
        setErrors((prev) => ({...prev, message: 'Please send a message with your bump 🙂'}))
        // remove the toast after 5 seconds
        const timer = setTimeout(() => setErrors({}), 2000)
    }
    const showErrorToast = () => {
        if (errors.message) {
            return <ErrorToast message={errors.message}/>
        }
    }

    const buttonText = isMining ? "Processing..." : '👊 Bump Me';
    return (
        <div className="mainContainer">
        {showErrorToast()}
        <div className="dataContainer">
            <div className="header">
            Hey there!<br/>👊 
            </div>

            <div className="bio">
                <p> I'm Cory!</p>
                <p> Bump me for a chance at winning some Rinkeby Ethereum</p>
            </div>
            <label htmlFor="message">Add A Message*</label>
            <input onChange={handleMessageChange} placeholder="Type your message..." value={userMessage} type="text" name="message"/>
            <button className="waveButton" onClick={handleWave}>
            {buttonText}
            </button>
            {!currentAccount && (
                    <button type="button" className="connectButton" onClick={connectWallet}>
                    Connect Wallet
                    </button>
                )
            }
            {
                allWaves && allWaves.map((wave, idx) => (
                    <section key={`${wave.timestamp}${idx}`}>
                        <div>Address: {wave.address}</div>
                        <div>Time: {wave.timestamp.toString()}</div>
                        <div>Message: {wave.message}</div>
                    </section>
                ))
            }
        </div>
        </div>
    );
}
