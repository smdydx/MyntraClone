import React from 'react';

interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[]; // Replace 'any' with the actual type of your cart items
}

const CartSlideout: React.FC<CartSlideoutProps> = ({ isOpen, onClose, cartItems = [] }) => {
  // Ensure cartItems is always an array
  const safeCartItems = cartItems || [];
  
  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-md transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          Close
        </button>

        {safeCartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {safeCartItems.map((item, index) => (
              <li key={index} className="mb-2">
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CartSlideout;
