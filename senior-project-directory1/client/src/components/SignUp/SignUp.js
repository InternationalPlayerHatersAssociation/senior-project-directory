import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "../../globalStyles";
import {
    InfosSecLogin,
    InfoRow,
    InfoColumn,
    TextWrapper,
    } from '../InfoSection.elements';

const SignUp = ({
  lightBg}) => {
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false)
  const [serverResponse, setServerResponse] = useState('')
  const navigate = useNavigate()

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        email: data.email,
        password: data.password,
        major: data.major,
      };
      const requestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      fetch("/register", requestOptions)
        .then((res) => res.json())
        .then((data) =>{ 
            console.log(data)
            setServerResponse(data.message)
            console.log(serverResponse)
            setShow(true)
        })
        .catch((err) => console.log(err));
    } else {
      alert("Passwords do not match");
    }
    reset();
  };
  //grab majors from api to display in checklist
  useEffect(() => {
    // Fetch data from API endpoint
    fetch("/majors")
      .then((res) => res.json())
      .then((data) => {
        // Update options state with retrieved data
        setOptions(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <div className="form">
      <form1>
      {show?
      <>
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
        <p>
          {serverResponse}
        </p>
        </Alert>
        <h1>Sign Up</h1>

      </>
      : <h2>Sign Up</h2>
      }

      {/* <sImage>
            <img src='../../img/Cat-Embroidery.png' alt='success-image' width='175px' />
    </sImage>*/}

      <form1>
      
        <Form.Group>
          <p><label htmlFor="email">Email    </label>
          <Form.Control
            type="email"
            placeholder="youremail@gmail.com"
            {...register("email", { required: true, maxLength: 200 })}
          /></p>
          {errors.email && (
            <p style={{ color: "red" }}>
              <small>Username is required</small>
            </p>
            
          )}
        </Form.Group>
        <Form.Group>
          <p><label htmlFor="password">Password    </label>
          <Form.Control
            type="password"
            placeholder="*******************"
            {...register("password", { required: true, minLength: 8 })}
          /></p>
          {errors.password && (
            <p style={{ color: "red" }}>
              <small>Password is required</small>
            </p>
          )}

          {errors.password?.type === "minLength" && (
            <p style={{ color: "red" }}>
              <small>Password should be at least 8 characters</small>
            </p>
          )}
        </Form.Group>
        <Form.Group>
        <label htmlFor="confirmPassword">Confirm Password    </label>
          <Form.Control
            type="password"
            placeholder="*******************"
            {...register("confirmPassword", { required: true, minLength: 8 })}
          />
          {errors.email && (
            <p style={{ color: "red" }}>
              <small>Must confirm password</small>
            </p>
          )}
          {errors.confirmPassword?.type === "minLength" && (
            <p style={{ color: "red" }}>
              <small>Password should be at least 8 characters</small>
            </p>
          )}
        </Form.Group>
        <label htmlFor="choose">Academic Major</label> 
        <Form.Group>
          <Form.Select 
            aria-label="Choose Major"
            defaultValue=""
            {...register("major")}
          size="lg">
            <option disabled value="">
              Select your major...
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
        <input type ="submit1" value={"Sign Up"} onClick={handleSubmit(submitForm)} />
          {errors.major && (
            <p style={{ color: "red" }}>
              <small>Major is required</small>
            </p>
          )}
        </Form.Group>
        <Form.Group>
         <h3><small>
            Already have an account?<Link to="/login"> Login here.</Link><br></br>
          </small></h3><br></br>
        </Form.Group>
        </form1>
        </form1>          </div>
        
        </div>
        


  );
};

export default SignUp;
