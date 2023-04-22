import React from 'react';
import {
  FooterContainer,
  FooterLinksContainer,
  FooterLinksWrapper,
  FooterLinkItems,
  FooterLinkTitle,
  FooterLink,
  SocialLogo,
  SocialIcon,
  WebsiteRights,
} from './Footer.elements';

function Footer() {
  return (
    <FooterContainer>
      <FooterLinksContainer>
        <FooterLinksWrapper>
          <FooterLinkItems>
            <FooterLinkTitle>About Us</FooterLinkTitle>
            <FooterLink to='/about'>Our Team</FooterLink>
          </FooterLinkItems>
          <FooterLinkItems>
            <FooterLinkTitle>Contact Us</FooterLinkTitle>
            <FooterLink to='/contact'>Contact</FooterLink>
          </FooterLinkItems>
        </FooterLinksWrapper>

      </FooterLinksContainer>
<br></br>
<br></br>
          <SocialLogo to='/'>
            <SocialIcon />
           Class Schedule Creator
          </SocialLogo>


      <WebsiteRights>PressPaws © 2023</WebsiteRights>
    </FooterContainer>
  );
}

export default Footer;