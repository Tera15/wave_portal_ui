import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from '../utils/WavePortal.json';

const useContractService = () => {
    const [isMining, setIsMining] = useState(false);
    const [allWaves, setAllWaves] = useState([]);

    const contractAddress = '0xF6a6321D868238D9C0219810FBffacFA976e0491';
    const contractAbi = abi.abi;

    useEffect(() => {
        let wavePortalContract;
        const onNewWave = (from, timestamp, message) => {
            console.log('New Wave', from, timestamp, message);
            setAllWaves((prevState) => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message,
                }
            ]);
        };

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);
            wavePortalContract.on('NewWave', onNewWave);
        }
        return () => {
                if (wavePortalContract) {
                    wavePOrtalContract.off('NewWave', onNewWave);
                }
            }
    },[])
    const wave = async (message) => {
        try { 
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractAbi, signer);
                // Reads are "free" so we don't need to notify miners
                let count = await wavePortalContract.getTotalWaves();
                console.log("retrieved total wave count...", count.toNumber());

                //execute wave
                const waveTransaction = await wavePortalContract.wave(message, {gasLimit: 300000});
                console.log("Mining...", waveTransaction.hash);
                setIsMining(true);
                // wait for transaction to be mined
                await waveTransaction.wait();
                console.log("Mined -- ", waveTransaction.hash);
                setIsMining(false);

                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist");
            }
        } catch(error) {
            console.log(error);
            setIsMining(false);
        }
    }

    const getAllWaves = async () => {
        const { ethereum } = window;
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress,
                contractAbi, signer);

                const waves = await wavePortalContract.getAllWaves();

                const wavesCleaned = waves.map(wave => {
                    return {
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    };
                });
                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object does not exist");
            }
        } catch(error) {
            console.log(error);
        }
    }

    return {wave, allWaves, isMining};
}

export default useContractService;