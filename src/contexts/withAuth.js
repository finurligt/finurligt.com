import React from 'react';
import { useAuth } from './AuthContext';

function withAuth(Component) {
  return function AuthWrapper(props) {
    const auth = useAuth();

    return <Component {...props} auth={auth} />;
  };
}

export default withAuth;