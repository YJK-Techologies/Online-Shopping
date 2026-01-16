import { useState, useEffect } from "react";
import "../input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import { showConfirmationToast } from '../ToastConfirmation';
import LoadingScreen from '../Loading';
const config = require('../Apiconfig');

function Project({ }) {
  const today = new Date().toISOString().split("T")[0];
  const [saveButtonVisible, setSaveButtonVisible] = useState(true);
  const [StartDate, setStartDate] = useState(today);
  const [EndDate, setEndDate] = useState(today);
  const [PriorityLevel, setPriorityLevel] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [TaskStatus, setTaskStatus] = useState('');
  const [ProjectName, setProjectName] = useState('');
  const [ProjectManager, setProjectManager] = useState('');
  const [ProjectDescription, setProjectDescription] = useState('');
  const [status_type, setstatus_type] = useState("");
  const [rowData, setrowData] = useState([]);
  const [PriorityDrop, setPriorityDrop] = useState([]);
  const [selectedPriortyLeavel, setSelectedPriortyLeavel] = useState('');
  const [selectedTaskStatus, setSelectedTaskStatus] = useState('');
  const [editedData, setEditedData] = useState([]);
  const [ProjectId, setProjectId] = useState("");
  const [Projectname, setProjectname] = useState("");
  const [Startdate, setStartdate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [Priority, setPriority] = useState("");
  const [selectedPriorty, setSelectedPriorty] = useState("");
  const [selctedTask, setSelectedTask] = useState("");
  const [Task, setTask] = useState("");
  const [StatusGriddrop, setStatusGriddrop] = useState([]);
  const [Taskstatusdrop, setTaskStatusdrop] = useState([]);
  const [Managerdrop, setManagerdrop] = useState([]);
  const [PriorityGridDrop, setPriorityGridDrop] = useState([]);
  const [selectedmanager, setselectedmanager] = useState('');
  const [manager, setmanager] = useState("");
  const [selectedProject, setselectedproject] = useState("")
  const [EstimatedHours, setEstimatedHours] = useState("")
  const [error, setError] = useState('');
  const [ProjectID, setProjectID] = useState('');
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelectManager, setIsSelectManager] = useState(false);
  const [isSelectPriority, setIsSelectPriority] = useState(false);
  const [isSelectStatus, setIsSelectStatus] = useState(false);
  const [isSearchManager, setIsSearchManager] = useState(false);
  const [isSearchPriority, setIsSearchPriority] = useState(false);
  const [isSearchStatus, setIsSearchStatus] = useState(false);

  // const options = [
  //   { value: 'add', label: 'Add' },
  //   { value: 'update', label: 'Update ' }
  // ];
  // const handleSelectChange = (selectedOption) => {
  //   setLoanAction(selectedOption.value);
  // };


  // const arrayBufferToBase64 = (buffer) => {
  //   let binary = "";
  //   const bytes = new Uint8Array(buffer);
  //   for (let i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // };
  // const [data, setData] = useState([]);  // State to store the fetched data
  // const [loading, setLoading] = useState(true); 

  const handleNavigateWithRowData = (selectedRow) => {
    navigate("/Project", { state: { mode: "update", selectedRow } });
  };

  const columnDefs = [
    {
      headerName: "Actions",
      field: "actions",
      // minWidth: 110,
      // maxWidth: 110,
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
                  onClick={() => saveEditedData(params.data, params.node.data)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>

                <span
                  className="icon mx-2"
                  onClick={() => deleteSelectedRows(params.data)}
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
      // minWidth: 250,
      // maxWidth: 250,
      cellStyle: { textAlign: "left" },
      cellEditorParams: {
        // maxLength: 50,
      },
      cellRenderer: (params) => {
        const handleClick = () => {
          handleNavigateWithRowData(params.data);
        };

        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      headerName: "Project Name",
      field: "ProjectName", filter: 'agTextColumnFilter',
      // minWidth: 210, maxWidth: 250,
      editable: true,
      // maxLength: 255
    },
    {
      headerName: "Project Description",
      field: "ProjectDescription",
      filter: 'agNumberColumnFilter',
      // minWidth: 250, maxWidth: 250,
      editable: true,
      // maxLength: 255
    },
    {
      headerName:
        "Project Manager",
      field: "ProjectManager",
      filter: 'agTextColumnFilter',
      // minWidth: 200, maxWidth: 250,
      editable: true
    },
    {
      headerName: "Start Date", field: "StartDate", filter: 'agDateColumnFilter',
      // minWidth: 150, maxWidth: 150,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "End Date", field: "EndDate", filter: 'agDateColumnFilter',
      // minWidth: 150, maxWidth: 150,
      valueFormatter: (params) => formatDate(params.value),
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = new Date(cellValue.split('/').join('-'));
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "Priority Level",
      field: "PriorityLevel",
      filter: 'agNumberColumnFilter',
      // minWidth: 130,
      // maxWidth: 130,
      // maxLength: 15,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: PriorityGridDrop
      }
    },
    {
      headerName: "Task Status",
      field: "TaskStatus",
      filter: 'agNumberColumnFilter',
      // minWidth: 130,
      // maxWidth: 130,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: StatusGriddrop
      },
    },
  ];

  // const defaultColDef = {
  //   resizable: true,
  //   wrapText: true,
  //   sortable: true,
  //   editable: true,
  //   filter: true,
  // };

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setPriorityGridDrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map(option => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/ESSManager`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // user_code: sessionStorage.getItem("selectedUserCode"),
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((response) => response.json())
      .then(setManagerdrop)
      .catch((error) => console.error("Error fetching warehouse:", error));
  }, []);

  const handleChangestatus = (selectedstatus) => {
    setSelectedTaskStatus(selectedstatus);
    setstatus_type(selectedstatus ? selectedstatus.value : '');
    setHasValueChanged(true);
  };

  const filteredOptionTransaction = Taskstatusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  //status
  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getTaskstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setTaskStatusdrop(val));
  }, []);

  const filteredOptionTask = [{ value: 'All', label: 'All' }, ...Taskstatusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }));

  const filteredOptionManagers = [{ value: 'All', label: 'All' }, ...Managerdrop.map((option) => ({
    value: option.EmployeeId,
    label: `${option.EmployeeId}-${option.full_name}`,
  }))];

  // const filteredOptionManager = Array.isArray(Managerdrop) ? Managerdrop.map((option) => ({
  //   value: option.EmployeeId,
  //   label: `${option.user_code}-${option.user_name}`,
  // })) : [];  // Return an empty array if Managerdrop is not an array

  const handleChangeTask = (selectedstatus) => {
    setSelectedTask(selectedstatus);
    setTask(selectedstatus ? selectedstatus.value : '');
    setHasValueChanged(true);
  };

  const filteredOptionPriority = [{ value: 'All', label: 'All' }, ...PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  const handleChangePriority = (selectedPriorty) => {
    setSelectedPriorty(selectedPriorty);
    setPriority(selectedPriorty ? selectedPriorty.value : '');
  };

  useEffect(() => {
    const company_code = sessionStorage.getItem('selectedCompanyCode');
    fetch(`${config.apiBaseUrl}/getPriority`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company_code })
    })
      .then((data) => data.json())
      .then((val) => setPriorityDrop(val));
  }, []);

  const filteredOptionPriorityLevel = PriorityDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangePriorityLevel = (selectedPriortyLeavel) => {
    setSelectedPriortyLeavel(selectedPriortyLeavel);
    setPriorityLevel(selectedPriortyLeavel ? selectedPriortyLeavel.value : '');
  };

  const handleChangemanager = (selectedOption) => {
    setselectedmanager(selectedOption);
    setProjectManager(selectedOption ? selectedOption.value : '');
    setError(false);
  };

  const handleChangeCode = (selectedOption) => {
    setselectedproject(selectedOption);
    setmanager(selectedOption ? selectedOption.value : '');
    setError(false);
  };

  // const handleUpdate = async (e) => {
  //   e.preventDefault(); 

  //   setIsSaving(true); 
  //   setMessage(''); 

  //   try {

  //     const data = {
  //       ProjectID,
  //       ProjectName,
  //       ProjectManager,
  //       ProjectDescription,
  //       StartDate,
  //       EndDate,
  //       PriorityLevel,
  //       TaskStatus: status_type,
  //       modified_by: sessionStorage.getItem('selectedUserCode') 
  //     };

  //     const response = await fetch(`${config.apiBaseUrl}/updateProject`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.status === 200) { 
  //       toast.success("Project data updated successfully!");
  //     } else {
  //       toast.error(response.data.message || "Failed to update project data");
  //     }
  //   } catch (error) {
  //     toast.error('Error updating data: ' + (error.response?.data?.message || error.message));
  //   } finally {
  //     setIsSaving(false); 
  //   }
  // };

  const handleSave = async (e) => {
    try {
      setLoading(true);
      if (!ProjectName || !ProjectManager || !ProjectDescription || !StartDate || !EndDate || !PriorityLevel || !status_type || !EstimatedHours) {
        setError(" ");
        toast.warning("Error:Missing Required Fields")
        return;
      }

      e.preventDefault();
      setSaveButtonVisible(true);
      setIsSaving(true);
      setMessage('');

      const data = {
        ProjectName,
        ProjectManager,
        ProjectDescription,
        StartDate,
        EndDate,
        PriorityLevel,
        EstimatedHours,
        TaskStatus: status_type,
        created_by: sessionStorage.getItem('selectedUserCode'),
        company_code: sessionStorage.getItem('selectedCompanyCode')
      };


      const response = await fetch(`${config.apiBaseUrl}/addProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const searchData = await response.json();
        console.log(searchData);
        const { ProjectID } = searchData[0];
        setProjectID(ProjectID);
        toast.success("data inserted successfully!");

      }
      else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message);
      }

    } catch (error) {
      toast.error("Error inserting data: " + error.message);
    }finally {
      setLoading(false);
    }
  };

  const saveEditedData = async () => {
    try {
      const modified_by = sessionStorage.getItem('selectedUserCode');
      const selectedRowsData = Array.isArray(editedData) ? editedData.filter(row => row.ProjectID === row.ProjectID) : [editedData];
      console.log(selectedRowsData)
      const response = await fetch(`${config.apiBaseUrl}/updateProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "modified_by": modified_by,

        },
        body: JSON.stringify({ editedData: selectedRowsData, company_code: sessionStorage.getItem("selectedCompanyCode") }),
      });

      if (response.status === 200) {
        setTimeout(() => {
          toast.success("Data Updated Successfully")
          handleSearch();
        }, 1000);
        return;
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error Updating Data: " + error.message);
    }
  };

  const deleteSelectedRows = async (rowData) => {
    const ProjectIDDelete = { ProjectIDToDelete: Array.isArray(rowData) ? rowData : [rowData] };

    showConfirmationToast(
      "Are you sure you want to delete the data in the selected rows?",
      async () => {
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteProject`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(ProjectIDDelete),
          });

          if (response.ok) {
            toast.success("Data deleted successfully");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error deleting data: " + error.message);
        }
      },
      () => {
        toast.info("Data delete cancelled.");
      }
    );
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.ProjectID === params.data.ProjectID
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setrowData(updatedRowData);
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const reloadData = () => {
    setrowData([])
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/projectSC`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ProjectID: ProjectId,
          ProjectName: Projectname,
          ProjectManager: manager,
          StartDate: Startdate,
          EndDate: Enddate,
          PriorityLevel: Priority,
          TaskStatus: Task,
          company_code: sessionStorage.getItem("selectedCompanyCode")
        })
      });

      if (response.ok) {
        const resultData = await response.json();
        setrowData(resultData);
      } else if (response.status === 404) {
        setrowData([]);
        toast.warning("Data not found");
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data: " + error.message);
    }finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div class="container-fluid Topnav-screen ">
      {loading && <LoadingScreen />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-1 bg-light rounded main-header-box">
        <div className="header-flex">
          <h1 className="page-title">Project</h1>

          <div className="action-wrapper desktop-actions">
            {/* {saveButtonVisible && ['add', 'all permission'].some(permission => employeePermissions.includes(permission)) && ( */}
            <div className="action-icon add" onClick={handleSave}>
              <span className="tooltip">save</span>
              <i class="fa-solid fa-floppy-disk"></i>
            </div>
            {/*})}*/}

            <div className="action-icon print" onClick={reloadGridData}>
              <span className="tooltip">Reload</span>
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown mobile-actions">
            <button className="btn btn-primary dropdown-toggle p-1" data-bs-toggle="dropdown">
              <i className="fa-solid fa-list"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end text-center">

              {/* {saveButtonVisible && ['add', 'all permission'].some(p => employeePermissions.includes(p)) && ( */}
              <li className="dropdown-item" onClick={handleSave}>
                <i className="fa-solid fa-floppy-disk text-success fs-4"></i>
              </li>
              {/* )} */}

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
            <div className="inputGroup">
              <input
                id="ProjectID"
                className="exp-input-field form-control p-2"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={ProjectID}
                onChange={(e) => setProjectID(e.target.value)}
                maxLength={50}
                readOnly
              />
              <label className="exp-form-labels">Project</label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="loanID"
                type="text"
                className="exp-input-field form-control"
                placeholder=" "
                autoComplete="off"
                maxLength={255}
                value={ProjectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <label htmlFor="EmployeeId" className={`exp-form-labels ${error && !ProjectName ? 'text-danger' : ''}`}>
                Project Name<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedmanager ? "has-value" : ""} 
              ${isSelectManager ? "is-focused" : ""}`}
            >
              <Select
                id="LoanEligibleAmount"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectManager(true)}
                onBlur={() => setIsSelectManager(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedmanager}
                options={filteredOptionManager}
                onChange={handleChangemanager}
                maxLength={18}
              />
              <label for="add1" className={`floating-label ${error && !ProjectManager ? 'text-danger' : ''}`}>
                Project Manager<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EndDate"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={EstimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                maxLength={100}
              />
              <label for="add3" className={`exp-form-labels ${error && !EstimatedHours ? 'text-danger' : ''}`}>
                Estimated Hours<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <textarea
                id="Approvedby"
                className="form-control"
                placeholder=" "
                autoComplete="off"
                value={ProjectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
              <label for="sname" className={`exp-form-labels ${error && !ProjectDescription ? 'text-danger' : ''}`}>
                Project Description<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="StartDate"
                class="exp-input-field form-control"
                type="date"
                placeholder=" "
                autoComplete="off"
                value={StartDate}
                onChange={(e) => setStartDate(e.target.value)}
                maxLength={100}
              />
              <label for="add2" className={`exp-form-labels ${error && !StartDate ? 'text-danger' : ''}`}>
                Start Date<span className="text-danger">*</span>
              </label>

            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EndDate"
                class="exp-input-field form-control"
                type="date"
                placeholder=" "
                autoComplete="off"
                value={EndDate}
                onChange={(e) => setEndDate(e.target.value)}
                maxLength={100}
              />
              <label for="add3" className={`${error && !EndDate ? 'text-danger' : ''}`}>
                End Date<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedPriortyLeavel ? "has-value" : ""} 
              ${isSelectPriority ? "is-focused" : ""}`}
            >
              <Select
                id="PriorityLevel"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectPriority(true)}
                onBlur={() => setIsSelectPriority(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedPriortyLeavel}
                onChange={handleChangePriorityLevel}
                options={filteredOptionPriorityLevel}
                maxLength={15}
              />
              <label for="tcode" className={`floating-label ${error && !PriorityLevel ? 'text-danger' : ''}`}>
                Priority Level<span className="text-danger">*</span>
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedTaskStatus ? "has-value" : ""} 
              ${isSelectStatus ? "is-focused" : ""}`}
            >
              <Select
                id="TaskStatus"
                type="text"
                placeholder=" "
                onFocus={() => setIsSelectStatus(true)}
                onBlur={() => setIsSelectStatus(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedTaskStatus}
                onChange={handleChangestatus}
                options={filteredOptionTransaction}
                maxLength={25}
              />
              <label for="tcode" className={`floating-label ${error && !TaskStatus ? 'text-danger' : ''}`}>
                Status<span className="text-danger">*</span>
              </label>
            </div>
          </div>

        </div>
      </div>

      <div className="shadow-lg p-3 bg-light rounded mt-2 container-form-box">
        <h5>Search Criteria :</h5>

        <div className="row g-3">

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EmployeeId"
                className="exp-input-field form-control"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={ProjectId}
                onChange={(e) => setProjectId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={50}
              />
              <label htmlFor="EmployeeId" className="exp-form-labels">
                Project
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="ProjectName"
                type="text"
                placeholder=" "
                className="exp-input-field form-control"
                autoComplete="off"
                value={Projectname}
                maxLength={255}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onChange={(e) => setProjectname(e.target.value)}
              />
              <label for="cname" className="exp-form-labels">
                Project Name
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedProject ? "has-value" : ""} 
              ${isSearchManager ? "is-focused" : ""}`}
            >
              <Select
                id="ProjectManager"
                class="exp-input-field"
                type="text"
                placeholder=" "
                onFocus={() => setIsSearchManager(true)}
                onBlur={() => setIsSearchManager(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedProject}
                options={filteredOptionManagers}
                onChange={handleChangeCode}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={18}
              />
              <label for="add1" className="floating-label">
                Project Manager
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="StartDate"
                class="exp-input-field form-control"
                type="date"
                placeholder=" "
                autoComplete="off"
                value={Startdate}
                onChange={(e) => setStartdate(e.target.value)}
                maxLength={100}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <label for="add2" className="exp-form-labels">
                Start Date
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div className="inputGroup">
              <input
                id="EndDate"
                class="exp-input-field form-control"
                type="date"
                placeholder=" "
                autoComplete="off"
                value={Enddate}
                onChange={(e) => setEnddate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={100}
              />
              <label for="add3" className="exp-form-labels">
                End Date
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selectedPriorty ? "has-value" : ""} 
              ${isSearchPriority ? "is-focused" : ""}`}
            >
              <Select
                id="PriorityLevel"
                className="exp-input-field"
                type="text"
                placeholder=" "
                onFocus={() => setIsSearchPriority(true)}
                onBlur={() => setIsSearchPriority(false)}
                classNamePrefix="react-select"
                isClearable
                value={selectedPriorty}
                onChange={handleChangePriority}
                options={filteredOptionPriority}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={15}
              />
              <label for="tcode" className="floating-label">
                Priority Level
              </label>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`inputGroup selectGroup 
              ${selctedTask ? "has-value" : ""} 
              ${isSearchStatus ? "is-focused" : ""}`}
            >
              <Select
                id="TaskStatus"
                className="exp-input-field"
                type="text"
                placeholder=" "
                onFocus={() => setIsSearchStatus(true)}
                onBlur={() => setIsSearchStatus(false)}
                classNamePrefix="react-select"
                isClearable
                value={selctedTask}
                onChange={handleChangeTask}
                options={filteredOptionTask}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={25}
              />
              <label for="tcode" className="floating-label">
                Status
              </label>
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
          <div className="ag-theme-alpine mt-3" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              // defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              paginationAutoPageSize={true}
              pagination={true}
              gridOptions={gridOptions}
            />
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}
export default Project;
