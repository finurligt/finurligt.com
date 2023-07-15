import React, { Component, createContext, useContext } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      loading: true
    };

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return auth.signOut();
  }

  resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  updateEmail(email) {
    return this.state.currentUser.updateEmail(email);
  }

  updatePassword(password) {
    return this.state.currentUser.updatePassword(password);
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      this.setState({
        currentUser: user,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { currentUser, loading } = this.state;
    const value = {
      currentUser,
      login: this.login,
      signup: this.signup,
      logout: this.logout,
      resetPassword: this.resetPassword,
      updateEmail: this.updateEmail,
      updatePassword: this.updatePassword
    };

    return (
      <AuthContext.Provider value={value}>
        {!loading && this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;