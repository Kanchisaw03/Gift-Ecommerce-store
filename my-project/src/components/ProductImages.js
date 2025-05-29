// Import all product images directly
import valentinoPerfume from '../assets/Valentino born in Rome perfume.jpeg';
import birthdaySet from '../assets/download (19).jpeg';
import deskGifts from '../assets/Lab-Grown Diamonds _ Jared.jpeg';
import spaBasket from '../assets/download (21).jpeg';
import chocolateCollection from '../assets/choco.jpeg';
import photoFrame from '../assets/download (22).jpeg';
import wineSet from '../assets/download (23).jpeg';
import candleCollection from '../assets/download (24).jpeg';
import leatherJournal from '../assets/watch.jpeg';
import plantBox from '../assets/smart garden.jpeg';
import winterSet from '../assets/Kit Minimal ALL Black.jpeg';

// Create a mapping of product IDs to their imported images
const productImages = {
  '1': valentinoPerfume,
  '2': birthdaySet,
  '3': deskGifts,
  '4': spaBasket,
  '5': chocolateCollection,
  '6': photoFrame,
  '7': wineSet,
  '8': candleCollection,
  '9': leatherJournal,
  '10': plantBox,
  '11': winterSet,
  // Add more mappings as needed
};

// Function to get image by product ID
export const getProductImageById = (productId) => {
  return productImages[productId] || leatherJournal; // Default to leather journal if ID not found
};

// Export individual images for direct use
export {
  valentinoPerfume,
  birthdaySet,
  deskGifts,
  spaBasket,
  chocolateCollection,
  photoFrame,
  wineSet,
  candleCollection,
  leatherJournal,
  plantBox,
  winterSet
};

export default productImages;
