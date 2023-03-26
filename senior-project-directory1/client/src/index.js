import React, {useState,useEffect} from 'react'
import ReactDOM  from 'react-dom'
/*import 'bootstrap/dist/css/bootstrap.min.css';*/
import NavBar from './components/Navbar';
/*import './styles/main.css'*/
import{
    BrowserRouter as Router, 
    Route,
    Routes,
    Link
} from 'react-router-dom'
import HomePage from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import GlobalStyle from './globalStyles';

const App = () => {
    return(
        <Router>
            <GlobalStyle />
            <NavBar/>
            <Routes>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<SignUp/>}/>
                <Route path="/" element={<HomePage/>}/>
            </Routes>
        </Router>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));