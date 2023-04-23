import React from 'react'
import ReactDOM  from 'react-dom'
/*import 'bootstrap/dist/css/bootstrap.min.css';*/
import NavBar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
/*import './styles/main.css'*/
import{
    BrowserRouter as Router, 
    Route,
    Routes,

} from 'react-router-dom'
import HomePage from './components/Home/Home';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import Form from './components/Form/Form';
import About from './components/About';
import Contact from './components/Contact';
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
                <Route path="/form" element={<Form/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
            <Footer />
        </Router>
    )
}

ReactDOM.render(<App/>, document.getElementById('root'));
ReactDOM.render(<App/>, document.getElementById('root'));