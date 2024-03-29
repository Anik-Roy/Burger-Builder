import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchOrders} from '../../redux/actionCreators';
import Order from './Order/Order';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => {
    return {
        orders: state.orders,
        ordersLoading: state.ordersLoading,
        ordersError: state.ordersError,
        token: state.token,
        userId: state.userId,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        fetchOrders: (token, userId) => dispatch(fetchOrders(token, userId))
    }
}

class Orders extends Component {
    componentDidMount() {
        this.props.fetchOrders(this.props.token, this.props.userId);
    }
    
    componentDidUpdate() {
        //console.log(this.props);
    }

    render() {
        let orders = null;
        if(this.props.ordersError) {
            orders = <p style={{
                border: "1px solid grey",
                borderRadius: "5px",
                padding: "5px",
                marginRight: "10px"}}>Sorry! Failed to load orders.</p>
        } else {
            if(this.props.orders.length === 0) {
                orders = <p style={{
                    border: "1px solid grey",
                    borderRadius: "5px",
                    padding: "5px",
                    marginRight: "10px"}}>You've no orders!</p>
            } else {
                orders = this.props.orders.map(order => {
                    return <Order order={order} key={order.id} />
                });
            }
        }

        return (
            <div>
                {this.props.ordersLoading ? <Spinner /> : orders}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);