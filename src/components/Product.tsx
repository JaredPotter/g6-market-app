import * as React from "react";
import "./Product.scss";
import Dollar from "./Dollar";

export interface ProductProps {
    title: string;
    imageUrl: string;
    price: number;
    category: string;
    onCartUpdate: Function;
    quantity: number;
};

export default class Product extends React.Component<ProductProps, {}> {
  handleClickChangeQuantity = (quantity : number) => {
    const item = {
      title: this.props.title,
      price: this.props.price,
      quantity: quantity
    };  

    this.props.onCartUpdate(item);
  };


  handleChange = (e : any) => {
    const value = parseInt(e.target.value);

    if(!isNaN(value)) {
      const item = {
        title: this.props.title,
        price: this.props.price,
        quantity: value
      };  
  
      this.props.onCartUpdate(item);      
    }
  };

  // addToCartOrQuantity = (quantity : number) => {
  addToCartOrQuantity(quantity : number) {
    if(quantity > 0) {
      return (
        <div>
          <button onClick={ () => this.handleClickChangeQuantity(this.props.quantity - 1) }>-</button>
          {/* <div>{ quantity }</div> */}
          <input type="text" value={ quantity } onChange={ this.handleChange }/>
          <button onClick={ () => this.handleClickChangeQuantity(this.props.quantity + 1) }>+</button>
        </div>
      );
    }
    else {
      return (
        <button onClick={ () => this.handleClickChangeQuantity(1) } className="add-to-cart-button">Add to Cart</button>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="product-container" data-tid="container">
          <div className="img">
            <img src={ this.props.imageUrl } alt={ this.props.title }/>
          </div>
          <div className="title">{ this.props.title }</div>
          <div className="bottom">
            <Dollar value={ this.props.price }/>
            { this.addToCartOrQuantity(this.props.quantity) }
          </div>
        </div>
      </div>
    );
  }
}