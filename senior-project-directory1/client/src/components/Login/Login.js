import React from "react";
/*import Button from 'react-bootstrap/Button';*/
import Form from 'react-bootstrap/Form';
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { login } from "../../auth";
import Alert from "react-bootstrap/Alert";
import styles from './Login.module.css'; 


import "../Form/Form.css"

//comment
const Login=({
    lightBg})=>{
    const {register, handleSubmit, watch,reset, formState: {errors}} = useForm()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate()

    const loginUser=(data)=>{
        
        const requestOptions={
            method: 'POST',
            headers:{
                'content-type': 'application/json'
            },
            body:JSON.stringify(data)
        }
        fetch('/login', requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error('Invalid email or password');
            }
            return res.json();
        })
        .then(data => {
            console.log(data.access_token)
            login(data.access_token)
            navigate('../', {replace:true})
        })
        .catch(err => {
                    console.log(err)
                    setShowAlert(true);
                    setAlertMessage(err.message);
        })

        reset()

    }

    return(
         <div >
            <div className="form"></div>
            <div className="formContainer">
           <h3><img src='../../img/Cat-Embroidery.png' alt='success-image' width='175px' /></h3>
           

            <form1>
            <h2>Login </h2><br></br>
            {showAlert && (
                <div className="h8" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Alert
                    variant="danger"
                    onClose={() => setShowAlert(false)}
                    dismissible
                    style={{ width: '100%' }}
                    >
                    {alertMessage}
                    </Alert>
                </div>
                )}
            <div>
                        <label htmlFor="email">Email    </label>
                        <input placeholder="youremail@gmail.com"
                         {...register('email', {required:true})}/>
                            {errors.email && <p style = {{color:'red'}}><small>Email is required</small></p>}

                        <label htmlFor="password">Password  </label>
                        <input type="password" placeholder="*******************"
                            {...register('password', {required:true})}/>
                            {errors.email && <p style = {{color:'red'}}><small>Password is required</small></p>}
                        <input type ="submit1" value={"Login"} onClick={handleSubmit(loginUser)} />
                        

                        <h3><small>Don't have an account?<Link to="/signup"> Register here.</Link></small></h3>

                    </div>
                </form1>
                <br></br>
                </div>
                <br></br>

        </div>

    )
}


export default Login;