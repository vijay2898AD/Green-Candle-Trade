// src/components/CashModal.tsx

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { usePortfolioStore } from '../store/portfolioStore';

interface CashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashModal = ({ isOpen, onClose }: CashModalProps) => {
  const [amount, setAmount] = useState('');
  const { addCash, withdrawCash, cash } = usePortfolioStore();

  // Reset amount when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleTransaction = (type: 'ADD' | 'WITHDRAW') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid, positive amount.');
      return;
    }

    let result;
    if (type === 'ADD') {
      result = addCash(numAmount);
    } else {
      result = withdrawCash(numAmount);
    }

    alert(result.message); // Show success/error
    
    if (result.success) {
      onClose(); // Close modal on success
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Manage Cash</h2>
        <div className="mb-4 border-b border-gray-700 pb-4">
          <p className="text-lg">Current Balance: <span className="font-bold text-green-400">₹{(cash || 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span></p>
        </div>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 50000"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-all duration-150 hover:shadow-md hover:-translate-y-px"
          >
            Cancel
          </button>
          <button
            onClick={() => handleTransaction('WITHDRAW')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-150 hover:shadow-md hover:-translate-y-px"
          >
            Withdraw
          </button>
          <button
            onClick={() => handleTransaction('ADD')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-150 hover:shadow-md hover:-translate-y-px"
          >
            Add Cash
          </button>
        </div>
      </div>
    </Modal>
  );
};