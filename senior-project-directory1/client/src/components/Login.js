import React from "react";
/*import Button from 'react-bootstrap/Button';*/
import Form from 'react-bootstrap/Form';
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { login } from "../auth";
import { Container, Button } from "../globalStyles";
import {
    InfosSecLogin,
    InfoRow,
    InfoColumn,
    TextWrapper,
    } from './InfoSection.elements';

//comment
const Login=({
    lightBg})=>{
    const {register, handleSubmit, watch,reset, formState: {errors}} = useForm()
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
        .then(res => res.json())
        .then(data => {
            console.log(data.access_token)
            login(data.access_token)
            navigate('../', {replace:true})
        })
        .catch(err => console.log(err))

        reset()

    }

    return(
        <InfosSecLogin lightBg={lightBg}>
            <Container>
                <InfoRow>
                    <InfoColumn>
                        <TextWrapper>


                    <div className="container">
                        <div className="form"></div>
                            <h1>Login </h1><br></br>
                <form>
                   <p> <Form.Group>
                        <p><Form.Label>Email    </Form.Label>
                        <Form.Control type="email" placeholder="youremail@gmail.com"
                            {...register('email', {required:true})}/>
                            {errors.email && <p style = {{color:'red'}}><small>Email is required</small></p>}
                            </p>
                    </Form.Group>
                    </p>
                    
                    <br></br>
                    <Form.Group>
                        <Form.Label>Password   </Form.Label>
                        <Form.Control type="password" placeholder="*******************"
                            {...register('password', {required:true})}/>
                            {errors.email && <p style = {{color:'red'}}><small>Password is required</small></p>}
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Button as="sub" variant="primary" onClick={handleSubmit(loginUser)}>Login</Button>
                    </Form.Group>
                    <Form.Group>
                        <br></br>
                        <small>Don't have an account?<Link to="/signup"> Register here.</Link></small>
                    </Form.Group>
                </form>
        </div>
                    </TextWrapper>
                    </InfoColumn>
                </InfoRow>
                </Container>
        </InfosSecLogin>
    )
}


export default Login;