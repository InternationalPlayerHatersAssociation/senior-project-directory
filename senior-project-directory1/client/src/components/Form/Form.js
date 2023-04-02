import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth";
import "./Form.css"
import {useForm} from 'react-hook-form';
import DatePicker from "react-multi-date-picker";
import {Link, useNavigate} from 'react-router-dom';



const LoggedInForm=()=>{
    const [value, setValue] = useState(new Date())
    const {handleSubmit, formState: {errors}} = useForm()

    return(
        <div >

        <div className="form"></div>
        <div className="formContainer">

        <form1>
        <h2>Student Info </h2><br></br>
            <div>
                    <label htmlFor="ClassesTaken">Classes Taken:    </label>
                    <input placeholder="Placeholder for a list"/>


                    
                    <label htmlFor="ClassesNeeded">Classes Needed:   </label>
                    <input placeholder="Placeholder for a list"/>

                    <label htmlFor="Conflicts">Schedule Conflicts:   
                    <br></br><DatePicker 
                    value={value}
                    onChange={setValue}/> 
      
       </label>

                </div>
                <input type ="submit1" value={"Submit"} onClick={handleSubmit()} />
                <br></br>
            </form1>
            </div>
    </div>

    )
}
const LoggedOutForm=()=>{
    return(
        <div >
        <div className="form"></div>
        <div className="formContainer">
        <br></br>
        <br></br>
        <form1>
        <h2>Please <Link to="/login">login</Link> to view your form <br></br>
            
        <br></br> <small><small>Don't have an account?<Link to="/signup"> Register here.</Link></small></small>
        <br></br>
        <br></br>
        <br></br> </h2>
               
            </form1>
            </div>
    </div>
    )
}


const Form=()=>{
    const [logged] = useAuth()
    return(
        <>
        {logged? <LoggedInForm/> : <LoggedOutForm/>}
        </>
    )
}


export default Form;