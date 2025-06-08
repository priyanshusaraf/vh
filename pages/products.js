import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-purple-100/30 group-hover:scale-110 transition-transform duration-500"></div>
        <span className="text-gray-400 font-medium relative z-10">Product Image</span>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 truncate text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{product.description}</p>
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600 font-medium">{product.rating}</span>
          <span className="ml-2 text-sm text-gray-400">({product.reviews} reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-purple-600 font-bold text-xl">₹{product.price.toLocaleString()}</div>
          <div className="text-sm text-gray-500 font-medium">Size: {product.size}</div>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Sample product data - wrapped in useMemo to prevent re-creation
  const allProducts = useMemo(() => [
    {
      id: 1,
      name: "Ceramic Dinner Set",
      description: "Elegant 12-piece ceramic dinner set perfect for family meals",
      price: 2999,
      rating: 4.8,
      reviews: 124,
      category: "dining",
      size: "Large"
    },
    {
      id: 2,
      name: "Crystal Wine Glasses",
      description: "Premium crystal wine glasses for special occasions",
      price: 899,
      rating: 4.9,
      reviews: 87,
      category: "dining",
      size: "Medium"
    },
    {
      id: 3,
      name: "Wooden Cutting Board",
      description: "Durable bamboo cutting board with juice groove",
      price: 450,
      rating: 4.7,
      reviews: 203,
      category: "kitchen",
      size: "Large"
    },
    {
      id: 4,
      name: "Stainless Steel Cookware",
      description: "Professional-grade stainless steel cookware set",
      price: 1999,
      rating: 4.8,
      reviews: 156,
      category: "kitchen",
      size: "Large"
    },
    {
      id: 5,
      name: "Bamboo Kitchen Utensils",
      description: "Eco-friendly bamboo kitchen utensil set",
      price: 350,
      rating: 4.6,
      reviews: 98,
      category: "kitchen",
      size: "Small"
    },
    {
      id: 6,
      name: "Glass Storage Containers",
      description: "Airtight glass storage containers with bamboo lids",
      price: 670,
      rating: 4.7,
      reviews: 145,
      category: "storage",
      size: "Medium"
    },
    {
      id: 7,
      name: "Ceramic Coffee Mugs",
      description: "Set of 4 handcrafted ceramic coffee mugs",
      price: 280,
      rating: 4.5,
      reviews: 76,
      category: "dining",
      size: "Small"
    },
    {
      id: 8,
      name: "Acacia Wood Salad Bowl",
      description: "Large acacia wood salad bowl with serving utensils",
      price: 550,
      rating: 4.6,
      reviews: 89,
      category: "dining",
      size: "Large"
    },
    {
      id: 9,
      name: "Stainless Steel Canisters",
      description: "Set of 3 airtight stainless steel storage canisters",
      price: 790,
      rating: 4.8,
      reviews: 112,
      category: "storage",
      size: "Medium"
    },
    {
      id: 10,
      name: "Silicone Baking Mats",
      description: "Non-stick silicone baking mats, set of 2",
      price: 240,
      rating: 4.4,
      reviews: 67,
      category: "kitchen",
      size: "Large"
    },
    {
      id: 11,
      name: "Marble Serving Tray",
      description: "Elegant marble serving tray with gold handles",
      price: 850,
      rating: 4.9,
      reviews: 43,
      category: "dining",
      size: "Medium"
    },
    {
      id: 12,
      name: "Copper Moscow Mule Mugs",
      description: "Authentic copper Moscow mule mugs, set of 4",
      price: 720,
      rating: 4.7,
      reviews: 91,
      category: "dining",
      size: "Small"
    }
  ], []);

  // Handle URL search parameters
  useEffect(() => {
    if (router.query.search) {
      setSearchTerm(router.query.search);
    }
    if (router.query.category) {
      setFilterCategory(router.query.category);
    }
  }, [router.query]);

  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'size':
          const sizeOrder = { 'Small': 1, 'Medium': 2, 'Large': 3 };
          return sizeOrder[a.size] - sizeOrder[b.size];
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, sortBy, filterCategory, allProducts]);

  return (
    <>
      <Head>
        <title>Products - Visto Homeware</title>
        <meta name="description" content="Browse our complete collection of premium homeware products. Kitchen essentials, elegant dinnerware, and stylish home accessories." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/vh-logo.jpeg" />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-10 w-auto">
                  <Image
                    src="/vh-logo.jpeg"
                    alt="Visto Homeware"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                    priority
                  />
                </div>
                <span className="text-xl font-bold text-purple-600 hidden sm:block">Visto Homeware</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-purple-600 px-3 py-2 text-sm font-medium">
                  Products
                </Link>
                <Link href="/#about" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md border-t border-white/20">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="block px-3 py-2 text-purple-600 transition-colors">
                  Products
                </Link>
                <Link href="/#about" className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-purple-600">Product Collection</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of premium homeware products designed to elevate your living space
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="dining">Dining</option>
                  <option value="storage">Storage</option>
                </select>
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} products
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setSortBy('name');
                }}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-gray-600">
              Our experts are here to help you find the perfect products for your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Phone className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Call Us</h3>
              <p className="text-gray-600 mb-2">Mon-Fri 9AM-6PM</p>
              <a href="tel:+918336900588" className="text-purple-600 font-semibold hover:underline text-lg">
                +91 83369 00588
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Mail className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Email Us</h3>
              <p className="text-gray-600 mb-2">Quick response guaranteed</p>
              <a href="mailto:srnplastics@gmail.com" className="text-purple-600 font-semibold hover:underline">
                srnplastics@gmail.com
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <MapPin className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Visit Us</h3>
              <p className="text-gray-600 mb-2">Our showroom location</p>
              <p className="text-purple-600 font-semibold text-center leading-relaxed">
                1/2, Chanditala Branch Road<br />
                Kolkata, PIN-700053<br />
                West Bengal, India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-auto">
                  <Image
                    src="/vh-logo.jpeg"
                    alt="Visto Homeware"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Visto Homeware</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Premium homeware products for modern living. Quality you can trust.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Kitchen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dining</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Storage</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Decor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+91 83369 00588</li>
                <li>srnplastics@gmail.com</li>
                <li>1/2, Chanditala Branch Road<br />Kolkata, PIN-700053, W.B.<br />
                <span className="text-sm text-gray-500">GSTIN: 19AEXPA3954Q1ZJ</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Visto Homeware. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
} 