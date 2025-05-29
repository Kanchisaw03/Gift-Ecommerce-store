const products = [
  {
    id: '1',
    name: 'Romantic Gift Box',
    category: 'Love',
    image: '/assets/Valentino born in Rome perfume.jpeg',
    images: [
      '/assets/Valentino born in Rome perfume.jpeg',
      '/assets/download (19).jpeg',
      '/assets/choco.jpeg'
    ],
    price: 49.99,
    description: 'A curated box with chocolates, candles, and a message card. Perfect for anniversaries, Valentine\'s Day, or just to show your love. Each box contains premium Belgian chocolates, hand-poured scented candles, and a personalized message card.',
    tags: ['romantic', 'anniversary', 'valentine'],
    rating: 4.8,
    stock: 15,
    featured: true
  },
  {
    id: '2',
    name: 'Birthday Surprise Set',
    category: 'Birthday',
    image: '/assets/download (19).jpeg',
    images: [
      '/assets/download (19).jpeg',
      '/assets/download (21).jpeg',
      '/assets/download (22).jpeg'
    ],
    price: 39.99,
    description: 'Surprise your loved ones with this vibrant gift set. Contains a selection of birthday-themed items including a small cake, decorative items, and a greeting card. Perfect for sending to someone special on their special day.',
    tags: ['birthday', 'celebration', 'surprise'],
    rating: 4.6,
    stock: 20,
    featured: true
  },
  {
    id: '3',
    name: 'Minimalist Desk Gifts',
    category: 'Office',
    image: '/assets/Lab-Grown Diamonds _ Jared.jpeg',
    images: [
      '/assets/Lab-Grown Diamonds _ Jared.jpeg',
      '/assets/watch.jpeg',
      '/assets/smart garden.jpeg'
    ],
    price: 29.99,
    description: 'Modern gifts to elevate your work desk aesthetics. This set includes a sleek pen holder, a small succulent plant, and a designer notepad. Perfect for office workers, remote employees, or anyone who appreciates clean design.',
    tags: ['office', 'minimalist', 'professional'],
    rating: 4.5,
    stock: 25,
    featured: false
  },
  {
    id: '4',
    name: 'Luxury Spa Gift Basket',
    category: 'Wellness',
    image: '/assets/download (21).jpeg',
    price: 59.99,
    description: 'A premium collection of spa essentials including bath bombs, essential oils, face masks, and a plush towel. Give the gift of relaxation and self-care with this luxurious spa basket.',
    tags: ['spa', 'relaxation', 'self-care'],
    rating: 4.9,
    stock: 10,
    featured: true
  },
  {
    id: '5',
    name: 'Gourmet Chocolate Collection',
    category: 'Food',
    image: '/assets/choco.jpeg',
    price: 34.99,
    description: 'An exquisite selection of handcrafted chocolates from around the world. This collection features dark, milk, and white chocolates with various fillings including caramel, fruit, and nuts.',
    tags: ['chocolate', 'gourmet', 'food'],
    rating: 4.7,
    stock: 30,
    featured: true
  },
  {
    id: '6',
    name: 'Personalized Photo Frame',
    category: 'Personalized',
    image: '/assets/download (22).jpeg',
    price: 24.99,
    description: 'A beautiful wooden frame that can be personalized with names, dates, or a short message. Perfect for preserving special memories and moments.',
    tags: ['personalized', 'home decor', 'memories'],
    rating: 4.4,
    stock: 40,
    featured: false
  },
  {
    id: '7',
    name: 'Premium Wine Gift Set',
    category: 'Drinks',
    image: '/assets/download (23).jpeg',
    price: 79.99,
    description: 'A sophisticated gift set featuring a bottle of premium red wine, two crystal wine glasses, and gourmet cheese pairings. Perfect for wine enthusiasts and special celebrations.',
    tags: ['wine', 'luxury', 'gourmet'],
    rating: 4.8,
    stock: 12,
    featured: true
  },
  {
    id: '8',
    name: 'Artisanal Candle Collection',
    category: 'Home',
    image: '/assets/download (24).jpeg',
    price: 42.99,
    description: 'A set of three hand-poured, artisanal scented candles in elegant glass containers. Scents include lavender vanilla, sea breeze, and cinnamon apple.',
    tags: ['candles', 'home', 'relaxation'],
    rating: 4.6,
    stock: 18,
    featured: false
  },
  {
    id: '9',
    name: 'Luxury Leather Journal',
    category: 'Stationery',
    image: '/assets/watch.jpeg',
    price: 32.99,
    description: 'A handcrafted leather journal with premium paper pages. Perfect for writers, travelers, or anyone who appreciates the art of putting pen to paper.',
    tags: ['journal', 'leather', 'writing'],
    rating: 4.5,
    stock: 22,
    featured: false
  },
  {
    id: '10',
    name: 'Plant Lover Gift Box',
    category: 'Plants',
    image: '/assets/smart garden.jpeg',
    price: 44.99,
    description: 'A curated box for plant enthusiasts containing a small potted succulent, plant care tools, and organic plant food. Perfect for both beginners and experienced plant parents.',
    tags: ['plants', 'gardening', 'eco-friendly'],
    rating: 4.7,
    stock: 15,
    featured: true
  },
  {
    id: '11',
    name: 'Cozy Winter Gift Set',
    category: 'Seasonal',
    image: '/assets/Kit Minimal ALL Black.jpeg',
    price: 49.99,
    description: 'A warm and cozy gift set featuring a soft throw blanket, hot chocolate mix, and fuzzy socks. Perfect for staying warm during the cold winter months.',
    tags: ['winter', 'cozy', 'comfort'],
    rating: 4.8,
    stock: 20,
    featured: false
  },
  {
    id: '12',
    name: 'Deluxe Tea Sampler',
    category: 'Drinks',
    image: '/assets/tea-gift-box.jpeg',
    price: 36.99,
    description: 'An elegant collection of premium loose-leaf teas from around the world, accompanied by a tea infuser and honey sticks. Perfect for tea enthusiasts.',
    tags: ['tea', 'gourmet', 'relaxation'],
    rating: 4.6,
    stock: 25,
    featured: false
  },
  {
    id: '13',
    name: 'Limited Edition Book',
    category: 'Books',
    image: '/assets/limited-edition-book.jpeg',
    price: 89.99,
    description: 'A beautifully crafted limited edition book with custom rebinding, cloth hardcover, and exquisite foil details. Includes a matching bookmark. A perfect gift for book collectors and literature enthusiasts.',
    tags: ['books', 'limited edition', 'collector'],
    rating: 4.9,
    stock: 5,
    featured: true
  }
];

// Categories for filtering
export const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'Love', name: 'Love & Romance' },
  { id: 'Birthday', name: 'Birthday' },
  { id: 'Office', name: 'Office' },
  { id: 'Wellness', name: 'Wellness & Spa' },
  { id: 'Food', name: 'Gourmet Food' },
  { id: 'Personalized', name: 'Personalized' },
  { id: 'Drinks', name: 'Drinks & Beverages' },
  { id: 'Home', name: 'Home & Decor' },
  { id: 'Stationery', name: 'Stationery' },
  { id: 'Plants', name: 'Plants & Garden' },
  { id: 'Seasonal', name: 'Seasonal' },
  { id: 'Books', name: 'Books & Literature' }
];

// Price ranges for filtering
export const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under25', name: 'Under $25', min: 0, max: 25 },
  { id: '25to50', name: '$25 to $50', min: 25, max: 50 },
  { id: '50to75', name: '$50 to $75', min: 50, max: 75 },
  { id: 'over75', name: 'Over $75', min: 75, max: Infinity }
];

export default products;
