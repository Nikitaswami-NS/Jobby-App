import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const appConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: null,
    similarJobs: [],
    appStatus: appConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const {job_details: job, similar_jobs: similarJobss} = data
      const jobDetails = {
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        skills: job.skills.map(skill => ({
          imageUrl: skill.image_url,
          name: skill.name,
        })),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
      }

      const similarJobs = similarJobss.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobDetails,
        similarJobs,
        appStatus: appConstants.success,
      })
    } else {
      this.setState({similarJobs: '', appStatus: appConstants.failure})
    }
  }

  renderSkills = skills => (
    <ul className="skills-list">
      {skills.map(({name, imageUrl}) => (
        <li className="skill-item" key={name}>
          <img src={imageUrl} alt={name} className="skill-image" />
          <p className="skill-name">{name}</p>
        </li>
      ))}
    </ul>
  )

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <ul className="similar-list">
        {similarJobs.map(job => (
          <li className="similar-item" key={job.id}>
            <div className="icon-container">
              <img
                src={job.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo"
              />
              <div className="role-holder">
                <h1 className="role-names">{job.title}</h1>
                <div className="rating-holder">
                  <BsStarFill className="star-image" />
                  <p className="rating">{job.rating}</p>
                </div>
              </div>
            </div>
            <h1 className="description">Description</h1>
            <p className="description-para">{job.jobDescription}</p>
            <div className="job-middle-container">
              <div className="location-holder">
                <div className="icon-holder">
                  <MdLocationOn className="md-icons" />
                  <p className="icon-names">{job.location}</p>
                </div>
                <div className="icon-holder">
                  <MdWork className="md-icons" />
                  <p className="icon-names">{job.employmentType}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccessView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      companyWebsiteUrl,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <div className="job-item-success-view">
        <div className="job-description-container">
          <div className="icon-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="role-holder">
              <h1 className="role-names">{title}</h1>
              <div className="rating-holder">
                <BsStarFill className="star-image" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-middle-container">
            <div className="location-holder">
              <div className="icon-holder">
                <MdLocationOn className="md-icon" />
                <p className="icon-name">{location}</p>
              </div>
              <div className="icon-holder">
                <MdWork className="md-icon" />
                <p className="icon-name">{employmentType}</p>
              </div>
            </div>
            <p className="salary">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="desc-holder">
            <h1 className="description-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              rel="noreferrer"
              target="_blank"
              className="h-ref"
            >
              <p className="visit-text">
                Visit <BiLinkExternal className="visit" />
              </p>
            </a>
          </div>
          <p className="description-para">{jobDescription}</p>

          <h1 className="skills-heading">Skills</h1>
          {this.renderSkills(skills)}

          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-holder">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>

        <div className="similar-jobs-container">
          <h1 className="similar-heading">Similar Jobs</h1>
          {this.renderSimilarJobs()}
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="main-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="main-loader-container">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  render() {
    const {appStatus} = this.state

    let view
    switch (appStatus) {
      case appConstants.success:
        view = this.renderSuccessView()
        break
      case appConstants.failure:
        view = this.renderFailureView()
        break
      default:
        view = this.renderLoaderView()
    }

    return (
      <div className="job-items-page">
        <Header />
        {view}
      </div>
    )
  }
}

export default JobItemDetails
