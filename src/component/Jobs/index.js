import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch, BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const appConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const API_BASE = 'https://apis.ccbp.in'
const PROFILE_URL = `${API_BASE}/profile`
const JOBS_URL = `${API_BASE}/jobs`

class Jobs extends Component {
  state = {
    searchInput: '',
    profileData: null,
    checkboxArray: [],
    radioValue: '',
    appStatus: appConstants.initial,
    jobs: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(PROFILE_URL, options)
    if (response.ok) {
      const data = await response.json()
      if (response.ok) {
        const newData = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        }
        this.setState({profileData: newData})
      }
    }
  }

  getJobDetails = async () => {
    const {checkboxArray, radioValue, searchInput} = this.state
    const checkboxString = checkboxArray.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `${JOBS_URL}?employment_type=${checkboxString}&minimum_package=${radioValue}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const jobs = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({appStatus: appConstants.success, jobs})
    } else {
      this.setState({appStatus: appConstants.failure, jobs: ''})
    }
  }

  displaySearchBar = isSmall => {
    const {searchInput} = this.state
    return (
      <div className={isSmall ? 'sm-searchbar-holder' : 'lg-searchbar-holder'}>
        <input
          type="search"
          className="search-bar"
          value={searchInput}
          placeholder="Search"
          onChange={event => this.setState({searchInput: event.target.value})}
          onKeyDown={event => event.key === 'Enter' && this.getJobDetails()}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.getJobDetails}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  showProfileSection = () => {
    const {profileData} = this.state
    if (profileData === null) {
      return (
        <div className="failure-profile-container">
          <button
            type="button"
            className="failure-retry-button"
            onClick={this.getProfileDetails}
          >
            Retry
          </button>
        </div>
      )
    }
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <>
        {this.displaySearchBar(true)}
        <div className="success-profile-container">
          <img src={profileImageUrl} className="profile-img" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      </>
    )
  }

  onChangeCheckbox = event => {
    const isChecked = event.target.checked
    this.setState(
      prevState => ({
        checkboxArray: isChecked
          ? [...prevState.checkboxArray, event.target.value]
          : prevState.checkboxArray.filter(id => id !== event.target.value),
      }),
      this.getJobDetails,
    )
  }

  showEmploymentFilters = () => (
    <ul className="filters-section">
      {employmentTypesList.map(({employmentTypeId, label}) => (
        <li className="check-box-holder" key={employmentTypeId}>
          <input
            type="checkbox"
            className="check-box"
            id={employmentTypeId}
            value={employmentTypeId}
            onChange={this.onChangeCheckbox}
          />
          <label htmlFor={employmentTypeId} className="label">
            {label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeRadio = event => {
    if (event.target.checked) {
      this.setState({radioValue: event.target.value}, this.getJobDetails)
    }
  }

  showSalaryFilters = () => (
    <ul className="filters-section">
      {salaryRangesList.map(({salaryRangeId, label}) => (
        <li className="radio-holder" key={salaryRangeId}>
          <input
            type="radio"
            className="radio"
            id={salaryRangeId}
            value={salaryRangeId}
            name="salary-radio"
            onChange={this.onChangeRadio}
          />
          <label htmlFor={salaryRangeId} className="label">
            {label}
          </label>
        </li>
      ))}
    </ul>
  )

  showJobsList = () => {
    const {jobs} = this.state
    return (
      <ul className="job-success-list">
        {jobs.map(job => (
          <li className="job-item" key={job.id}>
            <Link to={`/jobs/${job.id}`} className="job-link">
              <div className="job-header">
                <img
                  src={job.companyLogoUrl}
                  className="company-logo"
                  alt="company logo"
                />
                <div className="role-holder">
                  <h1 className="job-role">{job.title}</h1>
                  <div className="rating-holder">
                    <BsStarFill className="rating-image" />
                    <p className="rating-text">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="other-details-container">
                <div className="location-holder">
                  <div className="icon-holder">
                    <MdLocationOn />
                    <p className="icon-label">{job.location}</p>
                  </div>
                  <div className="icon-holder">
                    <MdWork />
                    <p className="icon-label">{job.employmentType}</p>
                  </div>
                </div>
                <p className="salary">{job.packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="description-heading">Description</h1>
              <p className="description-para">{job.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  tryAgain = () => {
    this.setState({appStatus: appConstants.initial}, this.getJobDetails)
  }

  showJobsView = () => {
    const {appStatus, jobs} = this.state
    switch (appStatus) {
      case appConstants.success:
        return jobs.length ? (
          this.showJobsList()
        ) : (
          <div className="no-job-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              className="no-job-image"
              alt="no jobs"
            />
            <h1 className="no-job-heading">No Jobs Found</h1>
            <p className="no-job-description">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )
      case appConstants.failure:
        return (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              className="failure-image"
              alt="failure view"
            />
            <h1 className="failure-heading">Oops! Something Went Wrong</h1>
            <p className="failure-description">
              We cannot seem to find the page you are looking for
            </p>
            <button
              type="button"
              className="failure-retry-button"
              onClick={this.tryAgain()}
            >
              Retry
            </button>
          </div>
        )
      default:
        return (
          <div className="main-loader-container">
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          </div>
        )
    }
  }

  render() {
    return (
      <div className="jobs-page">
        <Header />
        <div className="jobs-container">
          <div className="job-filters-container">
            {this.showProfileSection()}
            <hr />
            <h1 className="filter-name">Type of Employment</h1>
            {this.showEmploymentFilters()}
            <hr />
            <h1 className="filter-name">Salary Range</h1>
            {this.showSalaryFilters()}
          </div>
          <div className="show-jobs-container">
            {this.displaySearchBar(false)}
            {this.showJobsView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
