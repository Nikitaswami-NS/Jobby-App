import {Link, withRouter} from 'react-router-dom'
import {MdHome, MdWork} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = ({history}) => {
  const logout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const navLinks = [
    {path: '/', label: 'Home', icon: <MdHome className="icons" />},
    {path: '/jobs', label: 'Jobs', icon: <MdWork className="icons" />},
  ]

  return (
    <nav className="navbar-header">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </Link>
      {/* Large Container */}
      <div className="lg-container">
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.label} className="header-item">
              <Link to={link.path} className="link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button type="button" className="header-logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
      {/* Small Container */}
      <ul className="sm-container">
        {navLinks.map(link => (
          <li key={link.label} className="sm-list-item">
            <Link to={link.path} className="link">
              {link.icon}
            </Link>
          </li>
        ))}

        <li className="sm-list-item">
          <button type="button" className="logout-icon" onClick={logout}>
            <FiLogOut className="icons" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
