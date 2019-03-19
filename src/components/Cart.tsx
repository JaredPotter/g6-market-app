import * as React from "react";
import './Cart.scss';
import Dollar from './Dollar';

export interface CartProps { 
    items: Array<any>;
    taxRate: number;
    onRemoveFromCart: Function;
}

export interface CartState {
    // subtotal: number;
}

export default class Cart extends React.Component<CartProps, CartState> {   
    constructor(props : CartProps) {
        super(props);

        this.state = {};
    }

    subtotalAmount(items : Array<any>) {
        let subtotal = items.reduce((accum, item) => { return accum + item.price * item.quantity}, 0);

        return subtotal;
    }

    renderLineItem(items : Array<any>) {
        const lineItems = items.map((item) => {
            return (
                <tr key={ item.title }>
                    <td>
                        { item.title }
                    </td>
                    <td className="quantity">
                        { item.quantity }
                    </td>
                    <td>
                        <Dollar value={ item.price }/>
                    </td>
                    <td onClick={ () => this.handleRemoveFromCart(item) } className="remove">
                        X
                    </td>
                </tr>
            );
        });

        return lineItems;
    };

    subtotal(subtotal : number) {
        return (
            <tr>
                <td>
                    Subtotal
                </td>
                <td>
                    <Dollar value={ subtotal }/>
                </td>
            </tr>
        );
    }

    taxRate(rate : number) {
        return (
            <tr>
                <td>Tax Rate</td>
                <td>
                    { rate * 100 }%
                </td>
            </tr>
        );
    };

    taxAmount(rate : number, subtotal : number) {
        return (
            <tr>
                <td>Tax Amount</td>
                <td>
                    <Dollar value={ rate * subtotal }/>
                </td>
            </tr>
        );
    };

    totalAmount(rate : number, subtotal : number) {
        return (
            <tr>
                <td><strong>Total</strong></td>
                <td>
                    <strong><Dollar value={ (rate * subtotal) + subtotal }/></strong>
                </td>
            </tr>            
        );
    };

    handleRemoveFromCart(item : any) {
        debugger;
        this.props.onRemoveFromCart(item);
    }

    // handleRemoveFromCart = (item : any) => {
    //     debugger;
    //     this.props.onRemoveFromCart(item);
    // }

    render() {
        // const lineItems = this.props.items.map((item) => {
        //     return (
        //         <tr key={ item.title }>
        //             <td>
        //                 { item.title }
        //             </td>
        //             <td className="quantity">
        //                 { item.quantity }
        //             </td>
        //             <td>
        //                 <Dollar value={ item.price }/>
        //             </td>
        //             <td onClick={ this.handleRemoveFromCart } className="remove">
        //                 X
        //             </td>
        //         </tr>
        //     );
        // });

        return (
            <div className="cart-container">
                <h3>Cart</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderLineItem(this.props.items ) }
                    </tbody>
                </table>
                <table>
                    <tbody>
                        { this.subtotal(this.subtotalAmount(this.props.items)) }
                        { this.taxRate(this.props.taxRate) }
                        { this.taxAmount(this.props.taxRate, this.subtotalAmount(this.props.items)) }
                        { this.totalAmount(this.props.taxRate, this.subtotalAmount(this.props.items)) }
                    </tbody>
                </table>
            </div>
        );
    };
};