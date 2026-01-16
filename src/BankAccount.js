import React, { useState, useEffect, useRef } from "react";
import "./input.css";
//import "./exp.css";
import Select from 'react-select';
import "bootstrap/dist/css/bootstrap.min.css";
import * as icons from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './Loading';
import { ToastContainer, toast } from 'react-toastify';
const config = require('./Apiconfig');


function BankAccInput({ }) {
  const navigate = useNavigate();
  const [account_code, setaccount_code] = useState("");
  const [account_name, setaccount_name] = useState("");
  const [acc_addr_1, setacc_addr_1] = useState("");
  const [acc_addr_2, setacc_addr_2] = useState("");
  const [acc_addr_3, setacc_addr_3] = useState("");
  const [acc_addr_4, setacc_addr_4] = useState("");
  const [acc_area_code, setacc_area_code] = useState("");
  const [acc_state_code, setacc_state_code] = useState("");
  const [acc_country_code, setacc_country_code] = useState("");
  // const [standard_accgroup_code, setstandard_accgroup_code] = useState("");
  const [user_accgroup_code, setuser_accgroup_code] = useState("Bank Account");
  const [account_number, setaccount_number] = useState("");
  const [IFSC_code, setIFSC_code] = useState("");
  const [account_type, setaccount_type] = useState("");
  const [branch, setbranch] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [customercodedrop, setcustomercodedrop] = useState([]);
  const [drop, setDrop] = useState([]);
  const [condrop, setCondrop] = useState([]);
  const [statedrop, setStatedrop] = useState([]);
  const [accdrop, setaccdrop] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedAcctype, setselectedAcctype] = useState('');
  const [selectedState, setselectedState] = useState('');
  const [selectedCountry, setselectedCountry] = useState('');
  const [baseaccdrop, setbaseaccdrop] = useState([]);
  const [error, setError] = useState("");
  const [StdAccGrpdrop, setStdAccGrpdrop] = useState([]);
  const [selectedUserAcc, setSelectedUserAcc] = useState('');
  const [selectedUserCode, setSelectedUserCode] = useState("");
  const [Userdrop, setUserdrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const Country = useRef(null);
  const State = useRef(null);
  const City = useRef(null);
  const Address4 = useRef(null);
  const Address3 = useRef(null);
  const Address2 = useRef(null);
  const Address1 = useRef(null);
  const Branch = useRef(null);
  const Account = useRef(null);
  const IFSc = useRef(null);
  const AccountNumber = useRef(null);
  const Bank = useRef(null);
  const User = useRef(null);
  const Accountant = useRef(null);
  const defaultbank = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const img = useRef(null);
  const [QRImage, setQRImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [defaultBankDrop, setDefaultBankDrop] = useState([]);
  const [selectedDefaultBank, setselectedDefaultBank] = useState('');
  const [defaultBank, setDefaultBank] = useState('');
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [isUpdated, setIsUpdated] = useState(false);
  const [base_accgroup_code, setbase_accgroup_code] = useState('');
  const [standard_accgroup_code, setstandard_accgroup_code] = useState('');
  const [isSelectedUser, setIsSelectedUser] = useState(false);
  const [isSelectedAcctype, setIsSelectedAcctype] = useState(false);
  const [isSelectCity, setIsSelectCity] = useState(false);
  const [isSelectState, setIsSelectState] = useState(false);
  const [isSelectedCountry, setIsSelectCountry] = useState(false);
  const [isSelectedDefaultBank, setIsSelectedDefaultBank] = useState(false);
  const logo = useRef(null);


  console.log(selectedRow)
  const clearInputFields = () => {
    setaccount_code("");
    setSelectedImage("");
    setuser_accgroup_code("");
    setaccount_name("");
    setIFSC_code("");
    setselectedAcctype("");
    setbranch("");
    setacc_addr_1("");
    setacc_addr_2("");
    setacc_addr_3("");
    setacc_addr_4("");
    setSelectedCity("");
    setselectedState("");
    setselectedCountry("");
    setacc_area_code("");
    setacc_state_code("");
    setacc_country_code("");
    setaccount_type("");
    setaccount_number("");
    setSelectedUser("");
    setSelectedUserCode("");
    setselectedDefaultBank("");
    setDefaultBank("");
    setbase_accgroup_code('');
    setstandard_accgroup_code('');
    if (img.current) {
      img.current.value = null;
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getUsercodenameBank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setUserdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionUser = Userdrop.map((option) => ({
    value: option.user_accgroup_code,
    label: option.user_accgroup_name,
  }));

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_accgroup_code(selectedUser ? selectedUser.value : "");
    setSelectedUserCode(selectedUser.value);
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToFile = (base64Data, fileName) => {
    if (!base64Data || !base64Data.startsWith("data:")) {
      throw new Error("Invalid base64 string");
    }

    const parts = base64Data.split(',');
    if (parts.length !== 2) {
      throw new Error("Base64 string is not properly formatted");
    }

    const mimePart = parts[0];
    const dataPart = parts[1];

    const mime = mimePart.match(/:(.*?);/);
    if (!mime || !mime[1]) {
      throw new Error("Could not extract MIME type");
    }

    const binaryString = atob(dataPart);
    const len = binaryString.length;
    const uint8Array = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const fileBlob = new Blob([uint8Array], { type: mime[1] });
    return new File([fileBlob], fileName, { type: mime[1] });
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated && Userdrop) {
      setaccount_code(selectedRow.account_code || "");
      setuser_accgroup_code(selectedRow.user_accgroup_code || "");
      setaccount_name(selectedRow.account_name || "");
      setaccount_number(selectedRow.account_number || "");
      setIFSC_code(selectedRow.IFSC_code || "");
      setbase_accgroup_code(selectedRow.base_accgroup_code || "");
      setstandard_accgroup_code(selectedRow.standard_accgroup_code || "");
      setSelectedCity({
        label: selectedRow.acc_area_code,
        value: selectedRow.acc_area_code,
      });
      setselectedCountry({
        label: selectedRow.acc_country_code,
        value: selectedRow.acc_country_code,
      });
      setselectedState({
        label: selectedRow.acc_state_code,
        value: selectedRow.acc_state_code,
      });
      setselectedDefaultBank({
        label: selectedRow.default_bank,
        value: selectedRow.default_bank,
      });
      setselectedAcctype({
        label: selectedRow.Account_type,
        value: selectedRow.Account_type,
      });
      const matchedUser = filteredOptionUser.find(
        (option) => option.value === selectedRow.user_accgroup_code
      );
      setSelectedUser(matchedUser || "");
      console.log(selectedUser)
      setDefaultBank(selectedRow.default_bank)
      setacc_state_code(selectedRow.acc_state_code)
      setacc_country_code(selectedRow.acc_country_code)
      setacc_area_code(selectedRow.acc_area_code)
      setaccount_type(selectedRow.Account_type || "");
      setbranch(selectedRow.branch || "");
      setacc_addr_1(selectedRow.acc_addr_1 || "");
      setacc_addr_2(selectedRow.acc_addr_2 || "");
      setacc_addr_3(selectedRow.acc_addr_3 || "");
      setacc_addr_4(selectedRow.acc_addr_4 || "");

      if (selectedRow.bank_paymentQRCode && selectedRow.bank_paymentQRCode.data) {
        const base64Image = arrayBufferToBase64(selectedRow.bank_paymentQRCode.data);
        const file = base64ToFile(`data:image/jpeg;base64,${base64Image}`, 'Images.jpg');
        setSelectedImage(`data:image/jpeg;base64,${base64Image}`);
        setQRImage(file)
      } else {
        setSelectedImage(null);
      }
    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated, Userdrop]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getStdAccGrp`)
      .then((data) => data.json())
      .then((val) => setStdAccGrpdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getbasaccode`)
      .then((data) => data.json())
      .then((val) => setbaseaccdrop(val));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/country`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setCondrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setStatedrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/getacctype`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setaccdrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionCity = drop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionState = statedrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionCountry = condrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionAccountype = accdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  // const handleChangeStdAccGrp = (selectedUserAcc) => {
  //   setSelectedUserAcc(selectedUserAcc);
  //   setstandard_accgroup_code(selectedUserAcc ? selectedUserAcc.value : '');
  //   setError(false);
  // };

  const handleChangeCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setacc_area_code(selectedCity ? selectedCity.value : '');
  };

  const handleChangeState = (selectedState) => {
    setselectedState(selectedState);
    setacc_state_code(selectedState ? selectedState.value : '');
  };

  const handleChangeCountry = (selectedCountry) => {
    setselectedCountry(selectedCountry);
    setacc_country_code(selectedCountry ? selectedCountry.value : '');
  };

  const handleChangeacc = (selectedAcctype) => {
    setselectedAcctype(selectedAcctype);
    setaccount_type(selectedAcctype ? selectedAcctype.value : '');
  };


  // const SelectItem = async (user_accgroup_code) => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/getstdBase`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ user_accgroup_code: user_accgroup_code }),
  //     });

  //     if (response.ok) {
  //       const searchData = await response.json();
  //       const [{standard_accgroup_code}] = searchData;
  //       setStandardAccCode(standard_accgroup_code)

  //       console.log(searchData);
  //     } else if (response.status === 404) {
  //       console.log("Data not found");
  //     } else {
  //       console.log("Bad request");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching search data:", error);
  //   }
  // };

  const handleNavigate = () => {
    navigate("/BankAccount", { selectedRows }); // Pass selectedRows as props to the Input component
  };


  const handleInsert = async () => {
    if (!account_code) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Append data to formData
      formData.append("company_code", sessionStorage.getItem('selectedCompanyCode'));
      formData.append("account_code", account_code);
      formData.append("account_name", account_name);
      formData.append("acc_addr_1", acc_addr_1);
      formData.append("acc_addr_2", acc_addr_2);
      formData.append("acc_addr_3", acc_addr_3);
      formData.append("acc_addr_4", acc_addr_4);
      formData.append("acc_area_code", acc_area_code);
      formData.append("acc_state_code", acc_state_code);
      formData.append("acc_country_code", acc_country_code);
      formData.append("user_accgroup_code", user_accgroup_code);
      formData.append("account_number", account_number);
      formData.append("IFSC_code", IFSC_code);
      formData.append("account_type", account_type);
      formData.append("branch", branch);
      formData.append("default_bank", defaultBank);
      formData.append("created_by", sessionStorage.getItem('selectedUserCode'));

      if (QRImage) {
        formData.append("bank_paymentQRCode", QRImage);
      }

      const response = await fetch(`${config.apiBaseUrl}/addbankAccount`, {
        method: "POST",
        body: formData, // Using formData as the body
      });

      // Handle response
      if (response.ok) {
        // const searchData = await response.json();
        // const [{GeneratedAccountCode}] = searchData;
        // setaccount_code(GeneratedAccountCode);

        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => {
              clearInputFields();
            }
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {
    if (!account_code) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("company_code", sessionStorage.getItem('selectedCompanyCode'));
      formData.append("account_code", account_code);
      formData.append("account_name", account_name);
      formData.append("acc_addr_1", acc_addr_1);
      formData.append("acc_addr_2", acc_addr_2);
      formData.append("acc_addr_3", acc_addr_3);
      formData.append("acc_addr_4", acc_addr_4);
      formData.append("acc_area_code", acc_area_code);
      formData.append("acc_state_code", acc_state_code);
      formData.append("acc_country_code", acc_country_code);
      formData.append("user_accgroup_code", user_accgroup_code);
      formData.append("account_number", account_number);
      formData.append("IFSC_code", IFSC_code);
      formData.append("account_type", account_type);
      formData.append("branch", branch);
      formData.append("base_accgroup_code", base_accgroup_code);
      formData.append("standard_accgroup_code", standard_accgroup_code);
      formData.append("default_bank", defaultBank);
      formData.append("modified_by", sessionStorage.getItem('selectedUserCode'));

      if (QRImage) {
        formData.append("bank_paymentQRCode", QRImage);
      }

      const response = await fetch(`${config.apiBaseUrl}/updateBankAccount`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Data Updated successfully");
        setIsUpdated(true);
        clearInputFields();
        toast.success("Data Updated successfully!");
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error('Error updating data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleChangeName = (e) => {
    const accountantName = e.target.value;
    setaccount_name(accountantName);
  }

  const handleKeyPressRef = (e) => {
    GeneretedCode(account_name)
  };

  const GeneretedCode = async (account_name) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAccountCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'), user_accgroup_code: selectedUserCode,
          account_name: account_name
        })
      });

      if (response.ok) {
        const searchData = await response.json();
        const [{ GeneratedAccountCode }] = searchData;
        setaccount_code(GeneratedAccountCode)
        console.log("Data Updated successfully");
      } else if (response.status === 404) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);

      } else {
        console.log("Bad request");

      }
    } catch (error) {
      console.error("Error fetching search data:", error);

    }
  };

  const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
    if (e.key === 'Enter') {
      if (hasValueChanged) {
        await handleKeyDownStatus(e);
        setHasValueChanged(false);
      }

      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault();
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === 'Enter' && hasValueChanged) {
      setHasValueChanged(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {

        toast.error("File size exceeds 1MB. Please upload a smaller file.")
        event.target.value = null;
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setQRImage(file);
    }
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getdefCustomer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setDefaultBankDrop(val))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredOptionDefaultBank = defaultBankDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeDefaultBank = (selectedDefaultBank) => {
    setselectedDefaultBank(selectedDefaultBank);
    setDefaultBank(selectedDefaultBank ? selectedDefaultBank.value : '');
  };

  const handleRemoveLogo = () => {
    setSelectedImage(null);
    if (logo.current) {
      logo.current.value = "";
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class=""  >
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />
          <div className="shadow-lg p-1 bg-light rounded main-header-box">
            <div className="header-flex">
              <h1 className="page-title"> {mode === "update" ? 'Update Bank Account' : 'Add Bank Account '}</h1>
              <div className="action-wrapper">
                <div className="action-icon delete" onClick={handleNavigate}>
                  <span className="tooltip">Close</span>
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
            <div className="row g-3">

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="cusad1"
                    className="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Accountant code"
                    value={account_code}
                    maxLength={100}
                    ref={Accountant}
                    readOnly={mode === "update"}
                    onKeyDown={(e) => handleKeyDown(e, User, Accountant)}
                  />
                  <label className={`floating-label ${error && !account_code ? 'text-danger' : ''}`}>Accountant code<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
      ${selectedUser ? "has-value" : ""} 
      ${isSelectedUser ? "is-focused" : ""}`}
                >
                  <Select
                    id="UserAccCode"
                    value={selectedUser}
                    onChange={handleChangeUser}
                    options={filteredOptionUser}
                    placeholder=" "
                    onFocus={() => setIsSelectedUser(true)}
                    onBlur={() => setIsSelectedUser(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={User}
                    onKeyDown={(e) => handleKeyDown(e, Bank, User)}
                  />
                  <label className={`floating-label ${error && !selectedUser ? 'text-danger' : ''}`}>User Account Code<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="cusad1"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the accountant name"
                    value={account_name}
                    onBlur={handleKeyPressRef}
                    onChange={handleChangeName}
                    maxLength={100}
                    ref={Bank}
                    onKeyDown={(e) => handleKeyDown(e, AccountNumber, Bank)}
                  />
                  <label for="rid" className={`exp-form-labels ${error && !account_name ? 'text-danger' : ''}`}>Bank Name<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="bnkaccnum"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the Account Number"
                    value={account_number}
                    onChange={(e) => setaccount_number(e.target.value)}
                    maxLength={30}
                    ref={AccountNumber}
                    onKeyDown={(e) => handleKeyDown(e, IFSc, AccountNumber)}
                  />
                  <label for="rid" className={`exp-form-labels ${error && !account_number ? 'text-danger' : ''}`}>Account Number<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="bnkifsc"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the address"
                    value={IFSC_code}
                    onChange={(e) => setIFSC_code(e.target.value)}
                    maxLength={11}
                    ref={IFSc}
                    onKeyDown={(e) => handleKeyDown(e, Account, IFSc)}
                  />
                  <label for="rid" className={`exp-form-labels ${error && !IFSC_code ? 'text-danger' : ''}`}>IFSC code<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
      ${selectedAcctype ? "has-value" : ""} 
      ${isSelectedAcctype ? "is-focused" : ""}`}
                >
                  <Select
                    id="acctype"
                    value={selectedAcctype}
                    onChange={handleChangeacc}
                    options={filteredOptionAccountype}
                    placeholder=" "
                    onFocus={() => setIsSelectedAcctype(true)}
                    onBlur={() => setIsSelectedAcctype(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={Account}
                    onKeyDown={(e) => handleKeyDown(e, Branch, Account)}
                    required title="Please select the Account Type "
                  />
                  <label className={`floating-label ${error && !account_type ? 'text-danger' : ''}`}>Account Type<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="bnkbra"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the Branch "
                    value={branch}
                    onChange={(e) => setbranch(e.target.value)}
                    maxLength={250}
                    ref={Branch}
                    onKeyDown={(e) => handleKeyDown(e, Address1, Branch)}
                  />
                  <label for="rid" className={`exp-form-labels ${error && !branch ? 'text-danger' : ''}`}>Branch<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="cusad1"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the address"
                    value={acc_addr_1}
                    onChange={(e) => setacc_addr_1(e.target.value)}
                    maxLength={250}
                    ref={Address1}
                    onKeyDown={(e) => handleKeyDown(e, Address2, Address1)}
                  />
                  <label className={`floating-label ${error && !acc_addr_1 ? 'text-danger' : ''}`}>Address 1<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="cusad2"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the address"
                    value={acc_addr_2}
                    onChange={(e) => setacc_addr_2(e.target.value)}
                    maxLength={250}
                    ref={Address2}
                    onKeyDown={(e) => handleKeyDown(e, Address3, Address2)}
                  />
                  <label className={`floating-label ${error && !acc_addr_2 ? 'text-danger' : ''}`}>Address 2<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="cusad3"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the address"
                    value={acc_addr_3}
                    onChange={(e) => setacc_addr_3(e.target.value)}
                    maxLength={250}
                    ref={Address3}
                    onKeyDown={(e) => handleKeyDown(e, Address4, Address3)}
                  />
                  <label className={`floating-label ${error && !acc_addr_3 ? 'text-danger' : ''}`}>Address 3<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="cusad4"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="Please enter the address"
                    value={acc_addr_4}
                    onChange={(e) => setacc_addr_4(e.target.value)}
                    maxLength={250}
                    ref={Address4}
                    onKeyDown={(e) => handleKeyDown(e, City, Address4)}
                  />
                  <label className={`floating-label ${error && !acc_addr_4 ? 'text-danger' : ''}`}>Address 4<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
      ${selectedCity ? "has-value" : ""} 
      ${isSelectCity ? "is-focused" : ""}`}
                >
                  <Select
                    id="city"
                    value={selectedCity}
                    onChange={handleChangeCity}
                    options={filteredOptionCity}
                    placeholder=" "
                    onFocus={() => setIsSelectCity(true)}
                    onBlur={() => setIsSelectCity(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={City}
                    onKeyDown={(e) => handleKeyDown(e, State, City)}
                  />
                  <label className={`floating-label ${error && !acc_area_code ? 'text-danger' : ''}`}>City<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
      ${selectedState ? "has-value" : ""} 
      ${isSelectState ? "is-focused" : ""}`}
                >
                  <Select
                    id="state"
                    value={selectedState}
                    onChange={handleChangeState}
                    options={filteredOptionState}
                    placeholder=" "
                    onFocus={() => setIsSelectState(true)}
                    onBlur={() => setIsSelectState(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={State}
                    onKeyDown={(e) => handleKeyDown(e, Country, State)}
                  />
                  <label className={`floating-label ${error && !acc_state_code ? 'text-danger' : ''}`}>State<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
      ${selectedCountry ? "has-value" : ""} 
      ${isSelectedCountry ? "is-focused" : ""}`}
                >
                  <Select
                    id="country"
                    value={selectedCountry}
                    onChange={handleChangeCountry}
                    options={filteredOptionCountry}
                    placeholder=" "
                    onFocus={() => setIsSelectCountry(true)}
                    onBlur={() => setIsSelectCountry(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={Country}
                    onKeyDown={(e) => handleKeyDown(e, defaultbank, Country)}
                  />
                  <label className={`floating-label ${error && !acc_country_code ? 'text-danger' : ''}`}>Country<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`inputGroup selectGroup 
      ${selectedDefaultBank ? "has-value" : ""} 
      ${isSelectedDefaultBank ? "is-focused" : ""}`}
                >
                  <Select
                    id="officeType"
                    value={selectedDefaultBank}
                    onChange={handleChangeDefaultBank}
                    options={filteredOptionDefaultBank}
                    placeholder=" "
                    onFocus={() => setIsSelectedDefaultBank(true)}
                    onBlur={() => setIsSelectedDefaultBank(false)}
                    classNamePrefix="react-select"
                    isClearable
                    ref={defaultbank}
                    onKeyDown={(e) => handleKeyDown(e, img, defaultbank)}
                  />
                  <label className={`floating-label ${error && !selectedDefaultBank ? 'text-danger' : ''}`}>Default Bank<span className="text-danger">*</span></label>
                </div>
              </div>


              <div className="col-md-3">
                <div className="inputGroup">
                  <div className="image-upload-container">
                    {selectedImage ? (
                      <div className="image-preview-box">
                        <img
                          src={selectedImage}
                          alt="Uploaded Logo"
                          className="uploaded-image"
                        />
                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={handleRemoveLogo}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder-box">
                        <div className="upload-icon-text">
                          <i className="fa-regular fa-image upload-icon me-1"></i>
                          <span>Upload Image</span>
                        </div>
                      </div>
                    )}

                    <input type="file"
                      className="exp-input-field form-control hidden-file-input"
                      accept="image/*"
                      onChange={handleFileSelect}
                      ref={img}
                      //  onKeyDown={(e) => handleKeyDown(e, img)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (mode === "update") {
                            handleUpdate();
                          } else {
                            handleInsert();
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div className="search-btn-wrapper">
                  {mode === "create" ? (
                    <div className="icon-btn save" onClick={handleInsert}>
                      <span className="tooltip">Save</span>
                      <i class="fa-solid fa-floppy-disk"></i>
                    </div>
                  ) : (
                    <div className="icon-btn update" onClick={handleUpdate}>
                      <span className="tooltip">Update</span>
                      <i class="fa-solid fa-pen-to-square"></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BankAccInput;  