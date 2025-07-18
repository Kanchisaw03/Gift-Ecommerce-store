import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This component ensures that the page scrolls to the top when navigating between routes
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
