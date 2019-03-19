import * as React from "react";
import './Product.scss';
import Dollar from './Dollar';

export interface ProductProps {
    title: string;
    imageUrl: string;
    price: number;
    category: string;
    onAddToCart: Function;
};

export default class Product extends React.Component<ProductProps, {}> {
  handleClick = () => {
    const item = {
      title: this.props.title,
      price: this.props.price,
    };  

    this.props.onAddToCart(item);
  };

  render() {
    return (
      <div>
        <div className="product-container" data-tid="container">
          <div className="title">{ this.props.title }</div>
          <div className="img">
            <img src={ this.props.imageUrl } alt={ this.props.title }/>
          </div>
          <div className="bottom">
            {/* <div className="price">{ this.props.price }</div> */}
            <Dollar value={ this.props.price }/>
            <button onClick={ this.handleClick } className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      </div>
    );
  }
}