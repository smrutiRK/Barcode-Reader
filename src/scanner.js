import React, { useEffect } from "react";
import { Html5Qrcode} from "html5-qrcode";
import "./App.css";

const brConfig = { fps: 20, qrbox: { width: 300, height: 150 } };
let html5QrCode;

export const Scanner = (props) => {
  useEffect(() => {
    html5QrCode = new Html5Qrcode("reader"); 
  }, []);

  const handleClickAdvanced = () => {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      console.info(decodedResult, decodedText);
      props.onResult(decodedText);
      handleStop();
    };
    try {
      html5QrCode
        .start(
          { facingMode: "user" },  //use environment for back camera and user for front camera
          props.type === brConfig, 
          qrCodeSuccessCallback 
        )
        .then(() => {
          console.log("QR Code scanning started successfully.");
        })
        .catch((err) => {
          console.error("Failed to start QR Code scanning:", err);
        });
    } catch (err) {
      console.error("Error starting QR Code scanning:", err);
    }
  };

  const handleStop = () => {
    try {
      html5QrCode
        .stop()
        .then(() => {
          html5QrCode.clear();
          console.log("QR Code scanning stopped successfully.");
        })
        .catch((err) => {
          console.error("Failed to stop QR Code scanning:", err);
        });
    } catch (err) {
      console.error("Error stopping QR Code scanning:", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button id="scanbtn" onClick={() => handleClickAdvanced()}>Scan{props.type}</button>
    </div>
  );
};
