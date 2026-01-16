import './Ess.css'

const TabButtons = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="shadow-lg bg-white rounded mt-2 pt-2">
    <div className="row g-3 inputGoup">
      <div className="tabs-container">
        {tabs.map((tab, index) => (
          <span
            key={index}
            className={`custom-tab-btn ${activeTab === tab.label ? "active-tab" : ""}`}
            onClick={() => onTabClick(tab.label)}
          >
            {tab.label}
          </span>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TabButtons;
