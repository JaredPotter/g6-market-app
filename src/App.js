import React, { Component } from 'react';
import './App.css';
import Product from './components/Product.tsx';
import Select from './components/Select.tsx';
import Search from './components/Search.tsx';
import Cart from './components/Cart.tsx';
import categories from './categories.json';
import products from './products.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.updateCategoryFilter = this.updateCategoryFilter.bind(this);
    // this.onRemoveFromCart = this.onRemoveFromCart.bind(this);
    this.state = {
      currentCategoryValue: 'all',
      categories: categories,
      products: products,
      displayProducts: [],
      cartItems: [
        {
          title: 'Bananas',
          price: 0.99,
          quantity: 3
        }
      ]
    };
  }

  updateCategoryFilter(category) {
    this.setState({
      currentCategoryValue: category,
    });
  };

  onAddToCart(item) {
    const existing = this.state.cartItems.find((i) => { 
      return i.title === item.title
    });
    
    if(existing) {
      // Increment quantity by 1.
      existing.quantity++;
      this.setState({
        cartItems: this.state.cartItems.slice(0)
      });
    }
    else {
      // Add new item to cart.
      const itemsClone =  this.state.cartItems.slice(0);
      item.quantity = 1;

      itemsClone.push(item);
      this.setState({
        cartItems: itemsClone
      });
    }
  };

  onRemoveFromCart(item) {
    debugger;
    const cartItems = this.state.cartItems.slice(0);
    const newCartItems = cartItems.filter(i => {
      return i.title !== item.title
    });

    this.setState({
      cartItems: newCartItems
    });
  }

  render() {
    let filteredProductList = [];
    const category = this.state.currentCategoryValue;

    if(category !== 'all') {
      filteredProductList = this.state.products.filter((product) => {
        return product.category === category;
      });
    }
    else {
      filteredProductList = this.state.products.slice(0);
    }

    const productList = filteredProductList.map((item) => {
      return (
        <Product
          key={ item.title }
          title={ item.title }
          imageUrl={ item.imageUrl }
          price={ item.price }
          category={ item.category }
          onAddToCart={ (item) => this.onAddToCart(item)}
        />
      )
    });

    return (
      <div className="App">
        <div className="left">
          <div className="filters">
            <div>Sort By: 
              <select>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
            <div>
              Category:
              <Select 
                currentValue={ this.state.currentCategoryValue }
                options={ this.state.categories }
                onSelectChange={ this.updateCategoryFilter }
              />            
            </div>
            <div className="search">
              <Search 
                inputSet={ this.state.products }
                searchFieldName={ 'title' }
                minimumSearchLength={ 2 }
              />
            </div>
          </div>
          <div className="products">
            { productList }
          </div>
        </div>
        <div className="right">
          <Cart taxRate={ 0.05 } items={ this.state.cartItems } onRemoveFromCart={ (item) => this.onRemoveFromCart(item) }/>
        </div>
      </div>
    );
  }
}

export default App;
