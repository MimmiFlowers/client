import { useCart } from '../../contexts/CartContext';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

interface Props {
  onClose: () => void;
}

export const CartDropdown: React.FC<Props> = ({ onClose }) => {
    const { items, increase, decrease, removeItem } = useCart();
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const path = event.composedPath();
            if (ref.current && !path.includes(ref.current)) {
                setTimeout(() => {
                    onClose();
                }, 200);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div
            ref={ref}
            className="absolute top-14 right-4 w-80 bg-white border shadow-xl z-50 rounded-lg p-4"
        >
            <h3 className="text-lg font-semibold mb-2">Your Cart</h3>

            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-gray-500 text-center">Cart is empty</p>
                ) : (
                    items.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-2"
                        >
                            <img
                                src={item.picture}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 px-2">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-gray-600">{item.price} kr / шт</p>
                                <div className="flex items-center mt-1 gap-2">
                                    <button onClick={() => decrease(item.id)} className="px-2">−</button>
                                        <span>{item.quantity}</span>
                                    <button onClick={() => increase(item.id)} className="px-2">+</button>
                                </div>
                            </div>
                            <div className="text-sm text-right">
                                <p>{item.price * item.quantity} kr</p>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm mt-1">
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{total} kr</span>
                </div>
                <button
                    className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                    onClick={() => navigate('/checkout')}
                >
                    Checkout
                </button>
                </>
            )}
        </div>
    );
};