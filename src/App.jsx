import React, { useState, useEffect } from "react";
import { Scanner } from "./scanner";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  scanTpnShipment,
  scanSrEnclosedItem,
  scanTpnEnclosedItem,
  scanSrShipment,
  scanUIDShipment,
  createShipment,
  updateEnclosedItems,
  scanUIDEnclosedItem,
  getEnclosureStatus,
  getEnclosement,
  getEnclosementStatus,
  updateItems,
} from "./axiosFunctions";

function App() {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const [tpn, setTpn] = useState("");
  const [sn, setSn] = useState("");
  const [enclosement, setenclosement] = useState([]);
  const [enclosureStatus, setEnclosureStatus] = useState(null);
  const [enclosementStatus, setEnclosementStatus] = useState([]);

  useEffect(() => {
    const fetchEnclosedItems = async () => {
      try {
        const uid = `${tpn}_${sn}`;
        setenclosement([]);
        const response = await getEnclosement(uid);

        if (response) {
          setenclosement(response);
        }
      } catch (error) {
        console.error("Error fetching enclosed items:", error);
      }
    };

    if (tpn.trim() && sn.trim()) {
      fetchEnclosedItems();
    }
  }, [tpn, sn]);

  useEffect(() => {
    setEnclosementStatus(Array(enclosement.length).fill("Not exists"));
  }, [enclosement]);

  // useEffect(() => {
  //   if (tpn.trim() !== "") {
  //     handleScanTpn(tpn);
  //   }
  // }, [tpn]);

  // useEffect(() => {
  //   if (sn.trim() !== "") {
  //     handleScanSn(sn);
  //   }
  // }, [sn]);

  useEffect(() => {
    if (tpn.trim() !== "" && sn.trim() !== "") {
      handleScanEnclosureUid(`${tpn}_${sn}`);
    }
  }, [tpn, sn]);

  useEffect(() => {
    const lastEnclosement = enclosement[enclosement.length - 1];
    if (
      lastEnclosement &&
      (lastEnclosement.tpn_no.trim() !== "" ||
        lastEnclosement.sr_no.trim() !== "")
    ) {
      handleScanUIDEnclosedItem(
        `${lastEnclosement.tpn_no}_${lastEnclosement.sr_no}`
      );
    }
  }, [enclosement]);

  // useEffect(() => {
  //   const lastEnclosement = enclosement[enclosement.length - 1];
  //   if (lastEnclosement && lastEnclosement.tpn_no.trim() !== "") {
  //     handleScanTpnEnclosedItem(lastEnclosement.tpn_no);
  //   }
  // }, [enclosement]);

  // useEffect(() => {
  //   const lastEnclosement = enclosement[enclosement.length - 1];
  //   if (lastEnclosement && lastEnclosement.sr_no.trim() !== "") {
  //     handleScanSrEnclosedItem(lastEnclosement.sr_no);
  //   }
  // }, [enclosement]);

  useEffect(() => {
    enclosement.forEach((item, index) => {
      if (item.tpn_no.trim() !== "" && item.sr_no.trim() !== "") {
        fetchEnclosedItemStatus(item.tpn_no, item.sr_no, index);
      }
    });
  }, [enclosement]);

  useEffect(() => {
    if (tpn.trim() !== "" && sn.trim() !== "") {
      const uid = `${tpn}_${sn}`;
      handleCheckEnclosureStatus(uid);
    }
  }, [tpn, sn]);

  const fetchEnclosedItemStatus = async (tpn_no, sr_no, index) => {
    try {
      const uid_no = `${tpn_no}_${sr_no}`;
      const response = await getEnclosementStatus(uid_no);

      if (response) {
        const newStatuses = [...enclosementStatus];
        newStatuses[index] = response;
        setEnclosementStatus(newStatuses);
      } else {
        console.log("Enclosed Item not found");
      }
    } catch (error) {
      console.error("Error getting enclosed item status:", error);
    }
  };

  const handleCheckEnclosureStatus = async (uid) => {
    try {
      const response = await getEnclosureStatus(uid);
      setEnclosureStatus(response);
      // if (response) {
      //   console.log("Enclosure status:", response);
      // } else {
      //   console.log("Enclosure not found");
      // }
    } catch (error) {
      console.error("Error checking enclosure status:", error);
    }
  };

  const handleChangeTpn = (event) => {
    const newValue = event.target.value;
    setTpn(newValue.slice(0, 20));
  };

  const handleChangeSn = (event) => {
    const newValue = event.target.value;
    setSn(newValue.slice(0, 20));
  };

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setenclosement((prevenclosement) =>
      prevenclosement.map((encloser, i) =>
        i === index ? { ...encloser, [name]: value.slice(0, 20) } : encloser
      )
    );
  };

  const handleAddEnclosement = () => {
    setenclosement([...enclosement, { tpn_no: "", sr_no: "" }]);
  };

  const handleRemoveEnclosement = (index) => {
    setenclosement((prevEnclosement) =>
      prevEnclosement.filter((_, i) => i !== index)
    );
  };

  const handleScanEnclosureUid = async (uid) => {
    try {
      const scannedShipment = await scanUIDShipment(uid);
      toast.warning("Enclosure is already available with this UID", {
        toastId: "uid-toast",
      });
    } catch (error) {
      toast.success("Enclosure is not available with this UID.", {
        toastId: "uid-toast-2",
      });
    }
  };
  // const handleScanTpn = async (tpn) => {
  //   try {
  //     const scannedShipment = await scanTpnShipment(tpn);
  //     toast.warning("Shipment is already available with this TPN number", {
  //       toastId: "tpn-toast",
  //     });
  //   } catch (error) {
  //     toast.success("Shipment is not available with this TPN number.", {
  //       toastId: "tpn-toast-2",
  //     });
  //   }
  // };

  // const handleScanSn = async (sr) => {
  //   try {
  //     const scannedShipment = await scanSrShipment(sr);
  //     toast.warning("Shipment is already available with this SR number", {
  //       toastId: "sn-toast",
  //     });
  //   } catch (error) {
  //     toast.success("Shipment is not available with this SR number.", {
  //       toastId: "sn-toast-2",
  //     });
  //   }
  // };

  const handleScanUIDEnclosedItem = async (uid) => {
    try {
      const scannedEnclosure = await scanUIDEnclosedItem(uid);
      toast.warning(
        "Enclosure Item is already available with this UID number",
        { toastId: "enclosure-uid-toast" }
      );
    } catch (error) {
      toast.success("Enclosure Item is not available with this UID number.", {
        toastId: "enclosure-uid-toast-2",
      });
    }
  };

  // const handleScanTpnEnclosedItem = async (enclosedItemTpn) => {
  //   try {
  //     const scannedEnclosure = await scanTpnEnclosedItem(enclosedItemTpn);
  //     toast.warning(
  //       "Enclosure Item is already available with this TPN number",
  //       { toastId: "enclosure-tpn-toast" }
  //     );
  //   } catch (error) {
  //     toast.success("Enclosure Item is not available with this TPN number.", {
  //       toastId: "enclosure-tpn-toast-2",
  //     });
  //   }
  // };

  // const handleScanSrEnclosedItem = async (enclosedItemSr) => {
  //   try {
  //     const scannedEnclosure = await scanSrEnclosedItem(enclosedItemSr);
  //     toast.warning("Enclosure Item is already available with this SR number", {
  //       toastId: "enclosure-sn-toast",
  //     });
  //   } catch (error) {
  //     toast.success("Enclosure Item is not available with this SR number.", {
  //       toastId: "enclosure-sn-toast-2",
  //     });
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const shipmentData = {
        part_number: tpn,
        serial_number: sn,
        enclosed: enclosement,
      };

      console.log(shipmentData);
      if (enclosement.length >= 1) {
        await createShipment(shipmentData);
        toast.success("Shipment created successfully", {
          toastId: "shipment-toast",
        });
      } else {
        toast.error("Please enter atleast 1 enclosements", {
          toastId: "shipment-toast",
        });
      }
    } catch (error) {
      toast.error("Error creating shipment", {
        toastId: "shipment-toast-2",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        part_number: tpn,
        serial_number: sn,
        enclosed: enclosement,
      };

      if (enclosement.length >= 1) {
        await updateItems(updatedData);
        toast.success("Shipment updated successfully", {
          toastId: "shipment-toast",
        });
      } else {
        toast.error("Please enter atleast 1 enclosements", {
          toastId: "shipment-toast",
        });
      }
    } catch (error) {
      toast.error("Error updating shipment", {
        toastId: "shipment-toast-2",
      });
    }
  };

  const renderEnclosureStatus = () => {
    if (enclosureStatus === null) {
      return null;
    }

    return (
      <div className="status-container">
        <span className="status-icon">
          <i
            class={
              enclosureStatus === "pass"
                ? "fa-solid fa-circle-check"
                : "fa-solid fa-triangle-exclamation"
            }
          ></i>{" "}
        </span>
        <span className="status-msg">{enclosureStatus}</span>
      </div>
    );
  };

  const renderEnclosementStatus = (index) => {
    const enclosementItem = enclosement[index];

    if (!enclosementItem.tpn_no.trim() || !enclosementItem.sr_no.trim()) {
      return null;
    }

    const itemStatus = enclosementStatus[index];

    return (
      <div className="status-container">
        <span className="status-icon">
          <i
            class={
              itemStatus === "pass"
                ? "fa-solid fa-circle-check"
                : "fa-solid fa-triangle-exclamation"
            }
          ></i>{" "}
        </span>
        <span className="status-msg">{itemStatus}</span>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="title-container">
          <h1>Create Encloser</h1>
        </div>
        <div className="logo-container">
          <img id="logo" src="/Logo.png" alt="Logo" />
        </div>
      </header>
      <ToastContainer position="bottom-right" />
      <div className="margin">
        <h3>Encloser : </h3>
        <label htmlFor="text"> TPN : </label>
        <input
          type="text"
          value={tpn}
          onChange={handleChangeTpn}
          placeholder="Enter TPN no. here"
          maxLength={20}
        />

        <button id="otherbt" style={{ marginBottom: 5 }}>
          <Scanner
            onResult={(res) => {
              setTpn(res);
            }}
          />
        </button>
        <br />

        <label htmlFor="text"> SN&nbsp;&nbsp; : </label>
        <input
          type="text"
          value={sn}
          onChange={handleChangeSn}
          placeholder="Enter SN no. here"
          maxLength={20}
        />

        <button id="otherbt" style={{ marginBottom: 5 }}>
          <Scanner
            onResult={(res) => {
              setSn(res);
            }}
          />
        </button>
        <br />

        {renderEnclosureStatus()}

        {enclosement.map((encloser, index) => (
          <div key={index}>
            <div className="header-div">
              <h3>Enclosement {index + 1}:</h3>
              <span
                id="removebt"
                class="material-symbols-outlined"
                onClick={() => handleRemoveEnclosement(index)}
              >
                remove_circle
              </span>
            </div>
            <label htmlFor={`tpn-${index}`}>TPN : </label>
            <input
              type="text"
              id={`tpn-${index}`}
              name="tpn_no"
              value={encloser.tpn_no}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter TPN no. here"
              maxLength={20}
            />
            <button id="otherbt" style={{ marginBottom: 5 }}>
              <Scanner
                onResult={(res) =>
                  handleChange(
                    { target: { name: "tpn_no", value: res } },
                    index
                  )
                }
              />
            </button>
            <br />

            <label htmlFor={`sn-${index}`}>SN&nbsp;&nbsp; : </label>
            <input
              type="text"
              id={`sn-${index}`}
              name="sr_no"
              value={encloser.sr_no}
              onChange={(e) => handleChange(e, index)}
              placeholder="Enter SN no. here"
              maxLength={20}
            />
            <button id="otherbt">
              <Scanner
                onResult={(res) =>
                  handleChange({ target: { name: "sr_no", value: res } }, index)
                }
              />
            </button>

            {renderEnclosementStatus(index)}
          </div>
        ))}

        <div>
          <span
            id="addbt"
            class="material-symbols-outlined"
            onClick={handleAddEnclosement}
          >
            add_circle
          </span>

          {enclosement.length <=1 && (
            <button id="submitbt" onClick={handleSubmit}>
              Create
            </button>
          )}
          {enclosement.length > 1 && (
            <button id="submitbt" onClick={handleUpdate}>
              Update
            </button>
          )}
        </div>
      </div>

      <main id="reader"></main>
    </div>
  );
}

export default App;
