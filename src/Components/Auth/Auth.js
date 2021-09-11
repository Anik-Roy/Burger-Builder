import React, { Component } from 'react';
import { Formik } from 'formik';
import { auth } from '../../redux/authActionCreators';
import { connect } from 'react-redux';
import Spinner from '../Spinner/Spinner';
import { Alert } from 'reactstrap';

const mapStateToProps = state => {
    return {
        authLoading: state.authLoading,
        authFailedMessage: state.authFailedMessage,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        auth: (email, password, mode) => {
            dispatch(auth(email, password, mode));
        }
    }
}

class Auth extends Component {
    state = {
        mode: "Sign up",
    }

    switchModeHandler = () => {
        this.setState({
            mode: this.state.mode === "Sign up" ? "Login" : "Sign up",
        })
    }
    render() {
        let err = null;
        if(this.props.authFailedMessage !== null) {
            err = <Alert color="danger">{this.props.authFailedMessage}</Alert>
        }
        let form = null;
        if(this.props.authLoading) {
            form = <Spinner />
        } else {
            form = <Formik
                initialValues={{
                    email: "",
                    password: "",
                    passwordConfirm: ""
                }}
                onSubmit={
                    (values) => {
                        this.props.auth(values.email, values.password, this.state.mode);
                    }
                }
                validate={
                    (values)=>{
                        const errors = {};

                        if(!values.email) {
                            errors.email = "Required!";
                        } else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(values.email)) {
                            errors.email = "Invalid email address!";
                        }

                        if(!values.password) {
                            errors.password = "Required!";
                        } else if(values.password.length < 4) {
                            errors.password = "Password must be atleast 4 characters!";
                        }

                        if(this.state.mode === "Sign up") {
                            if(!values.passwordConfirm) {
                                errors.passwordConfirm = "Required!";
                            } else if(values.password !== values.passwordConfirm) {
                                errors.passwordConfirm = "Password field does not matched";
                            }
                        }

                        console.log(errors);

                        return errors;
                    }
                }
            >
                {
                    ({values, handleChange, handleSubmit, errors}) => {
                        return <div style={{
                            border: "1px solid grey",
                            padding: "15px",
                            borderRadius: "7px",
                        }}>
                            <button style={{width: "100%", backgroundColor: "#d70f64", color: "white"}}
                            className="btn btn-lg"
                            onClick={this.switchModeHandler}>Switch to {this.state.mode==="Sign up" ? "Login" : "Sign up"}</button>
                            <br /><br />
                            <form onSubmit={handleSubmit}>
                                <input
                                    name="email"
                                    placeholder="Enter your email"
                                    className="form-control"
                                    value={values.email}
                                    onChange={handleChange}/>
                                <span style={{color: "red"}}>{errors.email}</span>
                                <br />
                                <input
                                    name="password"
                                    placeholder="Enter your password"
                                    className="form-control"
                                    value={values.password}
                                    onChange={handleChange}/>
                                <span style={{color: "red"}}>{errors.password}</span>
                                <br />
                                {this.state.mode === "Sign up" ? <div>
                                    <input
                                        name="passwordConfirm"
                                        placeholder="Confirm password"
                                        className="form-control"
                                        value={values.passwordConfirm}
                                        onChange={handleChange}/>
                                    <span style={{color: "red"}}>{errors.passwordConfirm}</span>
                                    <br />
                                </div>: null}
                                
                                
                                <button type="submit" className="btn btn-success">{this.state.mode === "Sign up" ? "Sign up" : "Login"}</button>
                            </form>
                        </div>
                    }
                }
            </Formik>
        }
        return (
            <div>
                {err}
                {form}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);