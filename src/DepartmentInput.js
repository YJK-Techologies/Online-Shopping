import React, { useState, useRef, useEffect } from "react";
import "./input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './Loading';
const config = require("./Apiconfig");



function DepartmentInput({ }) {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmenntName, setDepartmenntName] = useState("");
  const [error, setError] = useState("");
  const Location = useRef(null);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const [key_field, setkey_field] = useState(false);
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const created_by = sessionStorage.getItem("selectedUserCode");
  const [loading, setLoading] = useState(false);
  const code = useRef(null);
  const Name = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);

  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  console.log(selectedRow);

  const clearInputFields = () => {
    setDepartmentCode("");
    setDepartmenntName("");
  };

  useEffect(() => {
    if (mode === "update" && selectedRow && !isUpdated) {

      setDepartmentCode(selectedRow.dept_id || "");
      setDepartmenntName(selectedRow.dept_name || "");
      setkey_field(selectedRow.key_field || "");

    } else if (mode === "create") {
      clearInputFields();
    }
  }, [mode, selectedRow, isUpdated]);

  const handleInsert = async () => {
    if (!departmentCode || !departmenntName) {
      setError(" ");
      toast.warning("Missing Required Fields");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/AddDepartment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
          dept_id: departmentCode,
          dept_name: departmenntName,
          created_by: sessionStorage.getItem("selectedUserCode"),
        }),
      });
      if (response.ok) {
        toast.success("Data inserted Successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message, {

        });
      } else {
        console.error("A department with this code or name already exists. Kindly enter an alternative.");
        toast.error('A department with this code or name already exists. Kindly enter an alternative.', {

        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message, {

      });
    }
    finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
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
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  const handleNavigatesToForm = () => {
    navigate("/Department");
  };

  const handleUpdate = async () => {
    if (!departmentCode || !departmenntName) {
      setError(" ");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/DepartmentUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_id: departmentCode,
          dept_name: departmenntName,
          key_field,
          created_by,
          modified_by,
        }),
      });
      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => clearInputFields()
        });
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error(errorResponse.message);
        toast.warning(errorResponse.message);
      } else {
        console.error("Failed to insert data");
        toast.error("Failed to Update data");
      }
    } catch (error) {
      console.error("Error Update data:", error);
      toast.error('Error inserting data: ' + error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div class="container-fluid Topnav-screen ">
      <div className="">
        <div class="">
          {loading && <LoadingScreen />}
          <ToastContainer position="top-right" className="toast-design" theme="colored" />

          <div className="shadow-lg p-1 bg-light rounded main-header-box">
            <div className="header-flex">
              <h1 className="page-title">{mode === "update" ? 'Update Department' : 'Add Department '}</h1>
              <div className="action-wrapper">
                <div className="action-icon delete" onClick={handleNavigatesToForm}>
                  <span className="tooltip">Close</span>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
            <div className="row g-3">

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="departmentCode"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    title="Please enter the attribute header code"
                    value={departmentCode}
                    onChange={(e) => setDepartmentCode(e.target.value)}
                    maxLength={100}
                    autoComplete="off"
                    ref={code}
                    onKeyDown={(e) => handleKeyDown(e, Name, code)}
                    readOnly={mode === "update"}
                  />
                  <label for="cno" className={`exp-form-labels ${error && !departmentCode ? 'text-danger' : ''}`}>Department Code<span className="text-danger">*</span></label>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inputGroup">
                  <input
                    id="departmenntName"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required
                    autoComplete="off"
                    title="Please enter the attribute header name"
                    value={departmenntName}
                    maxLength={250}
                    onChange={(e) => setDepartmenntName(e.target.value)}
                    ref={Name}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (mode === "create") {
                          handleInsert();
                        } else {
                          handleUpdate();
                        }
                      }
                    }}
                  />
                  <label for="cno" className={`exp-form-labels ${error && !departmenntName ? 'text-danger' : ''}`}>Department Name<span className="text-danger">*</span></label>
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
export default DepartmentInput;
