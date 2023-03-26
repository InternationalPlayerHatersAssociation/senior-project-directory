import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { Container, Button, Container2} from '../globalStyles';
import {
InfoSec,
InfoRow,
InfoColumn,
TextWrapper,
TopLine,
Heading,
Subtitle,
ImgWrapper,
Img
} from './InfoSection.elements';

const InfoSection = ({
   primary,
   lightBg,
   imgStart, 
   lightTopLine, 
   lightTextDesc, 
   buttonLabel, 
   description, 
   headline, 
   lightText, 
   topLine,
   img,
   alt,
   start}) => {
  const [myEvents, setmyEvents] = useState([]);
  return (
    <>
    
    <InfoSec lightBg={lightBg}>
        <Container>
            <InfoRow imgStart={imgStart}>
                <InfoColumn>
                    <TextWrapper>
                    <TopLine lightTopLine={lightTopLine}>{topLine}</TopLine>
                    <Heading lightText={lightText}>{headline}</Heading>
                    <Subtitle lightTextDesc={lightTextDesc}>{description}</Subtitle>
                    <Link to='/signup'>
                      <Button big fontBig primary={primary}>
                        {buttonLabel}
                      </Button>
                    </Link>
                    </TextWrapper>
                </InfoColumn>
                <InfoColumn>
                  <ImgWrapper start={start}>
                    <Img src={img} alt={alt} />
                  </ImgWrapper>
                </InfoColumn>
                </InfoRow>
        </Container>
    </InfoSec>
    </>
  );
}

export default InfoSection