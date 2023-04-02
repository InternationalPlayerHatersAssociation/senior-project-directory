import React from "react";
import { useAuth } from "../../auth";



const LoggedInForm=()=>{
    return(
        <>      
        <p>Logged In Form</p>
        </>
    )
}
const LoggedOutForm=()=>{
    return(
        <>
        <p>Please Log In</p>
        </>
    )
}


const Form=()=>{
    const [logged] = useAuth()
    return(
        <div>
        {logged? <LoggedInForm/> : <LoggedOutForm/>}
        </div>
    )
}


export default Form;