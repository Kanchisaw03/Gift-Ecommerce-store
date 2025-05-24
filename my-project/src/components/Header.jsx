import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

export default function Header() {
  const { cartItems, setShowCart } = useCart();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">Giftly</Link>
        <div className="flex gap-4 items-center">
          <button onClick={() => setShowCart(true)} className="relative">
            🛍️
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
