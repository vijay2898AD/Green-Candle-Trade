import { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface Stock {
  symbol: string;
  price: number;
  name: string;
}

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  onConfirm: (symbol: string, quantity: number, price: number) => void;
}

export const TradeModal = ({ isOpen, onClose, stock, onConfirm }: TradeModalProps) => {
  const [quantity, setQuantity] = useState('');

  // Reset quantity when modal opens for a new stock
  useEffect(() => {
    if (isOpen) {
      setQuantity('');
    }
  }, [isOpen]);

  if (!stock) {
    return null;
  }

  const handleConfirm = () => {
    const numQuantity = parseInt(quantity, 10);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      onConfirm(stock.symbol, numQuantity, stock.price);
      onClose(); // Close modal after confirming
    } else {
      alert('Please enter a valid, positive quantity.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-2xl font-bold mb-2 text-green-400">Buy Stock</h2>
        <div className="mb-4 border-b border-gray-700 pb-4">
          <p className="text-xl font-semibold">{stock.symbol}</p>
          <p className="text-gray-400">{stock.name}</p>
          <p className="mt-2 text-lg">Current Price: <span className="font-bold text-green-400">₹{stock.price.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span></p>
        </div>

        <div className="mb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 10"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </Modal>
  );
};