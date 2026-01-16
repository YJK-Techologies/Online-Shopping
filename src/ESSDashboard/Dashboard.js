import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import Circle from '../DashboardImages/circle.svg'
import { Doughnut, Bar } from "react-chartjs-2";
import { getElementAtEvent } from "react-chartjs-2";
import Vector from './Team.png';
import Select from "react-select";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ArcElement
} from "chart.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../Apiconfig';
import { publicIpv4 } from "public-ip";
import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ArcElement);

const Dashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [time, updateTime] = useState(new Date());
  const [viewChart, setViewChart] = useState(true);
  const [timer, setTimer] = useState("00:00:00");
  const [secondsPassed, setSecondsPassed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [NewJoinees, setNewJoinees] = useState([]);
  const [SelectedManager, setSelectedManager] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [manager, setManager] = useState("");
  const [Managerdrop, setManagerdrop] = useState([]);
  const [error, setError] = useState(null);
  const [FromDate, setFromDate] = useState([]);
  const gridApiRef = useRef(null);
  const gridColumnApiRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [rowDataTeamList, setRowDataTeamList] = useState([]);
  const user_code = sessionStorage.getItem('selectedUserCode');

  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [Manager, setmanager] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [pfNo, setPfNo] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [maritalStatusDrop, setMaritalStatusDrop] = useState([]);
  const [shift, setShift] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [shiftDrop, setShiftDrop] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState("");
  const [totalActiveEmployees, setTotalActiveEmployees] = useState(0);
  const [formattedTotalActiveEmployees, setFormattedTotalActiveEmployees] = useState('0');
  const [TotalNetEarnings, setTotalNetEarnings] = useState(0);
  const [formatedTotalEarnings, setformatedTotalEarnings] = useState('0');
  const [FormatedTotalPayslip, setFormatedTotalPayslip] = useState('0');
  const [TotalPayslips, setTotalPayslips] = useState(0)

  const [isSelectMarital, setIsSelectMarital] = useState(false);
  const [isSelectShift, setIsSelectShift] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof totalActiveEmployees === 'number') {
      setFormattedTotalActiveEmployees(totalActiveEmployees.toLocaleString('en-IN'));
    } else {
      setFormattedTotalActiveEmployees('0');
    }
  }, [totalActiveEmployees]);

  useEffect(() => {
    if (typeof TotalNetEarnings === 'number') {
      setformatedTotalEarnings(TotalNetEarnings.toLocaleString('en-IN'));
    } else {
      setformatedTotalEarnings('0');
    }
  }, [TotalNetEarnings]);

  useEffect(() => {
    if (typeof TotalPayslips === 'number') {
      setFormatedTotalPayslip(TotalPayslips.toLocaleString('en-IN'));
    } else {
      setFormatedTotalPayslip('0');
    }
  }, [TotalPayslips]);

  useEffect(() => {
    const fetchTotalActiveEmployees = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalActiveEmployees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].TotalActiveEmployeesWithPayslip !== undefined) {
          const [{ TotalActiveEmployeesWithPayslip }] = data;
          setTotalActiveEmployees(TotalActiveEmployeesWithPayslip);
        } else {
          console.warn("Unexpected response or empty data:", data);
          setTotalActiveEmployees(0); // fallback
        }
      } catch (error) {
        console.error('Error fetching TotalActiveEmployees:', error);
        setTotalActiveEmployees(0); // fallback
      }
    };

    fetchTotalActiveEmployees();
  }, []);
  useEffect(() => {
    const fetchTotalNetEarnings = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalNetEarnings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].TotalNetEarnings_PreviousMonth !== undefined) {
          const [{ TotalNetEarnings_PreviousMonth }] = data;
          setTotalNetEarnings(TotalNetEarnings_PreviousMonth);
        } else {
          console.warn("Unexpected or empty response for Net Earnings:", data);
          setTotalNetEarnings(0); // fallback
        }
      } catch (error) {
        console.error("Error fetching Total Net Earnings:", error);
        setTotalNetEarnings(0); // fallback
      }
    };

    fetchTotalNetEarnings();
  }, []);




  useEffect(() => {
    const fetchTotalPayslips = async () => {
      try {
        const companyCode = sessionStorage.getItem("selectedCompanyCode");

        const response = await fetch(`${config.apiBaseUrl}/TotalPayslips`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company_code: companyCode }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].TotalPayslips !== undefined) {
          const [{ TotalPayslips }] = data;
          setTotalPayslips(TotalPayslips);
        } else {
          console.warn("Unexpected or empty response for Total Payslips:", data);
          setTotalPayslips(0);
        }
      } catch (error) {
        console.error("Error fetching Total Payslips:", error);
        setTotalPayslips(0);
      }
    };

    fetchTotalPayslips();
  }, []);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        // Get Device Details
        const userAgent = navigator.userAgent;
        setDeviceDetails(userAgent);

        // Get IP Address
        const ip = await publicIpv4(); // Correct function
        setIpAddress(ip);

        // Get Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude}, ${longitude}`);
            },
            (error) => {
              console.error("Error fetching location:", error);
              setLocation("Location unavailable");
            }
          );
        } else {
          setLocation("Geolocation not supported");
        }
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);


  const handleChangeShift = (selectedShift) => {
    setSelectedShift(selectedShift);
    setShift(selectedShift ? selectedShift.value : '');
  };

  const filteredOptionShift = [{ value: 'All', label: 'All' }, ...shiftDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getcompanyshift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),

      }),
    })
      .then((data) => data.json())
      .then((val) => setShiftDrop(val));
  }, []);


  const handleChangeMartial = (selectedMarital) => {
    setSelectedMaritalStatus(selectedMarital);
    setMaritalStatus(selectedMarital ? selectedMarital.value : '');
  };

  const filteredOptionMartial = [{ value: 'All', label: 'All' }, ...maritalStatusDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }))];

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getMartial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setMaritalStatusDrop(val));
  }, []);

