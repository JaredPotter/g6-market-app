import * as React from "react";
import './Cart.scss';
import Dollar from './Dollar';

export interface CartProps { 
    items: Array<any>;
    taxRate: number;
    onRemoveFromCart: Function;
    onCartUpdate: Function;
}

export default class Cart extends React.Component<CartProps, {}> {   
    constructor(props : CartProps) {
        super(props);

        this.getSubtotalAmount = this.getSubtotalAmount.bind(this);
        this.getTotalAmount = this.getTotalAmount.bind(this);
        this.getItemCount = this.getItemCount.bind(this);
        this.checkout = this.checkout.bind(this);

        this.state = {};
    }

    subtotalAmount(items : Array<any>) {
        let subtotal = items.reduce((accum, item) => { return accum + item.price * item.quantity}, 0);

        return subtotal;
    }

    onChangeQuantity= (e : any, title : string, price : number) => {
        const value = parseInt(e.target.value);

        if(!isNaN(value)) {
            const item = {
            title: title,
            price: price,
            quantity: value
            };  
        
            this.props.onCartUpdate(item);      
        }
    }

    renderLineItem(items : Array<any>) {
        const lineItems = items.map((item) => {
            return (
                <tr key={ item.title }>
                    <td>
                        { item.title }
                    </td>
                    <td className="quantity">
                        <input type="number" value={ item.quantity } onChange={ (e) => this.onChangeQuantity(e, item.title, item.price)}/>
                    </td>
                    <td>
                        <Dollar value={ item.price * item.quantity }/>
                    </td>
                    <td onClick={ () => this.handleRemoveFromCart(item) } className="remove">
                        X
                    </td>
                </tr>
            );
        });

        return lineItems;
    };

    renderSubtotal(subtotal : number) {
        return (
            <tr>
                <td>
                    Subtotal
                </td>
                <td className="value">
                    <Dollar value={ subtotal }/>
                </td>
            </tr>
        );
    }

    renderTaxRate(rate : number) {
        return (
            <tr>
                <td>Tax Rate</td>
                <td className="value">
                    { rate * 100 }%
                </td>
            </tr>
        );
    };

    renderTaxAmount(rate : number, subtotal : number) {
        return (
            <tr>
                <td>Tax Amount</td>
                <td className="value">
                    <Dollar value={ rate * subtotal }/>
                </td>
            </tr>
        );
    };

    renderTotalAmount(rate : number, subtotal : number) {
        return (
            <tr>
                <td><strong>Total</strong></td>
                <td className="value">
                    <strong><Dollar value={ (rate * subtotal) + subtotal }/></strong>
                </td>
            </tr>            
        );
    };

    handleRemoveFromCart(item : any) {
        this.props.onRemoveFromCart(item);
    }

    getSubtotalAmount() {
        const subtotal = this.props.items.reduce((total, item) => total += item.price * item.quantity, 0);

        return subtotal;
    }

    getTotalAmount() {
        const subtotal = this.getSubtotalAmount();
        const total = subtotal * ( 1 + this.props.taxRate);

        return total;
    }

    getItemCount() {
        const count = this.props.items.reduce((total, item) => total += item.quantity, 0);

        return count;
    }

    checkout() {
        alert('Grocery Order Complete! - Total: $' + this.getTotalAmount().toFixed(2) + ' for ' + this.getItemCount() + ' items.');

        this.props.items.forEach((item) => {
            this.handleRemoveFromCart(item);
        });
    }

    render() {
        return (
            <div className="cart-container">
                <div className="top">
                <h1>Cart</h1>
                    <div className="cart-icon">
                        <span className="total-quantity">{ this.getItemCount() }</span>
                        <img src="shopping-cart.svg" alt="Shopping Cart"/>
                    </div>                    
                    <table className="items">
                        <tbody>
                            { this.renderLineItem(this.props.items ) }
                        </tbody>
                    </table>            
                </div>
                <div className="bottom">
                    <h2>Cart Total</h2>
                    <table>
                        <tbody>
                            { this.renderSubtotal(this.subtotalAmount(this.props.items)) }
                            { this.renderTaxRate(this.props.taxRate) }
                            { this.renderTaxAmount(this.props.taxRate, this.subtotalAmount(this.props.items)) }
                            { this.renderTotalAmount(this.props.taxRate, this.subtotalAmount(this.props.items)) }
                        </tbody>
                    </table>                    
                    <button onClick={ this.checkout } className="checkout">CHECK OUT</button>
                </div>                
            </div>
        );
    };
};