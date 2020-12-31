import React from 'react';

const FormButton = (props) => {
    const {name, disable, hide, goalMet, isLoading, displayText, styling, handleClick} = props;

    return (
        <button 
        name={name} 
        className={`FormButton container__row justify-content ${disable ? 'disable' : ''} ${styling} ${hide ? "hidden" : ""} ${goalMet ? 'disabled bg-success border-success' : ''} ${isLoading ? 'disabled bg-primary border-blue' : ''}`}
        onClick={(event) => handleClick(event.target.name)}>
            <p className={isLoading || goalMet ? "ButtonText hidden" : " ButtonText container__col-24 disabled"}>{displayText}</p>
        </button>
    );
};
  
export default FormButton;