import React, { Component } from 'react'
import { useAuth } from '../contexts/AuthContext';

export class Login extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        
        return (
            <>
                <div className="modal fade" id="modalLoginForm" tabIndex="-1" role="dialog"
                    aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold">Sign in</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body mx-3">
                                <div className="md-form mb-5">
                                    <i className="fas fa-envelope prefix grey-text"></i>
                                    <input type="email" id="defaultForm-email" className="form-control validate" />
                                    <label data-error="wrong" data-success="right" htmlFor="defaultForm-email">Your email</label>
                                </div>

                                <div className="md-form mb-4">
                                    <i className="fas fa-lock prefix grey-text"></i>
                                    <input type="password" id="defaultForm-pass" className="form-control validate" />
                                    <label data-error="wrong" data-success="right" htmlFor="defaultForm-pass">Your password</label>
                                </div>

                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button onClick={() => console.log("add login here")} className="btn btn-default">Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Login
