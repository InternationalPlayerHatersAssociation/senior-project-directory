import React, {useState, useEffect} from "react";
import { useAuth,logout } from "../../auth";
/*import Nav from 'react-bootstrap/Nav';*/


import { FaBars, FaTimes} from 'react-icons/fa';
import { IconContext} from 'react-icons/lib';
import { Button} from '../../globalStyles'
import { Nav, NavbarContainer, NavLogo, NavIcon,
   MobileIcon, NavMenu, NavItem, NavLinks, NavItemBtn, 
  NavBtnLink } from './Navbar.elements';


const LoggedInLinks=()=>{
    const [button, setButton] = useState(true);
    const showButton = () => {
        if(window.innerWidth <= 960) {
          setButton(false)
        }else{
          setButton(true);
        }
      };
      useEffect(() => {
        showButton();
      }, []);
    
      window.addEventListener('resize', showButton);
    return(
        
    <>
    <NavItem><NavLinks to="/">Home</NavLinks></NavItem>   
    <NavItem><NavLinks to='/form'>Edit Form</NavLinks></NavItem>   
    <NavItemBtn>
                {button ? (
                  <NavBtnLink to="/" onClick={()=>{logout()}}>
                    <Button primary>Logout</Button>
                  </NavBtnLink>
                ) : (
                  <NavBtnLink to="/" onClick={()=>{logout()}}>
                    <Button fontBig primary>
                      Logout
                    </Button>
                  </NavBtnLink>
                )}
              </NavItemBtn>


   { /*<NavItem><NavLinks to="/" onClick={()=>{logout()}}>Logout</NavLinks></NavItem> */}
    </>
    )
}

const LoggedOutLinks=()=>{
    const [button, setButton] = useState(true);
    const showButton = () => {
        if(window.innerWidth <= 960) {
          setButton(false)
        }else{
          setButton(true);
        }
      };
      useEffect(() => {
        showButton();
      }, []);
    
      window.addEventListener('resize', showButton);



    return(
    <>
    <NavItem><NavLinks to="/">Home</NavLinks></NavItem> 
    <NavItem><NavLinks to="/login">Login</NavLinks></NavItem> 
    <NavItemBtn>
                {button ? (
                  <NavBtnLink to="/signup">
                    <Button primary>Sign Up</Button>
                  </NavBtnLink>
                ) : (
                  <NavBtnLink to="/signup">
                    <Button fontBig primary>
                      Sign Up
                    </Button>
                  </NavBtnLink>
                )}
              </NavItemBtn>
    </>
    )
}

const NavBar =()=>{
    const [logged] = useAuth()

    const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);




    return(
        <>
<IconContext.Provider value={{ color: '#fff'}}>
      <Nav>
        <NavbarContainer>
            <NavLogo to="/" onClick={closeMobileMenu}>
                <NavIcon />
                    Class Schedule Creator
            </NavLogo>
            <MobileIcon onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </MobileIcon>
            <NavMenu onClick={handleClick} click={click}>
              {logged?<LoggedInLinks/>:<LoggedOutLinks/>}
              </NavMenu>
         </NavbarContainer>
      </Nav> 
    </IconContext.Provider>
    </>
    );
}

export default NavBar;