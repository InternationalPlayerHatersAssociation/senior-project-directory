import React from "react";
import {homeObjTen} from './Home/Home.Data';
import AboutInfo from './AboutInfo';
import './Form/Form.css';
import './Form/FormOther.css';
import { InfoColumn, InfoRow, TextWrapper } from "./InfoSection.elements";
import { SocialIconLink } from "./Footer/Footer.elements";
import {
    FaYoutube,
  } from 'react-icons/fa';

const Contact=()=>{
    return(
<>

<div className="form">
<AboutInfo {...homeObjTen} />

<InfoColumn>
<h6><a href="https://github.com/InternationalPlayerHatersAssociation">Github link</a></h6>
</InfoColumn>
<br></br>
</div>
</>
    )
}


export default Contact;
