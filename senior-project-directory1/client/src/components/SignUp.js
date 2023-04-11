import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "../globalStyles";
import {
    InfosSecLogin,
    InfoRow,
    InfoColumn,
    TextWrapper,
    } from './InfoSection.elements';

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
  <InfosSecLogin lightBg={lightBg}>
    <Container>
        <InfoRow>
            <InfoColumn>
                <TextWrapper>
    <div className="container">
      <div className="form"></div>
      {show?
      <>
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
        <p>
          {serverResponse}
        </p>
        </Alert>
        <h1>Sign Up</h1>

      </>
      : <h1>Sign Up</h1>
      }
      <form>
        <br></br>
        <Form.Group>
          <p><Form.Label>Email </Form.Label>
          <Form.Control
            type="email"
            placeholder="youremail@gmail.com"
            {...register("email", { required: true, maxLength: 200 })}
          /></p> <br></br>
          {errors.email && (
            <p style={{ color: "red" }}>
              <small>Username is required</small>
            </p>
            
          )}
        </Form.Group>
        <Form.Group>
          <p><Form.Label>Password  </Form.Label>
          <Form.Control
            type="password"
            placeholder="*******************"
            {...register("password", { required: true, minLength: 8 })}
          /></p><br></br>
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
          <Form.Label>Confirm Password </Form.Label>
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
        <br></br>
        <Form.Group>
          <Form.Select
            aria-label="Choose Major"
            defaultValue=""
            {...register("major")}
          >
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
        <br></br><br></br>
        <Form.Group>
          <Button as="sub" variant="primary" onClick={handleSubmit(submitForm)}>
            Sign Up
          </Button>
          {errors.major && (
            <p style={{ color: "red" }}>
              <small>Major is required</small>
            </p>
          )}
        </Form.Group>
        <br></br>
        <Form.Group>
          <small>
            Already have an account?<Link to="/login"> Login here.</Link>
          </small>
        </Form.Group>
      </form>
    </div>
    </TextWrapper>
    </InfoColumn>
    </InfoRow>
    </Container>
    </InfosSecLogin>


  );
};

export default SignUp;
