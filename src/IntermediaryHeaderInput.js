import { useState, useEffect, useRef } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingScreen from "./Loading";
import { toast } from "react-toastify";
import Select from "react-select";
const config = require("./Apiconfig");

function IntermediaryHdrInput({ open, handleClose }) {
  const [Code, setCode] = useState("");
  const [Details, setDetails] = useState("");
  const [status, setStatus] = useState("");
  const [deletePermission, setDeletePermission] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusdrop, setStatusdrop] = useState([]);
  const [delPerdrop, setDelperdrop] = useState([]);
  const [error, setError] = useState("");
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [isSelectDelete, setIsSelectDelete] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDelete, setSelectedDelete] = useState("");

  const codeRef = useRef(null);
  const nameRef = useRef(null);
  const statusRef = useRef(null);
  const delRef = useRef(null);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((res) => res.json())
      .then((val) => setStatusdrop(val))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/delPer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((res) => res.json())
      .then((val) => setDelperdrop(val))
      .catch((err) => console.log(err));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDelete = delPerdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selected) => {
    setSelectedStatus(selected);
    setStatus(selected ? selected.value : "");
  };

  const handleChangeDelete = (selected) => {
    setSelectedDelete(selected);
    setDeletePermission(selected ? selected.value : "");
  };

  const handleInsert = async () => {
  if (!Code || !Details || !status || !deletePermission) {
    toast.warning("Missing Required Fields");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`${config.apiBaseUrl}/AddIntermediaryheaderData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
        Code,
        Details,
        status,
        deletePermission,
        created_by: sessionStorage.getItem("selectedUserCode"),
      }),
    });

    if (res.status === 200) {
      toast.success("Data inserted successfully!", {
        onClose: () => window.location.reload(),
      });
    } else {
      const err = await res.json();
      toast.error(err.message || "Failed to insert data");
    }
  } catch (e) {
    toast.error("Error inserting data: " + e.message);
  } finally {
    setLoading(false);
  }
};

if (!open) return null;

  return (
    <div className="modal-overlay">
      {loading && <LoadingScreen />}

      <div className="custom-modal container-fluid Topnav-screen ">
        <div className="custom-modal-body">

          {/* Modal Header */}
          <div className="shadow-lg p-1 bg-light rounded main-header-box">
            <div className="header-flex">
              <h1 className="custom-modal-title">Add Intermediary Hdr</h1>

              <div className="action-wrapper">
                <div className="action-icon delete" onClick={handleClose}>
                  <span className="tooltip">Close</span>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
              {/* <button className="custom-modal-close" onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </button> */}

            </div>
          </div>

          {/* Form Container */}
          <div className="form-row shadow-lg p-2 bg-light rounded mt-2 container-form-box">
           
            {/* Code */}
            <div className="form-block col-md-3">
              <div className="inputGroup">
              <input
                className="exp-input-field form-control"
                autoComplete="off"
                placeholder=" "
                value={Code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={30}
                ref={codeRef}
              />
              <label className={`exp-form-labels ${error && !Code ? 'text-danger' : ''}`}>
                Header Code<span className="text-danger">*</span>
              </label>
            </div>
            </div>

            {/* Details */}
            <div className="form-block col-md-3">
              <div className="inputGroup">
              <input
                className="exp-input-field form-control"
                autoComplete="off"
                placeholder=" "
                value={Details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={250}
                ref={nameRef}
              />
              <label className={`exp-form-labels ${error && !Details ? 'text-danger' : ''}`}>
                Name <span className="text-danger">*</span>
              </label>
            </div>
            </div>

            {/* Status */}
            <div className="form-block col-md-3">
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
                ref={statusRef}
              />
              <label className={`floating-label ${error && !status ? 'text-danger' : ''}`}>
                Status<span className="text-danger">*</span>
              </label>
            </div>
            </div>

            {/* Delete Permission */}
            <div className="form-block col-md-3">
              <div
              className={`inputGroup selectGroup 
      ${selectedDelete ? "has-value" : ""} 
      ${isSelectDelete ? "is-focused" : ""}`}
            >
              <Select
                value={selectedDelete}
                onChange={handleChangeDelete}
                options={filteredOptionDelete}
                placeholder=" "
                onFocus={() => setIsSelectDelete(true)}
                onBlur={() => setIsSelectDelete(false)}
                classNamePrefix="react-select"
                isClearable
                ref={delRef}
              />
              <label className={`floating-label ${error && !deletePermission ? 'text-danger' : ''}`}>
                Delete Permission<span className="text-danger">*</span>
              </label>
            </div>
            </div>

            {/* Save Button */}
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

export default IntermediaryHdrInput;