import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import { AgGridReact } from "ag-grid-react";
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Input({ }) {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [userDrop, setUserDrop] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [user, setUser] = useState("");
  const [projectDrop, setProjectDrop] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [project, setProject] = useState("");
  const [projectId, setProjectId] = useState("");
  const [Projectname, setProjectname] = useState("");
  const [userId, setUserId] = useState("");
  const [user_name, setuser_name] = useState("");
  const [userCodeDrop, setUserCodeDrop] = useState([]);
  const [projectCodeDrop, setProjectCodeDrop] = useState([]);
  const [status, setstatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [statusdrop, setStatusdrop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelectProject, setIsSelectProject] = useState(false);
  const [isSelectUser, setIsSelectUser] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const projectMappingPermission = permissions
    .filter((permission) => permission.screen_type === "ProjectMapping")
    .map((permission) => permission.permission_type.toLowerCase());

  // //UserEffect for React Select
  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getProjectDrop`)
  //     .then((data) => data.json())
  //     .then((val) => setProjectDrop(val));
  // }, []);


  const company_code = sessionStorage.getItem("selectedCompanyCode")

  useEffect(() => {
    if (!company_code) return; // Only run if company_code exists

    fetch(`${config.apiBaseUrl}/getProjectDrop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectDrop(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/Usercode`)
      .then((data) => data.json())
      .then((val) => setUserDrop(val));
  }, []);

  const filteredOptionProject = Array.isArray(projectDrop)
    ? projectDrop.map((option) => ({
      value: option.ProjectID,
      label: `${option.ProjectID} - ${option.ProjectName}`
    }))
    : [];

  // const filteredOptionUser = Array.isArray(userDrop)
  //   ? userDrop.map((option) => ({
  //     value: option.user_code,
  //     label: `${option.user_code} - ${option.user_name}`,
  //   }))
  //   : [];
  const filteredOptionUser = Array.isArray(userDrop)
    ? userDrop.map((option) => ({
      value: option.user_code,
      label: `${option.user_code} - ${option.user_name}`,
    }))
    : [];

  //    useEffect(() => {
  //   const fetchUserCodes = async () => {
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/getEmployeeId`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ company_code: sessionStorage.getItem('selectedCompanyCode') })
  //       });
  //       const data = await response.json();

  //       if (response.ok && Array.isArray(data)) {
  //         setUserDrop(data);

  //         // Optionally set the first user as selected if needed
  //         if (data.length > 0) {
  //           const defaultOption = {
  //             value: data[0].EmployeeId,
  //             label: data[0].First_Name
  //           };
  //           setSelectedUser(defaultOption);
  //           setUser(defaultOption.value);
  //         }
  //       } else {
  //         console.warn("No data found for user codes");
  //         setUserDrop([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user codes:", error);
  //     }
  //   };

  //   fetchUserCodes();
  // }, []);
  //  useEffect(() => {
  //         fetch(`${config.apiBaseUrl}/getTaskUserID`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             // user_code: sessionStorage.getItem("selectedUserCode"),
  //             company_code: sessionStorage.getItem("selectedCompanyCode"),
  //           }),
  //         })
  //           .then((response) => response.json())
  //           .then(setUserDrop)
  //           .catch((error) => console.error("Error fetching user codes:", error));
  //       }, []);


  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');

    fetch(`${config.apiBaseUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code }),
    })
      .then((response) => response.json())
      .then((val) => {
        setStatusdrop(val);

        if (val.length > 0) {
          const firstOption = {
            value: val[0].attributedetails_name,
            label: val[0].attributedetails_name,
          };
          setSelectedStatus(firstOption);
          setstatus(firstOption.value);
        }
      })
      .catch((error) => {
        console.error('Error fetching status data:', error);
      });
  }, []);

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setstatus(selectedStatus ? selectedStatus.value : '');
  };


  const handleChangeProject = (selectedProject) => {
    setSelectedProject(selectedProject);
    setProject(selectedProject ? selectedProject.value : '');
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUser(selectedUser ? selectedUser.value : '');
  };

  // //useEffect for Ag grid Filter Option
  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getProjectDrop`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const ProjectOption = data.map((option) => option.ProjectID);
  //       setProjectCodeDrop(ProjectOption);
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);


  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/usercode`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const UserOption = data.map((option) => option.user_code);
  //       setUserCodeDrop(UserOption);
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      // minWidth: 100,
      // maxWidth: 100,
      cellRenderer: (params) => {
        const cellWidth = params.column.getActualWidth();
        const isWideEnough = cellWidth > 20;
        const showIcons = isWideEnough;

        return (
          <div className="position-relative d-flex align-items-center" style={{ minHeight: '100%', justifyContent: 'center' }}>
            {showIcons && (
              <>
                <span
                  className="icon mx-2"
                  onClick={() => handleUpdate(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => handleDelete(params.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-trash"></i>
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Project ID",
      field: "ProjectID",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: projectCodeDrop,
      },
    },
    {
      headerName: "Project Name",
      field: "ProjectName",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: projectCodeDrop,
      },
    },
    {
      headerName: "User ID",
      field: "userID",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: userCodeDrop,
      },
    },
    {
      headerName: "User Name",
      field: "user_name",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: userCodeDrop,
      },
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      hide: true
    },
  ]
  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleSave = async () => {
    setLoading(true);
    if (!user || !project) {
      setError(" ");
      toast.warning("Error: Missing required fields");
      return;
    }
    try {
      const Header = {
        ProjectID: project,
        userID: user,
        created_by: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem('selectedCompanyCode')
      };

      const response = await fetch(`${config.apiBaseUrl}/addProjectMapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Header),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        setTimeout(() => {
          toast.success("Data inserted successfully!", {
            onClose: () => window.location.reload(),
          });
        }, 1000);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
    }finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const body = {
        ProjectID: projectId,
        ProjectName: Projectname,
        user_name: user_name,
        userid: userId,
        company_code: sessionStorage.getItem('selectedCompanyCode')

      };

      const response = await fetch(`${config.apiBaseUrl}/getProjectMapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const fetchedData = await response.json();
        const newRows = fetchedData.map((matchedItem) => ({
          ProjectID: matchedItem.ProjectID,
          userID: matchedItem.userID,
          ProjectName: matchedItem.ProjectName,
          user_name: matchedItem.user_name,
          userID: matchedItem.userID,
          keyfield: matchedItem.keyfield,
        }));
        setRowData(newRows);
      } else if (response.status === 404) {
        console.log("Data Not found");
        toast.warning("Data Not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
    }finally {
      setLoading(false);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const reloadData = () => {
    window.location.reload();
  };


  const handleUpdate = async (rowData) => {
    try {
      const modified_by = sessionStorage.getItem('selectedUserCode');
      const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };
      const response = await fetch(`${config.apiBaseUrl}/updateProjectMapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified-by": modified_by
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        toast.success("Data updated successfully", {
          onClose: () => handleSearch(), // Runs handleSearch when toast closes
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    }
  };

  const handleDelete = async (rowData) => {
    try {
      const dataToSend = { editedData: Array.isArray(rowData) ? rowData : [rowData] };
      const response = await fetch(`${config.apiBaseUrl}/deleteProjectMapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        toast.success("Data deleted successfully", {
          onClose: () => handleSearch(),
        });
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error('Error Deleting Data: ' + error.message);
    }
  };

  return (
    <div class="container-fluid Topnav-screen">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Project Mapping</h1>

          <div className="action-wrapper desktop-actions">
            {['add', 'all permission'].some(p => projectMappingPermission.includes(p)) && (
              <div className="action-icon add" onClick={handleSave}>
                <span className="tooltip">Save</span>
                <i class="fa-solid fa-floppy-disk"></i>
              </div>
            )}
            <div className="action-icon print" onClick={reloadGridData}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {['add', 'all permission'].some(p => projectMappingPermission.includes(p)) && (
                <li className="dropdown-item" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
                </li>
              )}

              <li className="dropdown-item" onClick={reloadGridData}>
                <i className="fa-solid fa-arrow-rotate-right"></i>
              </li>

            </ul>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <div className="row g-3">

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedProject ? "has-value" : ""} 
              ${isSelectProject ? "is-focused" : ""}`}
            >
              <Select
                id="gradeid"
                placeholder=" "
                onFocus={() => setIsSelectProject(true)}
                onBlur={() => setIsSelectProject(false)}
                classNamePrefix="react-select"
                isClearable
                onChange={handleChangeProject}
                value={selectedProject}
                options={filteredOptionProject}
              />
              <label for="sname" className={`floating-label ${error && !project ? 'text-danger' : ''}`}>Project<span className="text-danger">*</span></label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedUser ? "has-value" : ""} 
              ${isSelectUser ? "is-focused" : ""}`}
            >
              <Select
                id="gradeid"
                className="exp-input-field"
                placeholder=" "
                onFocus={() => setIsSelectUser(true)}
                onBlur={() => setIsSelectUser(false)}
                classNamePrefix="react-select"
                isClearable
                onChange={handleChangeUser}
                value={selectedUser}
                options={filteredOptionUser}
              />
              <label for="sname" className={`floating-label ${error && !user ? 'text-danger' : ''}`}>User<span className="text-danger">*</span></label>
            </div>
          </div>

          {/*<div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                type='Text'
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                classNamePrefix="react-select"
                isClearable
                onChange={handleChangeStatus}
                value={selectedStatus}
                options={filteredOptionStatus}
              // onKeyDown={(e) => e.key === "Enter" && handleChange()}
              />
              <label className="floating-label">Status</label>
            </div>
          </div> */}
        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <h5>Search Criteria :</h5>
        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">Project </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="ProjectName"
                type="text"
                placeholder=" "
                autoComplete="off"
                className="exp-input-field form-control"
                value={Projectname}
                maxLength={255}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onChange={(e) => setProjectname(e.target.value)}
              />
              <label for="cname" className="exp-form-labels">Project Name</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="fdate"
                class="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={userId}
                onChange={handleChangeUser}
                options={filteredOptionUser}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <label className="exp-form-labels">User</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="username"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={user_name}
                onChange={(e) => setuser_name(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={250}
              />
              <label for="username" className="exp-form-labels">User Name</label>
            </div>
          </div>

          <div className="col-12">
            <div className="search-btn-wrapper">
              <div className="icon-btn search" onClick={handleSearch}>
                <span className="tooltip">Search</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              <div className="icon-btn reload" onClick={reloadData}>
                <span className="tooltip">Reload</span>
                <i className="fa-solid fa-rotate-right"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light rounded mt-2 container-form-box" style={{ width: "100%" }}>
          <div className="ag-theme-alpine mt-2" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              pagination={true}
              paginationAutoPageSize={true}
              gridOptions={gridOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Input;