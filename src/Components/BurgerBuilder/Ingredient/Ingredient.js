import React from 'react';
import './Ingredient.css';
import BreadTop from '../../../assets/images/top.png';
import BreadBottom from '../../../assets/images/bottom.png';
import Meat from '../../../assets/images/meat.png';
import Salad from '../../../assets/images/salad.png';
import Cheese from '../../../assets/images/cheese.png';

const Ingredient = props => {
    let ingredient = null;
    switch(props.type) {
        case 'bread-bottom':
            ingredient = <div><img src={BreadBottom} alt="bottom-bread"/></div>
            break;
        case 'bread-top':
            ingredient = <div><img src={BreadTop} alt="bottom-bread"/></div>
            break;
        case 'meat':
            ingredient = <div><img src={Meat} alt="bottom-meat"/></div>
            break;
        case 'salad':
            ingredient = <div><img src={Salad} alt="bottom-salad"/></div>
            break;
        case 'cheese':
            ingredient = <div><img src={Cheese} alt="bottom-cheese"/></div>
            break;
        default:
            ingredient = null;
    }
    return (
        <div className="Ingredients">
            {ingredient}
        </div>
    )
}

export default Ingredient;