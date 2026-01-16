import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const themes = {
  Emerald: {
    '--bg-color': '#E8F8F5',          
    '--font-color': '#004D40',        
    '--font-hover': '#FFFFFF',
    '--border-color': '#80CBC4',      
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#004D40',      
    '--sidenav-hover': '#4DB6AC',     
    '--but': '#4DB6AC',
    '--but-border': '#003630',
    '--but-hover': '#003630',
    '--ag-header': '#004D40',
    '--ag-h1': '#004D40',
    '--ag-row': '#F1FFF9',            
    '--ag-col': '#B2DFDB',            
    '--ag-row-even-hover': '#80CBC4',
    '--ag-row-odd-hover': '#80CBC4',
    '--exp-input-field': '#E8F8F5',
  },

  Violet: {
    '--bg-color': '#F8F4FF',         
    '--font-color': '#4A148C',       
    '--font-hover': '#FFFFFF',
    '--border-color': '#E1BEE7',     
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#6A1B9A',     
    '--sidenav-hover': '#9C27B0',    
    '--but': '#9C27B0',
    '--but-border': '#7B1FA2',
    '--but-hover': '#7B1FA2',
    '--ag-header': '#6A1B9A',
    '--ag-h1': '#6A1B9A',
    '--ag-row': '#F3E5F5',           
    '--ag-col': '#E1BEE7',           
    '--ag-row-even-hover': '#CE93D8',
    '--ag-row-odd-hover': '#CE93D8',
    '--exp-input-field': '#F8F4FF',
  },

  Tangerine: {
    '--bg-color': '#FEF5E7',         
    '--font-color': '#333333',       
    '--font-hover': '#FFFFFF',
    '--border-color': '#F5CBA7',     
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#E67E22',     
    '--sidenav-hover': '#F39C12',    
    '--but': '#F39C12',
    '--but-border': '#D68910',
    '--but-hover': '#D68910',
    '--ag-header': '#E67E22',
    '--ag-h1': '#E67E22',
    '--ag-row': '#FCF3CF',          
    '--ag-col': '#FAD7A0',            
    '--ag-row-even-hover': '#F7DC6F',
    '--ag-row-odd-hover': '#F7DC6F',
    '--exp-input-field': '#FEF5E7',
  },

  Charcoal: {
    '--bg-color': '#F9F9F9',
    '--font-color': '#212121',
    '--font-hover': '#FFFFFF',
    '--border-color': '#E0E0E0',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#303030',
    '--sidenav-hover': '#616161',
    '--but': '#616161',
    '--but-border': '#424242',
    '--but-hover': '#424242',
    '--ag-header': '#303030',
    '--ag-h1': '#303030',
    '--ag-row': '#F0F0F0',
    '--ag-col': '#E0E0E0',
    '--ag-row-even-hover': '#BDBDBD',
    '--ag-row-odd-hover': '#BDBDBD',
    '--exp-input-field': '#F9F9F9',
  },

  Teal: {
    '--bg-color': '#F0FFFF',
    '--font-color': '#3C5B5B',
    '--font-hover': '#FFFFFF',
    '--border-color': '#B2DFDB',
    '--chart-bg': '#FFFFFF',
    '--sidenav-menu': '#00695C',
    '--sidenav-hover': '#00897B',
    '--but': '#00897B',
    '--but-border': '#00796B',
    '--but-hover': '#00796B',
    '--ag-header': '#00695C',
    '--ag-h1': '#00695C',
    '--ag-row': '#E0F2F1',
    '--ag-col': '#B2DFDB',
    '--ag-row-even-hover': '#80CBC4',
    '--ag-row-odd-hover': '#80CBC4',
    '--exp-input-field': '#F0FFFF',
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('Emerald');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('Emerald');
    }
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    if (themes[themeName]) {
      Object.keys(themes[themeName]).forEach((key) => {
        root.style.setProperty(key, themes[themeName][key]);
      });
    } else {
      console.error(`Theme "${themeName}" not found.`);
      applyTheme('Emerald');
    }
  };

  const setAppTheme = (themeName) => {
    setTheme(themeName);
    applyTheme(themeName);
    localStorage.setItem('theme', themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};