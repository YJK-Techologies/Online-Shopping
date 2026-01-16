import { useTheme } from './ThemeContext';

const ThemeSwitcher = () => {
  const { setAppTheme } = useTheme();

  return (
    <div className='row '>

      <div className='col-10 col-md-3 mb-3 form-control'>
        <i className="EmeraldIcon" onClick={() => setAppTheme('Emerald')}>
          <span className='ms-2'>Emerald</span></i>
      </div>

      <div className='col-10 col-md-3 mb-3 form-control'>
        <i className="VioletIcon" onClick={() => setAppTheme('Violet')}>
          <span className='ms-2'>Violet</span>
        </i>
      </div>

      <div className='col-10 col-md-3 mb-3 form-control'>
        <i className="TangerineIcon" onClick={() => setAppTheme('Tangerine')}>
          <span className='ms-2'>Tangerine</span>
          </i>
      </div>

      <div className='col-10 col-md-3 mb-3 form-control'>
        <i className="CharcoalIcon" onClick={() => setAppTheme('Charcoal')}>
          <span className='ms-2'>Charcoal</span>
        </i>
      </div>

      <div className='col-10 col-md-3 mb-3 form-control'>
        <i className="TealIcon" onClick={() => setAppTheme('Teal')}>
          <span className='ms-2'>Teal</span>
        </i>
      </div>

    </div>
  );
};

export default ThemeSwitcher;