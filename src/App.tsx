import * as React from 'react';
import './App.scss';
import Product from './components/Product';
import Select from './components/Select';
import Search from './components/Search';
import Dollar from './components/Dollar';
import Cart from './components/Cart';
import categories from './categories.json';
import products from './products.json';

// interface Product {
//   title: string;
//   price: number;
//   quantity: number;
// }

export interface AppState {
  currentCategoryValue: string;
  currentSortByValue: string;
  currentSearchQueryValue: string;
  categories: Array<any>;
  products: Array<any>;
  filteredProductList: Array<any>;
  cartItems: Array<any>;
};

export default class App extends React.Component<{}, AppState> {
  constructor(props : any) {
    super(props);

    this.updateCategoryFilter = this.updateCategoryFilter.bind(this);
    this.handleChangeSortBy = this.handleChangeSortBy.bind(this);
    this.getSubtotal = this.getSubtotal.bind(this);
    this.getCartCount = this.getCartCount.bind(this);
    this.state = {
      currentCategoryValue: 'all',
      currentSortByValue: 'name',
      currentSearchQueryValue: '',
      categories: categories,
      products: products,
      filteredProductList: [],
      cartItems: [
        // {
        //   title: 'Bananas',
        //   price: 0.99,
        //   quantity: 3
        // }
      ]
    };
  }

  componentDidMount() {
    // const filteredProductList = this.state.products
    // const payload = {
    //   category: this.state.currentCategoryValue,
    //   sortBy: this.state.currentSortByValue,
    // };  

    this.updateFilteredProducts();
  }

  updateCategoryFilter(category : string) {
    this.updateFilteredProducts(category);
  };

  handleChangeSortBy(sortBy : string) {
    this.updateFilteredProducts(undefined, sortBy);
  }

  onCartUpdate(item : any) {
    const existing = this.state.cartItems.find((i) => { 
      return i.title === item.title
    });

    let newCartItems = [];
    
    if(existing) {
      existing.quantity = item.quantity;
      newCartItems = this.state.cartItems.slice(0)
    }
    else {
      // Add new item to cart.
      const itemsClone =  this.state.cartItems.slice(0);
      item.quantity = 1;

      itemsClone.push(item);
      newCartItems = itemsClone;
    }

    this.updateFilteredProducts(undefined, undefined, undefined, newCartItems);    
  };

  onRemoveFromCart(item : any) {
    const cartItems = this.state.cartItems.slice(0);
    const existing = cartItems.slice(0).find(e => e.title === item.title);

    if(existing) {
      existing.quantity = 0;
    }
    
    this.updateFilteredProducts(undefined, undefined, undefined, cartItems); 
  }

  updateFilteredProducts(category? : string, sortBy? : string, query? : string, cartItems? : any[]) {
    let filteredProductList = [] as any[];

    // Apply Category.
    category = category ? category : this.state.currentCategoryValue;
    sortBy = sortBy ? sortBy : this.state.currentSortByValue;
    query = query ? query : this.state.currentSearchQueryValue;
    cartItems = cartItems ? cartItems : this.state.cartItems;

    if(category !== 'all') {
      filteredProductList = this.state.products.filter((product) => {
        return product.category === category;
      });
    }
    else {
      filteredProductList = this.state.products.slice(0);
    }

    // Apply Sort by.
    if(sortBy === 'name') {
      filteredProductList = filteredProductList.sort((a, b) => {
        if (a.title < b.title)
          return -1;
        if (a.title > b.title)
          return 1;
        return 0;
      });
    }
    else if(sortBy === 'price') {
      filteredProductList = filteredProductList.sort((a, b) => {
        return a.price - b.price;
      });
    }

    // Apply search query.
    if(query) {
      filteredProductList = filteredProductList.filter((option) => {
        const optionValue = option.title;
        
        if(
            (
                (new RegExp('^' + query!.toLowerCase())).test(optionValue.toLowerCase()) // Regex search on whole list of partial match.
                ||
                (new RegExp('^.*' + query!.toLowerCase() + '.*$')).test(optionValue.toLowerCase())
            )
        )
        {
            return true
        }
      });
    }

    // Match cartItems and filteredProduct list.
    cartItems.forEach((item) => {
      const element = filteredProductList.find(e => e.title === item.title);

      if(element) {
        element.quantity = item.quantity;
      }
    });
    
    // Remove empty elements from cart.
    const newCartItems = cartItems.filter(item => item.quantity > 0);

    this.setState({
      filteredProductList: filteredProductList,
      cartItems: newCartItems,
      currentCategoryValue: category,
      currentSortByValue: sortBy,
      currentSearchQueryValue: query,
    })
  }

  getSubtotal() {
    const cartItems = this.state.cartItems;
    let subtotal = 0;
    
    if(cartItems.length > 0) {
      subtotal = cartItems.reduce((total, item) => total += item.price * item.quantity);
    }

    return subtotal;
  }

  getCartCount() {
    const cartItems = this.state.cartItems;
    let cartCount = 0;
    
    if(cartItems.length > 0) {
      cartCount = cartItems.reduce((total, item) => total += item.quantity);
    }

    return cartCount;
  }

  onQueryChange(query : string) {
    this.updateFilteredProducts(undefined, undefined, query)
  }

  render() {  
    const filteredProductList = this.state.filteredProductList;

    const productList = filteredProductList.map((item) => {
      return (
        <Product
          key={ item.title }
          title={ item.title }
          imageUrl={ 'thumbnails/' + item.url }
          price={ item.price }
          category={ item.category }
          onCartUpdate={ (item : any) => this.onCartUpdate(item)}
          quantity={ item.quantity }
        />
      )
    });

    return (
      <div className="app">
        <div className="top-bar">
          <a href="/">
            <img src="logo_title.png" alt="G6 Market"/>
          </a>
          <div className="search">
            <Search 
              inputSet={ this.state.products }
              searchFieldName={ 'title' }
              minimumSearchLength={ 2 }
              onQueryChange={ (query : string) => this.onQueryChange(query) }
            />
          </div>
          <div className="top-subtotal-cart-count">
            <div className="div">Subtotal: <Dollar value={ this.getSubtotal() }/></div>
            <div className="div">Cart: { this.getCartCount() }</div>
          </div>
        </div>
        <div className="filter-bar">
          <div>Sort By:
              <Select 
                currentValue={ this.state.currentSortByValue }
                options={ [{value: 'name', label: 'Name' }, {value: 'price', label: 'Price'}] }
                onSelectChange={ this.handleChangeSortBy }
              />              
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
        <div className="left">
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