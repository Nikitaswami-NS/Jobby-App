import './App.css'

import {Switch, Route} from 'react-router-dom'
import Home from './component/Home'
import Login from './component/Login'
import Jobs from './component/Jobs'
import JobItemDetails from './component/JobItemDetails'
import ProtectedRoute from './component/ProtectedRoute'
import NotFound from './component/NotFound'

const App = () => (
  <>
    <Switch>
      <Route exact path="/Login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/Jobs" component={Jobs} />
      <ProtectedRoute exact path="/Jobs/:id" component={JobItemDetails} />
      <ProtectedRoute component={NotFound} />
    </Switch>
  </>
)

export default App
