import React, { Component } from 'react';
import './App.css';
import Product from './components/Product.tsx';

class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="product">

        </div>
        <Product
          title={'Bananas'}
          imageUrl={'https://i5.walmartimages.com/asr/ad01e2d0-c67e-463f-9caf-b7c1995f40b3_1.7f58d030e8c04579b77174e274d31747.jpeg?odnWidth=200&odnHeight=200&odnBg=ffffff'}
          price={0.99}
          category={'produce'}
        />
      </div>
    );
  }
}

export default App;
