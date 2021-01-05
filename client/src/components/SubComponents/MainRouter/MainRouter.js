import React, { Component , Fragment } from 'react';
import { Redirect, Route , Switch , withRouter } from "react-router-dom";
import { connect } from "react-redux"
import { setSelectedPage , logoutHandler , setLoginStatus } from "../../../actions/index"
import Home from "../../Pages/Home/Home";
import LoginRegister from "../../Pages/LoginRegister/LoginRegister"
import About from "../../Pages/About/About"
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Profile from '../../Pages/Profile/Profile';


class MainRouter extends Component {

  componentDidMount(){
    
    const { setSelectedPage , history , logoutHandler , setLoginStatus } = this.props;

    //For Navbar Links
    const selectedPage = history.location.pathname.split("/")[1];
    setSelectedPage(selectedPage)

    this.pageSelector = history.listen((location) => {
      const selectedPage = location.pathname.split("/")[1];
      setSelectedPage(selectedPage)
    });

    // Login / Logout
    
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    setLoginStatus(true);

    setTimeout(() => {
      logoutHandler();
    }, remainingMilliseconds);

  }
  
  componentWillUnmount(){
    this.pageSelector();
  }

  render(){
    const { isLoggedIn } = this.props;

      return (
        <Fragment>
          <Navbar/>
          <Switch>
            <Route exact path="/" component={ Home }/>
            <Route  path="/about" component={ About }/>
            {!isLoggedIn ? 
            <Route  path="/user" component={ LoginRegister }/> 
              :
            <Route  path="/profile" component={ Profile }/>}
            <Redirect to="/" />
          </Switch>
          <Footer/>
        </Fragment>
      );
  }
}

const mapStatesToProps = (state) => { 
  return {
    isLoggedIn : state.auth.isLoggedIn
  }
} 

const mapDispatchToProps = (dispatch) => { 
  return {
    setSelectedPage : (page) => dispatch(setSelectedPage(page)),
    setLoginStatus : (status) => dispatch(setLoginStatus(status)),
    logoutHandler : () => dispatch(logoutHandler())
  }
}

export default connect( mapStatesToProps , mapDispatchToProps )(withRouter(MainRouter));