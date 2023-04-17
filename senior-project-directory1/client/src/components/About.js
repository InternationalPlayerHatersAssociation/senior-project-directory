import React from "react";
import {homeObjTwo, homeObjFour, homeObjThree, homeObjFive, homeObjSix, homeObjSeven, homeObjEight, homeObjNine} from './Home/Home.Data';
import AboutInfo from './AboutInfo';

const About=()=>{
    return(
<>
        <AboutInfo {...homeObjThree} />
        <AboutInfo {...homeObjTwo} />
        <AboutInfo {...homeObjSix} />
        <AboutInfo {...homeObjEight} />
        <AboutInfo {...homeObjSeven} />

        <AboutInfo {...homeObjNine} />
        <AboutInfo {...homeObjFour} />


</>
    )
}


export default About;
