import React, { Component } from 'react';
import Burger from './Burger/Burger';
import Controls from './Controls/Controls';
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';
import Summary from './Summary/Summary';
import {connect} from 'react-redux';
import {addIngredient, removeIngredient, updatePurchasable} from '../../redux/actionCreators';

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addIngredient: (igType) => dispatch(addIngredient(igType)),
        removeIngredient: (igType) => dispatch(removeIngredient(igType)),
        updatePurchasable: () => dispatch(updatePurchasable())
    }
}

class BurgerBuilder extends Component {
    state = {
        modalOpen: false
    }

    addIngredientHandle = type => {
        this.props.addIngredient(type);
        this.props.updatePurchasable();
    }

    removeIngredientHandle = type => {
        this.props.removeIngredient(type);
        this.props.updatePurchasable();
    }

    toogleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    }

    handleCheckout = () => {
        this.props.history.push('/checkout');
    }

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <div className="d-flex flex-md-row flex-column">
                    <Burger ingredients={this.props.ingredients} />
                    <Controls
                        ingredientAdded = {this.addIngredientHandle}
                        ingredientRemoved = {this.removeIngredientHandle}
                        price = {this.props.totalPrice}
                        toogleModal = {this.toogleModal}
                        purchasable = {this.props.purchasable} />
                </div>
                <Modal isOpen={this.state.modalOpen}>
                    <ModalHeader>Your order summary</ModalHeader>
                    <ModalBody>
                        <h5>Price:<strong>{this.props.totalPrice.toFixed(0)}</strong> BDT</h5>
                        <Summary ingredients={this.props.ingredients} />
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{backgroundColor: "#D70F64"}} onClick={this.handleCheckout}>Continue to checkout</Button>
                        <Button className="btn-secondary" onClick={this.toogleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>            
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);