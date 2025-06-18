
import {useCart} from '@/hooks/useCart';
import { FaShoppingCart } from 'react-icons/fa';

export const CartIcon = () => {
    const {items} = useCart();
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="relative">
            <button onClick={() => console.log('Abrir sidebar')}>
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                </span>
                )}
            </button>
        </div>
    );
};