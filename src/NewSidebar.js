import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NewSideBar.css";
import logo from './main.png'

import {
  BsPeopleFill,
  BsWrenchAdjustable,
  BsPersonVcard,
  BsCalendarEvent,
  BsChevronDown,
} from "react-icons/bs";

// Helper function to normalize paths (ensure leading slash is present and no trailing slash)
const cleanPath = (path) => {
    if (!path) return '';
    // Ensure path starts with /
    let cleaned = path.startsWith('/') ? path : '/' + path;
    // Remove trailing slash if present
    return cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
};

// Recursive function to filter the menu structure based on permissions
const filterMenuByPermission = (menuItems, allowedPaths) => {
  return menuItems.reduce((acc, item) => {
    let newItem = { ...item };

    if (item.subMenus) {
      // 1. If it's a dropdown, recursively filter its submenus
      const filteredSubMenus = filterMenuByPermission(item.subMenus, allowedPaths);

      if (filteredSubMenus.length > 0) {
        // Only keep the parent dropdown if it still has active children
        newItem.subMenus = filteredSubMenus;
        acc.push(newItem);
      }
    } else if (item.path) {
      // 2. If it's a link (leaf node), check permission based on its path
      const itemPath = cleanPath(item.path);
      
      // Check if the normalized path is in the list of allowed paths
      if (allowedPaths.includes(itemPath)) {
        acc.push(newItem);
      }
    } 
    // Ignore items that are just structural labels without a path/submenus (if not filtered by the recursive call).

    return acc;
  }, []);
};


const menuData = [
  {
    label: "Admin",
    icon: BsPeopleFill,
    isDropdown: true,
    subMenus: [
      { label: "Company", path: "/Company" },
      { label: "Company Mapping", path: "/CompanyMapping" },
      { label: "Location", path: "/Location" },
      { label: "Role", path: "/Role" },
      { label: "Role Mapping", path: "/UserRoleMapping" },
      { label: "Role Rights", path: "/UserRights" },
      { label: "User", path: "/User" },
    ],
  },
  {
    label: "Masters",
    icon: BsWrenchAdjustable,
    isDropdown: true,
    subMenus: [
      { label: "Attribute", path: "/Attribute" },
      { label: "Print Templates", path: "/TemplateDesign" },
      { label: "Bank Account", path: "/BankAccount" },
      { label: "Barcode Generator", path: "/BarcodeGenerator" },
      { label: "Barcode Scanner", path: "/BarcodeScanner" },
      { label: "Department", path: "/Department" },
      { label: "Designation Info", path: "/DesgiantionInfo" },
      { label: "Intermediary", path: "/Intermediary" },
      { label: "Number Series", path: "/NumberSeries" },
      { label: "Warehouse", path: "/Warehouse" },
      { label: "Financial Year Access", path: "/FinancialYearAccess" },
    ],
  },
  {
    label: "HCM",
    icon: BsPersonVcard,
    isDropdown: true,
    subMenus: [
      { label: "Admin Dashboard", path: "/ESSDashboard" },
      { label: "Employee Dashboard", path: "/EmployeeDashboard" },
      { label: "Employee Info", path: "/AddEmployeeInfo" },
      { label: "Salary Process", path: "/salarypath" },
      { label: "Payslip Master", path: "/PayslipSalaryDays" },
     
      {
        label: "Masters",
        isDropdown: true,
        subMenus: [
          { label: "Grade", path: "/EmployeeGrade" },
          { label: "Leave", path: "/EmpLeave" },
          { label: "Loan", path: "/EmployeeLoan" },
          { label: "Announcement", path: "/Announce" },
          { label: "Employee Holiday", path: "/HoliDays" },
          { label: "Setting Screen", path: "/WeekOff" },
          { label: "Interview Master", path: "/CandidateMaster" }
        ],
      },
    ],
  },
  {
    label: "PMS",
    icon: BsCalendarEvent,
    isDropdown: true,
    subMenus: [
      {
        label: "Masters",
        isDropdown: true,
        subMenus: [
          { label: "Project", path: "/Project" },
          { label: "Project Mapping", path: "/ProjectMapping" },
          { label: "Task", path: "/Task" },
          { label: "Setting Screen", path: "/PMSsettings" },
        ],
      },
      {
        label: "Transactions",
        isDropdown: true,
        subMenus: [
          { label: "Open Tickets", path: "/OpenTickets" },
          { label: "Task Update", path: "/ProjectDetails" },
        ],
      },
      {
        label: "Reports",
        isDropdown: true,
        subMenus: [
          { label: "Task Hours & Time Tracking", path: "/TaskHours" },
          { label: "Project Progress", path: "/ProjectProgress" },
          { label: "Project Chart Report", path: "/ProjectChartReport" },
        ],
      },
    ],
  }
];

