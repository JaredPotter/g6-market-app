import * as React from 'react';
import './App.scss';
import Product from './components/Product';
import Select from './components/Select';
import Search from './components/Search';
import Cart from './components/Cart';
import categories from './categories.json';
import products from './products.json';

export interface AppState {
  currentCategoryValue: any;
  categories: Array<any>;
  products: Array<any>;
  cartItems: Array<any>;
};

export default class App extends React.Component<{}, AppState> {
  constructor(props : any) {
    super(props);

    this.updateCategoryFilter = this.updateCategoryFilter.bind(this);
    // this.onRemoveFromCart = this.onRemoveFromCart.bind(this);
    this.state = {
      currentCategoryValue: 'all',
      categories: categories,
      products: products,
      cartItems: [
        {
          title: 'Bananas',
          price: 0.99,
          quantity: 3
        }
      ]
    };
  }

  updateCategoryFilter(category : string) {
    this.setState({
      currentCategoryValue: category,
    });
  };

  onAddToCart(item : any) {
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

  onRemoveFromCart(item : any) {
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
          onAddToCart={ (item : any) => this.onAddToCart(item)}
        />
      )
    });

    return (
      <div className="app">
        <div className="top-bar">
          <a href="/">
            <img src="/logo_title.png" alt="G6 Market"/>
          </a>
          <div className="search">
            <Search 
              inputSet={ this.state.products }
              searchFieldName={ 'title' }
              minimumSearchLength={ 2 }
            />
          </div>
          <div className="top-subtotal-cart-count">
            asd
          </div>
        </div>
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

          </div>
          <div className="products">
            { productList }
          </div>
        </div>
        <div className="right">
          <Cart taxRate={ 0.05 } items={ this.state.cartItems } onRemoveFromCart={ (item : any) => this.onRemoveFromCart(item) }/>
        </div>
      </div>
    );
  }
};