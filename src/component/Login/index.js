import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    userName: '',
    passWord: '',
    errorMsg: '',
    showError: false,
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userName, passWord} = this.state
    const userDetails = {
      username: userName,
      password: passWord,
    }

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const jwtToken = data.jwt_token
      const {history} = this.props
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    } else {
      this.setState({showError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {errorMsg, userName, passWord, showError} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="website-logo"
            alt="website logo"
          />
          <form className="login-form" onSubmit={this.submitForm}>
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              name="userName"
              id="username"
              className="input-element"
              placeholder="Username"
              value={userName}
              onChange={this.handleChange}
            />
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              name="passWord"
              id="password"
              className="input-element"
              placeholder="Password"
              value={passWord}
              onChange={this.handleChange}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {showError && <p className="error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
