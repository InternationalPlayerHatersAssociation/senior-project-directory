import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth";
import {homeObjOne, homeObjTwo} from './Home.Data';
import InfoSection from '../InfoSection';

import Calendar from "../Calendar/Calendar";






const LoggedInHome=()=>{
    return(
        <>      
        <Calendar />
        </>
    )
}
const LoggedOutHome=()=>{
    return(
        <>
        <InfoSection {...homeObjOne} />

        </>
    )
}


const HomePage=()=>{
    const [logged] = useAuth()
    return(
        <div>
        {logged? <LoggedInHome/> : <LoggedOutHome/>}
        </div>
    )
}


export default HomePage;