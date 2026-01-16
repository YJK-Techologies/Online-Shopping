import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import LoadingScreen from "./Loading";
import Select from "react-select";
const config = require("./Apiconfig");

function AttriHdrInput({ open, handleClose }) {
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributeheader_name, setAttributeheader_Name] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");
  const [isSelectStatus, setIsSelectStatus] = useState(false);

  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setStatusdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleInsert = async () => {
    if (!attributeheader_code || !attributeheader_name || !status) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addattriData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          attributeheader_code,
          attributeheader_name,
          status,
          created_by: sessionStorage.getItem("selectedUserCode"),
        }),
      });

      if (response.status === 200) {
        toast.success("Data inserted successfully!", {
          onClose: () => window.location.reload(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }
    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      {loading && <LoadingScreen />}

      <div className="custom-modal container-fluid Topnav-screen">
        <div className="custom-modal-body">

          <div className="shadow-lg p-1 bg-light rounded main-header-box">
            <div className="header-flex">
              <h1 className="custom-modal-title">Add Attribute Hdr</h1>

              <div className="action-wrapper">
                <div className="action-icon delete" onClick={handleClose}>
                  <span className="tooltip">Close</span>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row shadow-lg p-2 bg-light rounded mt-2 container-form-box">

            <div className="form-block col-md-4">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="text"
                  autoComplete="off"
                  placeholder=" "
                  value={attributeheader_code}
                  onChange={(e) => setAttributeheader_Code(e.target.value)}
                  maxLength={100}
                  ref={code}
                />
                <label className={`exp-form-labels ${error && !attributeheader_code ? 'text-danger' : ''}`}>
                  Code<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="form-block  col-md-4">
              <div className="inputGroup">
                <input
                  className="exp-input-field form-control"
                  type="text"
                  autoComplete="off"
                  placeholder=" "
                  value={attributeheader_name}
                  onChange={(e) => setAttributeheader_Name(e.target.value)}
                  maxLength={250}
                  ref={Name}
                />
                <label className={`exp-form-labels ${error && !attributeheader_name ? 'text-danger' : ''}`}>
                  Name<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div className="form-block  col-md-4">
              <div
                className={`inputGroup selectGroup 
                ${selectedStatus ? "has-value" : ""} 
                ${isSelectStatus ? "is-focused" : ""}`}
              >
                <Select
                  value={selectedStatus}
                  onChange={handleChangeStatus}
                  options={filteredOptionStatus}
                  placeholder=" "
                  onFocus={() => setIsSelectStatus(true)}
                  onBlur={() => setIsSelectStatus(false)}
                  classNamePrefix="react-select"
                  isClearable
                  ref={Status}
                />
                <label className={`floating-label ${error && !status ? 'text-danger' : ''}`}>
                  Status<span className="text-danger">*</span>
                </label>
              </div>
            </div>

            <div class="col-12">
              <div className="search-btn-wrapper">
                <div className="icon-btn save" onClick={handleInsert}>
                  <span className="tooltip">Save</span>
                  <i class="fa-solid fa-floppy-disk"></i>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AttriHdrInput;