useEffect(() => {
  const savedSeconds = localStorage.getItem("loggedSeconds");
  const savedCheckIn = localStorage.getItem("isCheckedIn");

  if (savedSeconds) {
    setSecondsPassed(Number(savedSeconds));
    setTimer(formatTime(Number(savedSeconds)));
  }

  if (savedCheckIn === "true") {
    setIsCheckedIn(true);

    // Resume timer automatically
    const startTime = Date.now() - Number(savedSeconds || 0) * 1000;

    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setSecondsPassed(elapsed);
      setTimer(formatTime(elapsed));
      localStorage.setItem("loggedSeconds", elapsed);
    }, 1000);

    setIntervalId(id);
  }
}, []);

const startTimer = () => {
  setIsCheckedIn(prev => {
    const newState = !prev;

    // SAVE CHECK-IN STATE
    localStorage.setItem("isCheckedIn", newState.toString());

    if (newState) {
      // ▶️ START TIMER
      const startTime = Date.now() - secondsPassed * 1000;

      const id = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setSecondsPassed(elapsed);
        setTimer(formatTime(elapsed));
        localStorage.setItem("loggedSeconds", elapsed);
      }, 1000);

      setIntervalId(id);
    } else {
      // ⏹ STOP TIMER
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }

      localStorage.removeItem("loggedSeconds");
    }

    return newState;
  });
};

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };


  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/LeaveStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            manager: user_code,
            company_code: sessionStorage.getItem("selectedCompanyCode"),
          }),
        });

        const data = await response.json();
        const formattedRequests = data.map((row) => ({
          id: row.EmployeeId,
          EmployeeId: row.EmployeeId,
          EmployeeName: row.EmployeeName,
          FromDate: formatDate(row.FromDate),
          ToDate: formatDate(row.ToDate),
          LeaveType: row.LeaveType,
          LeaveDays: row.LeaveDays,
          status: row.LeaveStatus,
        }));
        setLeaveRequests(formattedRequests);
      } catch (err) {
        setError(err.message || 'Error fetching leave requests');
        setLeaveRequests([])
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();

    const interval = setInterval(fetchLeaveRequests, 5000);

    return () => clearInterval(interval);
  }, []);



  const handleApproval = async (id, FromDate, isApproved) => {
    try {
      const leaveStatus = isApproved ? "Approved" : "Rejected";

      const [day, month, year] = FromDate.split("-");
      const backendDate = `${year}-${month}-${day}`;

      const response = await fetch(`${config.apiBaseUrl}/LeaveAuthorization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmployeeId: id,
          LeaveStatus: leaveStatus,
          FromDate: backendDate,
        }),
      });

      if (response.ok) {
        toast.success("Leave status updated successfully.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to process the request.");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("Error updating leave status:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bufferToBlobUrl = (buffer) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob); // Creates a Blob URL
    return url;
  };

  // Fetch data from the backend
  const fetchNewJoins = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/NewJoinee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      // Convert raw response to JSON
      const data = await response.json();

      // Convert buffer data to Blob URL (same logic you used)
      const employeesWithImages = data.map((joinee) => ({
        ...joinee,
        Photos:
          joinee.Photos && joinee.Photos.data
            ? bufferToBlobUrl(joinee.Photos.data)
            : "",
      }));

      // Set final formatted data into state
      setNewJoinees(employeesWithImages);

    } catch (error) {
      console.error("Error fetching new joinees:", error);
    }
  };

  useEffect(() => {
    fetchNewJoins();
  }, []);

  const fetchBirthdaysinfo = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/UpcomingBirthday`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      const employeesWithImages = responseData.map((person) => {
        console.log(person.Photos);  // Check image buffer structure

        return {
          ...person,
          Photos:
            person.Photos && person.Photos.data
              ? bufferToBlobUrl(person.Photos.data)
              : "",
        };
      });

      setUpcomingBirthdays(employeesWithImages);
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
    }
  };

  useEffect(() => {
    fetchBirthdaysinfo();
  }, []);


  const [teamData, setTeamData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to handle loading


  const fetchTeamData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/TeamListChart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode")

        }),
      });
      console.log(manager);

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data) && data.length > 0) {
        const teamNames = data.map((item) => item.DEPARTMENT);
        const teamDistribution = data.map((item) => item.EMPLOYEE);

        setTeamData({
          labels: teamNames,
          datasets: [
            {
              label: "Team Distribution",
              data: teamDistribution,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              borderColor: '#fff',
              borderWidth: 2,
            },
          ],
        });
      } else {
        setTeamData({ labels: [], datasets: [] });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTeamData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchGridData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/TeamList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      setRowDataTeamList(data)
    } catch (error) {
      console.error("Error fetching grid data:", error);
      setRowDataTeamList([]);
    }
  };

  useEffect(() => {
    if (!manager) return;

    if (viewChart) {
      fetchTeamData();
    } else {
      fetchGridData();
    }
  }, [manager, viewChart]);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getManager`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_code: sessionStorage.getItem("selectedCompanyCode"),
      }),
    })
      .then((data) => data.json())
      .then((val) => setManagerdrop(val));
  }, []);

  const filteredOptionManager = Managerdrop.map((option) => ({
    value: option.manager,
    label: option.manager,
  }));

  const handleChangeManager = (SelectedManager) => {
    setSelectedManager(SelectedManager);
    setManager(SelectedManager ? SelectedManager.value : '');
  };

  const teamOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // AG Grid columns
  const columnDefsList = [
    {
      headerName: "Employee Id",
      field: "EmployeeId",
      onCellClicked: (params) => {
        const empId = params.value;
        navigate('/AddEmployeeInfo', { state: { employeeId: empId } });
      },
    },
    {
      headerName: "Employee Name",
      field: "EmployeeName",
    },
    {
      headerName: "Department",
      field: "department_ID",
    },
    {
      headerName: "Designation",
      field: "designation_ID",
    },
  ];



  // AG Grid columns
  const columnDefs = [
    {
      headerName: "Employee ID",
      field: "Employeeid",
    },
    {
      headerName: "Employee Name",
      field: "First_Name",
    },
    {
      headerName: "Department",
      field: "department_ID",
    },
    {
      headerName: "Designation",
      field: "designation_ID",
    },
    {
      headerName: "Manager",
      field: "manager",
    },
    {
      headerName: "Shift",
      field: "shift",
    },
    {
      headerName: "Aadhaar No",
      field: "AAdhar_no",
    },
    {
      headerName: "PF No",
      field: "PFNo",
    },
    {
      headerName: "Account No",
      field: "Account_NO",
    },
    {
      headerName: "Marital Status",
      field: "marital_status",
    },
    {
      headerName: "Shift",
      field: "shift",
    },
    {
      headerName: "DOJ",
      field: "DOJ",
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      headerName: "DOL",
      field: "DOL",
      valueFormatter: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      updateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // const handleInsert = async () => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/addDailyattendance`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         EmployeeId: sessionStorage.getItem("selectedUserCode"),
  //       }),
  //     });

  //     if (response.status === 200) {
  //       toast.success("Data inserted successfully!");
  //       setIsCheckedIn((prev) => {
  //         if (prev) {
  //           stopTimer(); // Stop the timer if checked out
  //         } else {
  //           startTimer(); // Start or resume the timer if checked in
  //         }
  //         return !prev; // Toggle check-in state
  //       });
  //     } else if (response.status === 400) {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message);
  //     } else {
  //       toast.error("Failed to insert data");
  //     }
  //   } catch (error) {
  //     toast.error("Error inserting data: " + error.message);
  //   }
  // };

