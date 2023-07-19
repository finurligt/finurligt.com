import React, { Component } from 'react'
import { Alert } from 'react-bootstrap';
import withAuth from '../contexts/withAuth';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            loading: false,
            email: "",
            password: "",
        };
        this.modalRef = React.createRef();
        this.handleKeypress = this.handleKeypress.bind(this)
        
    }

    handleKeypress(e) {
        
        if (e.key==='Enter') {
            this.handleLogin()
        }
    }

    handleLogin() {
        const { auth } = this.props;

        this.setState({ error: "", loading: true });
        auth.login(this.state.email, this.state.password)
            .then(() => {
                this.modalRef.current.click();
                this.setState({ loading: false })
            })
            .catch((e) => {
                console.log(e)
                this.setState({ error: e.message, loading: false });

            });
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
    };


    render() {
        return (
            <>
                <div className="modal fade" id="modalLoginForm" tabIndex="-1" role="dialog"
                    aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold">Sign in</h4>
                                <button ref={this.modalRef} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body mx-3">
                                <div className="md-form mb-5">
                                    <i className="fas fa-envelope prefix grey-text"></i>
                                    <input onKeyUp={this.handleKeypress} onChange={this.handleChange} name="email" type="email" id="defaultForm-email" className="form-control validate" />
                                    <label data-error="wrong" data-success="right" htmlFor="defaultForm-email">Your email</label>
                                </div>

                                <div className="md-form mb-4">
                                    <i className="fas fa-lock prefix grey-text"></i>
                                    <input onKeyUp={this.handleKeypress} onChange={this.handleChange} name="password" type="password" id="defaultForm-pass" className="form-control validate" />
                                    <label data-error="wrong" data-success="right" htmlFor="defaultForm-pass">Your password</label>
                                </div>
                                {this.state.error && <Alert variant='danger'>{this.state.error}</Alert>}

                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button disabled={this.state.loading} onClick={() => this.handleLogin()} className="btn btn-default">Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withAuth(Login); //hooks can't be used in class components, but you can send them in with props like this
