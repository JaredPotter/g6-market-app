import React, { Component } from 'react';
import './App.css';
import Product from './components/Product.tsx';
import Select from './components/Select.tsx';
import Search from './components/Search.tsx';
import categories from './categories.json';
import products from './products.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.updateCategoryFilter = this.updateCategoryFilter.bind(this);
    this.state = {
      currentCategoryValue: 'all',
      categories: categories,
      products: products,
      displayProducts: []
    };
  }

  updateCategoryFilter(category) {
    this.setState({
      currentCategoryValue: category,
    });
  };

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
        />
      )
    });

    return (
      <div className="App">
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
    );
  }
}

export default App;
