import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home'
import Report from './pages/Report'
import Tool from './pages/Tool'


function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Switch >
          <Route path='/' exact component={Home} />
          <Route path='/report' component={Report} />
          <Route path='/tool' component={Tool} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
