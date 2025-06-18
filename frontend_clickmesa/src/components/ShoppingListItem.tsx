
// components/ShoppingListItem.tsx
"use client";

import { useEffect, useCallback, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function ShoppingListItem({
  name,
  quantity,
  initialPurchased,
  onToggle,
  onDelete
}: {
  name: string;
  quantity: string;
  initialPurchased: boolean;
  onToggle: (purchased: boolean) => void;
  onDelete: () => void;
}) {
  const [purchased, setPurchased] = useState(initialPurchased);

  useEffect(() => {
    setPurchased(initialPurchased);
  }, [initialPurchased]);

  const handleToggle = useCallback(() => {
    const newValue = !purchased;
    setPurchased(newValue);
    onToggle(newValue);
  }, [purchased, onToggle]);

  return (
    <li className={`flex items-center justify-between p-3 rounded-lg ${purchased ? 'bg-green-50' : 'bg-gray-50'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={purchased}
          onChange={handleToggle}
          className="h-5 w-5 text-orange-500 rounded mr-3"
        />
        <span className={`${purchased ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {name} - {quantity}
        </span>
      </div>
      <button 
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500"
      >
        <FaTrash />
      </button>
    </li>
  );
}