const secondaryMenuData = [
  { label: "YJK TECHNOLOGIES" },
  { label: "Version 1.0.0" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const allowedPaths = useMemo(() => {
    try {
      const permissionsJSON = sessionStorage.getItem("permissions");
      const permissions = permissionsJSON ? JSON.parse(permissionsJSON) : [];
      
      return Array.isArray(permissions)
        ? permissions.map((permission) =>
            permission.screen_type ? cleanPath(permission.screen_type) : ''
          ).filter(path => path.length > 0) 
        : [];
    } catch (e) {
      console.error("Failed to parse permissions from sessionStorage:", e);
      return [];
    }
  }, []);

  const filteredMenuData = useMemo(() => {
    if (allowedPaths.length === 0) return []; 
    
    return filterMenuByPermission(menuData, allowedPaths);
  }, [allowedPaths]);


  const toggleDropdown = (key) => {
    setOpenMenus((prev) => {
      const newState = {};

      if (prev[key]) {
        return { ...prev, [key]: false };
      }

      Object.keys(prev).forEach((k) => {
        if (k.startsWith(key) || key.startsWith(k)) {
          newState[k] = prev[k];
        }
      });

      newState[key] = true;

      return newState;
    });
  };

  const renderMenuItem = (item, keyPrefix) => {
    const Icon = item.icon;
    const isOpen = openMenus[keyPrefix];
    const isActive = location.pathname === item.path;
    const isSubActive = item.subMenus?.some(s => s.path === location.pathname);

    return (
      <li
        key={keyPrefix}
        className={`nav-item ${isOpen ? "open" : ""} ${isActive || isSubActive ? "active" : ""}`}
      >
        {item.isDropdown ? (
          <div className="nav-link" onClick={() => toggleDropdown(keyPrefix)}>
            {Icon && <Icon className="menu-icon" size={18} />}
            <span className="nav-label">{item.label}</span>
            <BsChevronDown className={`dropdown-arrow ${isOpen ? "rotated" : ""}`} />
          </div>
        ) : (
          <Link to={item.path} className="nav-link">
            {Icon && <Icon className="menu-icon" size={18} />}
            <span className="nav-label">{item.label}</span>
          </Link>
        )}

        {item.subMenus && (
          <ul className={`dropdown-list ${isOpen ? "show" : ""}`}>
            {/* Render filtered submenus */}
            {item.subMenus.map((sub, i) => {
              const subKey = `${keyPrefix}-${i}`;
              return sub.isDropdown
                ? renderMenuItem(sub, subKey)
                : (
                  <li key={subKey}>
                    <Link
                      to={sub.path}
                      className={`dropdown-item text-wrap ${cleanPath(location.pathname) === cleanPath(sub.path) ? "active" : ""}`}
                    >
                      {sub.label}
                    </Link>
                  </li>
                );
            })}
          </ul>
        )}
      </li>
    );
  };


  return (
    <>
      <button className={`mobile-menu-btn ${collapsed ? "show" : "hide"}`} onClick={() => setCollapsed(false)}>
        <i className="bi bi-list classic-icon" ></i>
      </button>

      <aside className={`sidebar ${collapsed ? "collapsed" : "open"} ${collapsed ? "" : "mobile-open"}`}>
        <header className="sidebar-header">
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "100%", 
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <button className="sidebar-toggler" onClick={() => setCollapsed(!collapsed)}>
            <i className={`bi bi-chevron-left classic-chevron ${collapsed ? "rotated" : ""}`}></i>
          </button>
        </header>

        <nav className="sidebar-nav">
          {/* 3. Use filteredMenuData */}
          <ul className="nav-list primary-nav">{filteredMenuData.map((item, i) => renderMenuItem(item, String(i)))}</ul>
          <ul className="sidebar-footer">
            {secondaryMenuData.map((item, i) => (
              <li key={i} className="footer-item">
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;