import React, {Component} from 'react';
import {Button, Modal, ModalBody} from 'reactstrap';
import {connect} from 'react-redux';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import {resetIngredients} from '../../../redux/actionCreators';

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable,
        userId: state.userId,
        token: state.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetIngredients: () => dispatch(resetIngredients())
    }
}

class Checkout extends Component {
    state = {
        values: {
            deliveryAddress: "",
            phone: "",
            paymentType: "Cash On Delivery"
        },
        isLoading: false,
        isModalOpen: false,
        modalMessage: "",
    }

    goBack = () => {
        this.props.history.goBack("/");
    }

    inputChangeHandler = (event) => {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        })
    }

    submitHandler = () => {
        this.setState({
            isLoading: true
        })
        const ingredients = [...this.props.ingredients];
        const ingredientObj = {}
        for(let i of ingredients) {
            ingredientObj[i.type] = ingredientObj[i.amount]
        }

        const order = {
            ingredients: ingredientObj,
            customer: this.state.values,
            price: this.props.totalPrice,
            orderTime: new Date(),
            user: this.props.userId,
        }
        // console.log(order);
        const header = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.post('http://127.0.0.1:8000/api/order/', order, header)
            .then(response => {
                if(response.status === 201) {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMessage: "Order placed successfully!"
                    });
                    this.props.resetIngredients();
                } else {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMessage: "Something went wrong! Order again!"
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    isModalOpen: true,
                        modalMessage: "Something went wrong! Order again!"
                })
            });
    }

    render() {
        let form = <div>
            <div>
                <h4 style={{
                    border: "1px solid grey",
                    boxShadow: "1px 1px #888888",
                    borderRadius: "5px",
                    padding: "20px"
                }}>Payment: {this.props.totalPrice} BDT</h4>
                <form style={{
                    border: "1px solid grey",
                    boxShadow: "1px 1px #888888",
                    borderRadius: "5px",
                    padding: "20px"
                }}>
                    <div className="form-group">
                        <label htmlFor="deliveryAddress">Your delivery address</label>
                        <textarea name="deliveryAddress" id="deliveryAddress" rows="3" value={this.state.values.deliveryAddress}
                            className="form-control" placeholder="Your delivery address" onChange={(e)=>this.inputChangeHandler(e)}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Your phone number</label>
                        <input name="phone" id="phone" className="form-control" value={this.state.values.phone}
                            placeholder="Your phone number" onChange={(e)=>this.inputChangeHandler(e)}/>
                    </div>
                    <div>
                        <label htmlFor="paymentType">Payment Type</label>
                        <select name="paymentType" id="paymentType" className="form-control" value={this.state.values.paymentType}
                            onChange={(e)=>this.inputChangeHandler(e)}>
                            <option value="Cash On Delivery">Cash On Delivery</option>
                            <option value="Bkash">Bkash</option>
                        </select>
                    </div>
                    <br/>
                    <Button style={{backgroundColor: "#D70F64"}} className="mr-auto"
                        onClick={this.submitHandler} disabled={!this.props.purchasable} >Place Order</Button>
                    <Button color="secondary" className="ml-1" onClick={this.goBack}>Cancel</Button>
                </form>
            </div>
        </div>


        return (
            <div>
                {this.state.isLoading? <Spinner /> : form}
                <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
                    <ModalBody>
                        <p>{this.state.modalMessage}</p>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);