const handleTime = async () => {
  try {
    const route = isCheckedIn ? "/DailyLogOUT" : "/DailyLogin";

    const response = await fetch(`${config.apiBaseUrl}${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: sessionStorage.getItem('selectedUserCode'),
        DeviceDetails: deviceDetails,
        IP_Address: ipAddress,
        Location: location,
      }),
    });

    if (response.status === 200) {
      startTimer(); // 🔥 ONLY THIS
    } else if (response.status === 400) {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message);
    } else {
      toast.error("Failed to insert data");
    }
  } catch (error) {
    toast.error("Error inserting data: " + error.message);
  }
};

  // useEffect(() => {
  //   if (sessionStorage.getItem("elapsedTime")) {
  //     const storedTime = parseInt(sessionStorage.getItem("elapsedTime"));
  //     const hours = String(Math.floor(storedTime / 3600)).padStart(2, "0");
  //     const minutes = String(Math.floor((storedTime % 3600) / 60)).padStart(2, "0");
  //     const seconds = String(storedTime % 60).padStart(2, "0");
  //     setTimer(`${hours}:${minutes}:${seconds}`);
  //   }
  // }, []);


  // const handleRowSelection = (id, isChecked) => {
  //   if (isChecked) {
  //     console.log(`Row with ID ${id} selected`);
  //   } else {
  //     console.log(`Row with ID ${id} deselected`);
  //   }
  // };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (id, isChecked) => {
    setSelectedRows((prev) =>
      isChecked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/EmpSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Employeeid: employeeId,
          First_Name: employeeName,
          department_ID: department,
          designation_ID: designation,
          AAdhar_no: aadharNo,
          marital_status: maritalStatus,
          PFNo: pfNo,
          Account_NO: accountNo,
          shift: shift,
          manager: sessionStorage.getItem("selectedUserCode"),
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log(searchData)
        console.log("data fetched successfully")
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to data");
      }
    } catch (error) {
      console.error("Error fetching search data:", error);
      toast.error("Error fetching search data:", error);
    }
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  // useEffect(() => {
  //   const fetchAttendanceData = async () => {
  //     const manager = sessionStorage.getItem('selectedUserCode');
  //     try {
  //       const response = await fetch(`${config.apiBaseUrl}/OverallAttendance`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           manager: manager, company_code: sessionStorage.getItem("selectedCompanyCode"),
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!Array.isArray(data) || data.length === 0) {
  //         throw new Error("Invalid or empty data");
  //       }

  //       const statusColors = {
  //         Present: "#4CAF50",  // Green
  //         Absent: "#F44336",   // Red
  //         Late: "#FF9800",     // Orange
  //         HalfDay: "#2196F3",  // Blue
  //         Leave: "#9C27B0",    // Purple
  //       };

  //       const labels = data.map((item) => item.Status);
  //       const values = data.map((item) => item.Employees);

  //       const backgroundColors = labels.map((status) => statusColors[status] || "#9E9E9E");

  //       setChartData({
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: "Overall Attendance",
  //             data: values,
  //             backgroundColor: backgroundColors,
  //             borderColor: "#ccc",
  //             borderWidth: 1,
  //           },
  //         ],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchAttendanceData();
  // }, []);

  const [announcement, setAnnouncement] = useState("Loading...");

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getAnnouncementText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),
        }),
      });

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAnnouncement(data[0].MessageTitle);
      } else {
        setAnnouncement("No announcements available.");
      }
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
      setAnnouncement("Error loading announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncement();
    const interval = setInterval(fetchAnnouncement, 5000);
    return () => clearInterval(interval);
  }, []);

  //Over All Attendance Function
  const [showChart, setShowChart] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [leaveRowData, setLeaveRowData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchLeaveStatusData = async (LeaveStatus = '') => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/DashboardOverallAttendanceData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manager: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          LeaveStatus: LeaveStatus
        })
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        setLeaveRowData(result);
      } else {
        setLeaveRowData([]);
      }
    } catch (error) {
      console.error("Failed to fetch leave data", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/OverallAttendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manager: sessionStorage.getItem('selectedUserCode'),
          company_code: sessionStorage.getItem('selectedCompanyCode'),
        })
      });

      const result = await response.json();

      if (Array.isArray(result)) {
        const labels = result.map(item => item.Status);
        const dataValues = result.map(item => item.Employees);
        const backgroundColors = result.map(item =>
          item.Status === "Present"
            ? "green"
            : item.Status === "Leave"
              ? "blue"
              : "red"
        );

        const chart = {
          labels,
          datasets: [
            {
              label: "Overall Attendance",
              data: dataValues,
              backgroundColor: backgroundColors,
              borderRadius: 0,
              barThickness: 70
            }
          ]
        };

        setChartData(chart);
      } else {
        console.warn("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  };

  const onBarClick = (event) => {
    const elements = getElementAtEvent(chartRef.current, event);

    if (!elements || elements.length === 0) return;

    const clickedIndex = elements[0].index;
    const clickedLabel = chartData.labels[clickedIndex];

    console.log("Clicked on:", clickedLabel);
    setShowChart(false);
    fetchLeaveStatusData(clickedLabel);
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const handleToggle = () => {
    const newState = !showChart;
    setShowChart(newState);

    if (!newState) {
      fetchLeaveStatusData('');
    }
  };

  const columnLeave = [
    {
      headerName: 'S.No',
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      cellStyle: { textAlign: 'center' }
    },
    { headerName: 'Date', field: 'Date' },
    { headerName: 'Employee ID', field: 'EmployeeId' },
    { headerName: 'Employee Name', field: 'EmployeeName' },
    { headerName: 'Department', field: 'department_ID' },
    { headerName: 'Designation', field: 'designation_ID' },
    { headerName: 'Manager', field: 'Manager' },
    { headerName: 'Attendance Status', field: 'AttendanceStatus' }
  ];

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    setIntervalId(null);
  }

  localStorage.removeItem("loggedSeconds");
  localStorage.setItem("isCheckedIn", "false");
  setIsCheckedIn(false);
};
useEffect(() => {
  const storedCheckIn = localStorage.getItem("isCheckedIn");
  const checkInTime = localStorage.getItem("checkInTime");

  if (storedCheckIn === "true" && checkInTime) {
    const elapsedSeconds = Math.floor(
      (Date.now() - Number(checkInTime)) / 1000
    );

    setIsCheckedIn(true);
    setSecondsPassed(elapsedSeconds);
    setTimer(formatTime(elapsedSeconds));

    // 🔥 Restart timer after screen switch
    const id = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - Number(checkInTime)) / 1000
      );
      setSecondsPassed(seconds);
      setTimer(formatTime(seconds));
    }, 1000);

    setIntervalId(id);
  }
}, []);

  return (
    <div className="dashboard-container-fluid Topnav-screen pb-2">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="app-shadow-lg spacing-p-1 bg-light-color rounded-base main-header-box">
        <div className="header-flex">

          <div className="grid-col-12 grid-col-md-8">
            <div className="ticker-wrapper">
              <div className="ticker-text">{announcement}</div>
            </div>
          </div>

          <div className="dashboard-wrapper">
            <input
              id="timing"
              className="app-form-control"
              type="text"
              readOnly
              value={timer}
            />

            <button
              onClick={startTimer}
              className="check-btn"
              style={{
                backgroundColor: isCheckedIn ? "red" : "green",
                color: "white"
              }}
              title={isCheckedIn ? "Check Out" : "Check In"}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-layout spacing-mt-2">
        <div className="dashboard-row">

          <div className="grid-col-md-4">
            <div className="info-card-base card-gradient-blue">
              <img src={Circle} className='card-pulse-image' alt='' />
              <div className="text-color-white font-weight-bold">Total Active Employees</div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2"> {formattedTotalActiveEmployees}</div>
            </div>
          </div>

          <div className="grid-col-md-4">
            <div className="info-card-base card-gradient-pink" style={{ cursor: "pointer" }}>
              <img src={Circle} className='card-pulse-image' alt='' />
              <div className="text-color-white font-weight-bold">Total Salary Generated</div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                &#8377; {formatedTotalEarnings}
              </div>
              <div className="graph-line"></div>
            </div>
          </div>

          <div className="grid-col-md-4">
            <div className="info-card-base card-gradient-indigo" style={{ cursor: "pointer" }}>
              <img src={Circle} className='card-pulse-image' alt='' />
              <div className="text-color-white font-weight-bold">Number of Salary Generated</div>
              <div className="text-color-white font-size-4 display-flex spacing-mt-2">
                {FormatedTotalPayslip}
              </div>
              <div className="graph-line"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="grid-col-lg-6">
          <div className="app-card-base attendance-card-wrapper rounded-xl app-shadow-lg height-full">
            <div className="display-flex flex-between-center">
              <h6 className="card-title-heading spacing-mb-0">Today Attendance</h6>
              <button className="shadow-none-custom app-btn btn-outline-primary-custom" onClick={handleToggle}>
                {showChart ? "Leave Chart" : "Show Chart"}
              </button>
            </div>

            <div className="chart-area-container" style={{ width: "100%", height: "280px", padding: "20px" }}>
              {showChart ? (
                chartData ? (
                  <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={onBarClick} />
                ) : (
                  <p>Loading...</p>
                )
              ) : (
                <div className="app-grid-theme" style={{ height: 255, width: '100%' }}>
                  <AgGridReact
                    rowData={leaveRowData}
                    columnDefs={columnLeave}
                    rowHeight={30}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid-col-lg-6">
          <div className="app-card-base leave-list-wrapper rounded-xl app-shadow-lg height-full" style={{ maxHeight: "465px", paddingBottom: "80px" }}>
            <div className="display-flex flex-between-center">
              <h6 className="card-title-heading">Leave Approvals</h6>
            </div>
            <ul className="app-list-group spacing-mt-3" style={{ height: "250px" }}>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request, index) => (
                  request.status === "Pending" && (
                    <li
                      key={index}
                      className="leave-request-item display-flex flex-col flex-md-row-custom flex-between-center align-start"
                    >
                      <div className="display-flex align-start spacing-mb-2 spacing-mt-md-0 grid-col-12">
                        <input
                          type="checkbox"
                          className="app-checkbox-input spacing-me-3 spacing-mt-1"
                          id={`select-row-${index}`}
                          onChange={(e) =>
                            handleRowSelection(request.id, request.FromDate, e.target.checked)
                          }
                        />
                        <label htmlFor={`select-row-${index}`} className="grid-col-12">
                          <div className="font-weight-bold text-color-dark">{request.EmployeeId}</div>
                          <small className="text-muted-color display-block-custom spacing-mb-1">{request.EmployeeName}</small>
                          <div className="display-flex flex-wrap flex-gap-2 text-muted-color font-size-small request-detail-badge-group">
                            <span><strong>Leave Type:</strong> {request.LeaveType}</span>
                            <span><strong>From:</strong> {request.FromDate}</span>
                            <span><strong>To:</strong> {request.ToDate}</span>
                            <span><strong>Days:</strong> {request.LeaveDays}</span>
                          </div>
                        </label>
                      </div>

                      <div className="display-flex flex-end request-action-icons spacing-mt-2 spacing-mt-md-0">
                        <span
                          className="action-icon-base icon-approve spacing-me-2"
                          onClick={() => handleApproval(request.id, request.FromDate, true)}
                          title="Approve"
                          role="button"
                          tabIndex="0"
                        >
                          <i className="fa-solid fa-circle-check"></i>
                        </span>

                        <span
                          className="action-icon-base icon-reject"
                          onClick={() => handleApproval(request.id, request.FromDate, false)}
                          title="Reject"
                          role="button"
                          tabIndex="0"
                        >
                          <i className="fa-solid fa-circle-xmark"></i>
                        </span>
                      </div>
                    </li>
                  )
                ))
              ) : (
                <li className="leave-request-item text-align-center text-muted-color">No data available</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-row spacing-mt-3">
        <div className="grid-col-lg-3">
          <div className="app-card-base joinees-card rounded-xl app-shadow-lg height-full">
            <div className="display-flex flex-between-center flex-wrap">
              <h6 className="card-title-heading">New Joinees</h6>
            </div>
            <div id="newJoineesCarousel" style={{ height: "250px" }} className="app-carousel carousel-slide" data-bs-ride="carousel">
              <div className="carousel-inner-custom" >
                {NewJoinees.length > 0 ? (
                  NewJoinees.map((joinee, index) => (
                    <div
                      key={joinee.id}
                      className={`carousel-item-custom ${index === 0 ? "active-state" : ""}`}
                    >
                      <div className="joinee-profile-card text-align-center">
                        <img
                          src={joinee.Photos}
                          width={110}
                          height={110}
                          alt={`${joinee.EmployeeId}`}
                          className="display-block-custom margin-x-auto rounded-custom"
                        />
                        <p className="app-badge rounded-pill-custom badge-info-color font-size-6 spacing-mt-2">
                          {joinee.department_ID} - {joinee.EmployeeId}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-align-center text-muted-color spacing-mt-3">No new joinees</p>
                )}
              </div>
              {NewJoinees.length > 1 && (
                <div className="carousel-nav-container">
                  <button
                    className="carousel-control-prev-custom"
                    type="button"
                    data-bs-target="#newJoineesCarousel"
                    data-bs-slide="prev"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill text-color-dark" viewBox="0 0 16 16">
                      <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                    </svg>
                  </button>
                  <button
                    className="carousel-control-next-custom"
                    type="button"
                    data-bs-target="#newJoineesCarousel"
                    data-bs-slide="next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill text-color-dark" viewBox="0 0 16 16">
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid-col-lg-3">
          <div className="app-card-base birthday-card-wrapper rounded-xl app-shadow-lg height-full" >
            <div className="display-flex flex-between-center">
              <h6 className="card-title-heading">Upcoming Birthdays</h6>
            </div>
            <div className="birthday-list-container" style={{ height: "250px" }}>
              {upcomingBirthdays.length > 0 ? (
                upcomingBirthdays.map((person) => (
                  <div key={person.id} className="birthday-profile-item">
                    <div className="display-flex justify-center spacing-mt-2">
                      <div className="">
                        <img
                          src={person.Photos}
                          width={110}
                          height={110}
                          className="image-rounded-20"
                          alt={person.Plainimg}
                        />
                      </div>
                    </div>
                    <div className="grid-col-12 spacing-mt-2">
                      <h3 className="text-color-dark">{person.EmployeeName}</h3>
                      <p className="app-badge spacing-p-1 text-bg-warning font-size-6">🎉🎂🎉🎂</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-align-center text-muted-color spacing-mt-3">No Upcoming Birthdays</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid-col-lg-6">
          <div className="app-card-base rounded-xl birthday-card-wrapper app-shadow-lg height-full">
            <div className="display-flex flex-between-center">
              <h6 className="card-title-heading spacing-mb-2">My Team</h6>
              <div className="display-flex flex-end">
                <Select
                  id="status"
                  value={SelectedManager}
                  onChange={handleChangeManager}
                  options={filteredOptionManager}
                  className="team-select-wrapper"
                />
                <button
                  className="shadow-none-custom team-toggle-button"
                  onClick={() => {
                    setViewChart(!viewChart);
                    if (viewChart) {
                      fetchGridData();
                    }
                  }}
                >
                  {viewChart ? "Team List" : "Chart"}
                </button>
              </div>
            </div>
            {viewChart ? (
              <div className="display-flex flex-between-center dashboard-row spacing-pb-2">
                {/* <div className="grid-col-sm-1">
                  <img src={Vector} width={230} height={230} />
                </div> */}
                <div className="grid-col-md-8 grid-col-12">
                  <div className="chart-container spacing-mt-2" style={{ height: 250, width: "100%" }}>
                    {teamData?.labels?.length > 0 ? (
                      <Doughnut data={teamData} options={teamOptions} />
                    ) : (
                      <div>No data </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="app-grid-theme spacing-mt-4 rounded-xl" style={{ height: 255, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefsList}
                  rowData={rowDataTeamList}
                  rowHeight={30}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-row spacing-mt-3">
        <div className="grid-col-12">
          <div className="birthday-card-wrapper rounded-xl app-shadow-lg height-full">
            <h6 className="display-flex justify-content-start card-title-heading spacing-mb-2">Employee Details</h6>
            
            <div className="dashboard-row mb-2-me-1">
              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={employeeId}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                  <label className="exp-form-labels">Employee ID</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={employeeName}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                  <label className="exp-form-labels">Employee Name</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    autoComplete="off"
                    placeholder=" "
                    type="text"
                    value={department}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <label className="exp-form-labels">Department</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={designation}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                  <label className="exp-form-labels">Designation</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={Manager}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setmanager(e.target.value)}
                  />
                  <label className="exp-form-labels">Manager</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={aadharNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setAadharNo(e.target.value)}
                  />
                  <label className="exp-form-labels">Aadhaar No</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={pfNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setPfNo(e.target.value)}
                  />
                  <label className="exp-form-labels">PF No</label>
                </div>
              </div>

              <div className="grid-col-md-3">
                <div className="inputGroup">
                  <input
                    id="status"
                    className="exp-input-field app-form-control"
                    type="text"
                    autoComplete="off"
                    placeholder=" "
                    value={accountNo}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setAccountNo(e.target.value)}
                  />
                  <label className="exp-form-labels">Account No</label>
                </div>
              </div>

              <div className="grid-col-md-5">
                <div
                  className={`inputGroup selectGroup 
                ${selectedMaritalStatus ? "has-value" : ""} 
                ${isSelectMarital ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectMarital(true)}
                    onBlur={() => setIsSelectMarital(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionMartial}
                    onChange={handleChangeMartial}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    value={selectedMaritalStatus}
                  />
                  <label className="floating-label">Marital Status</label>
                </div>
              </div>

              <div className="grid-col-md-5">
                <div
                  className={`inputGroup selectGroup 
                ${selectedShift ? "has-value" : ""} 
                ${isSelectShift ? "is-focused" : ""}`}
                >
                  <Select
                    id="status"
                    placeholder=" "
                    onFocus={() => setIsSelectShift(true)}
                    onBlur={() => setIsSelectShift(false)}
                    classNamePrefix="react-select"
                    isClearable
                    type="text"
                    options={filteredOptionShift}
                    onChange={handleChangeShift}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    value={selectedShift}
                  />
                  <label className="floating-label">Shift</label>
                </div>
              </div>

              <div className="ms-2">
                <div className="search-btn-wrapper">
                  <div className="icon-btn search" onClick={handleSearch}>
                    <span className="tooltip">Search</span>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div className="icon-btn reload" onClick={reloadGridData}>
                    <span className="tooltip">Reload</span>
                    <i className="fa-solid fa-rotate-right"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="app-grid-theme spacing-mt-2 rounded-xl" style={{ height: 440, width: '100%' }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  suppressRowClickSelection={true}
                  onGridReady={(params) => {
                    gridApiRef.current = params.api;
                    gridColumnApiRef.current = params.columnApi;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;