import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home'
import Report from './pages/Report'
import Tool from './pages/Tool'
import RatingLite from './pages/RatingLite'
import TogglTool from './pages/TogglTool';
import React from 'react';
import AuthProvider from './contexts/AuthContext';



function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Sidebar />
          <Switch >
            <Route path='/' exact component={Home} />
            <Route path='/report' component={Report} />
            <Route path='/tool' component={Tool} />
            <Route path='/ratingLite' component={RatingLite} />
            <Route path='/togglTool' component={TogglTool} />
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
