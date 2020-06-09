import React, {Component} from 'react';
import { DISHES } from './shared/dishes';
import logo from './logo.svg';
import { Navbar, NavbarBrand } from 'reactstrap';
import  Menu  from "./components/MenuComponent";
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES
    };
  }
  render() {
  return (
    <div className="App">
<Navbar dark color="primary">
 <div className="container">
   <NavbarBrand href="/">Ristorente Con Fusioin</NavbarBrand>
  </div> 
</Navbar>
<Menu dishes={this.state.dishes}  />
 </div>
  );
}
}

export default App;
