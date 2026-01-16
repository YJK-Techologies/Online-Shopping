import { useState, useEffect } from "react";
import { ThemeProvider } from "./ThemeContext";
import AppContent from "./App_content";
import ForgotPopup from "./Forgotpopup";
import Select from "react-select";

const config = require("./Apiconfig");

const SettingsPage = () => {
  const [open, setOpen] = useState(false);
  const [perioddrop, setPerioddrop] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // For floating label focus status
  const [isSelectLanguage, setIsSelectLanguage] = useState(false);
  const [isSelectSales, setIsSelectSales] = useState(false);
  const [isSelectPurchase, setIsSelectPurchase] = useState(false);
  const [isSelectItems, setIsSelectItems] = useState(false);
  const [isSelectStock, setIsSelectStock] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDateRange`)
      .then((data) => data.json())
      .then((val) => {
        setPerioddrop(val);

        if (val?.length > 0) {
          const first = {
            value: val[0].Sno,
            label: val[0].DateRangeDescription,
          };
          setSelectedPeriod(first);
        }
      });
  }, []);

  const filteredOptionPeriod = perioddrop.map((option) => ({
    value: option.Sno,
    label: option.DateRangeDescription,
  }));

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="container-fluid Topnav-screen">
      {/* ---------------- Header Box ---------------- */}
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Settings</h1>

          {/* -------- Desktop Icons -------- */}
          <div className="action-wrapper desktop-actions">
            <div className="action-icon add">
              <span className="tooltip">Save</span>
              <i className="fa-solid fa-floppy-disk"></i>
            </div>

            <div className="action-icon search me-2" onClick={handleOpen}>
              <span className="tooltip">Reset Password</span>
              <i className="fa-solid fa-unlock-keyhole"></i>
            </div>
          </div>

          {/* -------- Mobile Dropdown Actions -------- */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">
              <li className="dropdown-item">
                <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
              </li>

              <li className="dropdown-item" onClick={handleOpen}>
                <i className="fa-solid fa-unlock-keyhole text-primary fs-4"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------- Main Form Box ---------------- */}
      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">
          {/* --------------- LANGUAGE ---------------- */}
          <div className="col-md-2 me-4">
            <label className="fw-bold fs-5">General :</label>

            <div
              className={`inputGroup selectGroup 
              ${selectedOption ? "has-value" : ""} 
              ${isSelectLanguage ? "is-focused" : ""}`}
            >
              <Select
                options={languageOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                classNamePrefix="react-select"
                isClearable
                placeholder=""
                onFocus={() => setIsSelectLanguage(true)}
                onBlur={() => setIsSelectLanguage(false)}
              />
              <label className="floating-label">Language</label>
            </div>
          </div>

          {/* --------------- DASHBOARD SETTINGS ---------------- */}
          <div className="col-md-4">
            <label className="fw-bold fs-5">Dashboard Settings :</label>

            <div className="row">
              {/* Total Sales */}
              <div className="col-12 col-md-8">
                <div
                  className={`inputGroup selectGroup 
                    ${selectedPeriod ? "has-value" : ""} 
                    ${isSelectSales ? "is-focused" : ""}`}
                >
                  <Select
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                    options={filteredOptionPeriod}
                    classNamePrefix="react-select"
                    placeholder=""
                    isClearable
                    onFocus={() => setIsSelectSales(true)}
                    onBlur={() => setIsSelectSales(false)}
                  />
                  <label className="floating-label">Total Sales</label>
                </div>
              </div>

              {/* Total Purchase */}
              <div className="col-12 col-md-8">
                <div
                  className={`inputGroup selectGroup 
                    ${selectedPeriod ? "has-value" : ""} 
                    ${isSelectPurchase ? "is-focused" : ""}`}
                >
                  <Select
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                    options={filteredOptionPeriod}
                    classNamePrefix="react-select"
                    placeholder=""
                    isClearable
                    onFocus={() => setIsSelectPurchase(true)}
                    onBlur={() => setIsSelectPurchase(false)}
                  />
                  <label className="floating-label">Total Purchase</label>
                </div>
              </div>

              {/* Total Items */}
              <div className="col-12 col-md-8">
                <div
                  className={`inputGroup selectGroup 
                    ${selectedPeriod ? "has-value" : ""} 
                    ${isSelectItems ? "is-focused" : ""}`}
                >
                  <Select
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                    options={filteredOptionPeriod}
                    classNamePrefix="react-select"
                    placeholder=""
                    isClearable
                    onFocus={() => setIsSelectItems(true)}
                    onBlur={() => setIsSelectItems(false)}
                  />
                  <label className="floating-label">Total Items</label>
                </div>
              </div>

              {/* Total Stock Values */}
              <div className="col-12 col-md-8">
                <div
                  className={`inputGroup selectGroup 
                    ${selectedPeriod ? "has-value" : ""} 
                    ${isSelectStock ? "is-focused" : ""}`}
                >
                  <Select
                    value={selectedPeriod}
                    onChange={setSelectedPeriod}
                    options={filteredOptionPeriod}
                    classNamePrefix="react-select"
                    placeholder=""
                    isClearable
                    onFocus={() => setIsSelectStock(true)}
                    onBlur={() => setIsSelectStock(false)}
                  />
                  <label className="floating-label">Total Stock Values</label>
                </div>
              </div>
            </div>
          </div>

          {/* --------------- THEME ---------------- */}
          <div className="col-md-2">
            <label className="fw-bold fs-5">Theme :</label>
            <div className="inputGroup">
              <ThemeProvider>
                <AppContent />
              </ThemeProvider>
            </div>
          </div>

          {/* ---------------- Forgot Password Popup ---------------- */}
          <ForgotPopup open={open} handleClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
