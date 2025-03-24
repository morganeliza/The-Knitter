import React, { useState } from "react";

const QuantityButton = () => {
  const [quantity, setQuantity] = useState(1); // Initial quantity set to 1

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1); // Increment quantity by 1
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prevQuantity => prevQuantity - 1); // Prevent negative values
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value); // Only update if valid number and greater than 0
    }
  };

  return (
    <div className="quantity-container">
      <button onClick={handleDecrement} className="quantity-btn">-</button>
      <input 
        type="number" 
        value={quantity} 
        onChange={handleChange} 
        className="quantity-input" 
        min="1" 
      />
      <button onClick={handleIncrement} className="quantity-btn">+</button>
    </div>
  );
};

export default QuantityButton;