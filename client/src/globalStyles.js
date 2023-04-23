import styled, {createGlobalStyle} from 'styled-components'

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Source Sans Pro', sans-serif;
}
`;

export const Container = styled.div`
z-index: 1;
width: 100%;
max-width: 1300px;
margin-right: auto;
margin-left: auto;
padding-right: 50px;
padding-left: 50px;

@media screen and (max-width: 991px) {
    padding-right: 30px;
padding-left: 30px;
}
`;

export const Container2 = styled.div`
z-index: 1;
width: 100%;
width: 600px;
max-height: 900px;
background-color: #fff;
margin-right: auto;
margin-left: auto;
margin-top: 30px;
border-radius: 15px;
box-shadow: 2 2 2 2;

@media screen and (max-width: 991px) {
    padding-right: auto;
padding-left: auto;
}
`;

export const Container3 = styled.div`
z-index: 1;
width: 100%;
align-content: center;
max-width: 1300px;
margin-right: auto;
margin-left: auto;
padding-right: 50px;
padding-left: 50px;

@media screen and (max-width: 991px) {
    padding-right: 30px;
padding-left: 30px;
}
`;

export const Button = styled.button`
border-radius: 4px;
background: ${({primary}) => (primary ? '#6d5078' : '#6d5078')};
white-space: nowrap;
padding: ${({big}) => (big ? '12px 64px' : '10px 20px')};
color: #fff;
font-size: ${({fontBig}) => (fontBig ? '20px' : '16px')};
outline: none;
border: none;
margin-bottom: 10px;
cursor: pointer;

&:hover {
    transition: all 0.3s ease-out;
    background: #fff;
    background-color: ${({primary}) => (primary ? '#6d5078' : '#6d5078')};
}

@media screen and (max-width: 960px) {
    width: 100%;
}
`;


export default GlobalStyle;
