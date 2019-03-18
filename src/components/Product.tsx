import * as React from "react";
import './Product.scss';

export interface ProductProps {
    title: string;
    imageUrl: string;
    price: number;
    category: string
};

export default class Product extends React.Component<ProductProps, {}> {
  render() {
    return (
      <div>
        <div className="product-container" data-tid="container">
          <div className="title">{ this.props.title }</div>
          {/* <div className="category">{ this.props.category }</div> */}
          <img src={ this.props.imageUrl } className="img" alt={ this.props.title }/>
          <div className="bottom">
            <div className="price">{ this.props.price }</div>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    );
  }
}