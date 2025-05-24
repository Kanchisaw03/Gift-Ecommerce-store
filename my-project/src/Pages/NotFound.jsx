import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-pink-600">404</h1>
      <p className="text-xl mt-4 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="text-white bg-pink-500 px-6 py-2 rounded hover:bg-pink-600"
      >
        Go Back Home
      </Link>
    </div>
  );
}
