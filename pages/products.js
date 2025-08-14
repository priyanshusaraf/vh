import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, Phone, Mail, MapPin, Menu, X, Grid, Tag, Heart } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { products, categories, priceRanges, searchProducts } from '../data/products';

const ProductCard = ({ product }) => {
  const [isHearted, setIsHearted] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isBestSeller && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Best Seller
            </span>
          )}
          {product.isPremium && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Premium
            </span>
          )}
          {product.isPopular && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Popular
            </span>
          )}
        </div>
        <button 
          onClick={() => setIsHearted(!isHearted)}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isHearted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>

      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="text-xs text-gray-500">{product.material}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 font-medium">{product.rating}</span>
            <span className="ml-2 text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">{product.size}</div>
        </div>

        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="text-xs bg-burgundy-50 text-burgundy-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="text-xs text-gray-500">+{product.features.length - 2} more</span>
            )}
          </div>
        )}

        <div>
          <button 
            onClick={() => {
              const helpSection = document.getElementById('help-section');
              if (helpSection) {
                helpSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full bg-burgundy-800 text-white py-3 px-4 rounded-lg hover:bg-burgundy-900 transition-colors font-medium"
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Use imported products data
  const allProducts = useMemo(() => products, []);

  // Handle URL search parameters
  useEffect(() => {
    if (router.query.search) {
      setSearchTerm(router.query.search);
    }
    if (router.query.category) {
      setFilterCategory(router.query.category);
    }
    if (router.query.price) {
      setPriceRange(router.query.price);
    }
  }, [router.query]);

  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const range = priceRanges.find(r => r.id === priceRange);
      if (range) {
        filtered = filtered.filter(product => 
          product.price >= range.min && product.price <= range.max
        );
      }
    }

    // Enhanced search with tags and multiple fields
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.subcategory.toLowerCase().includes(searchLower) ||
        product.size.toLowerCase().includes(searchLower) ||
        product.material.toLowerCase().includes(searchLower) ||
        product.features.some(feature => feature.toLowerCase().includes(searchLower))
      );
    }

    // Enhanced sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          // Sort by bestseller, popular, then reviews
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.reviews - a.reviews;
        case 'newest':
          // Assuming newer products have higher IDs or we can add a created date
          return a.id < b.id ? 1 : -1;
        case 'size':
          // Parse size values for proper sorting
          const getSizeValue = (size) => {
            const match = size.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          return getSizeValue(a.size) - getSizeValue(b.size);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, sortBy, filterCategory, priceRange, allProducts]);

  return (
    <>
      <Head>
        <title>Premium Kitchen Containers & Food Storage Solutions | Visto Homeware</title>
        <meta name="description" content="Shop premium kitchen containers, airtight food storage solutions, tiffin boxes & household products. BPA-free containers for modern kitchens. Free shipping across India." />
        <meta name="keywords" content="kitchen containers, food storage containers, airtight containers, tiffin boxes, lunch boxes, BPA free containers, plastic containers, kitchen storage, household products, kitchenware, Feel Fresh containers, water bottles, storage solutions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/vh-logo.png" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Premium Kitchen Containers & Food Storage Solutions | Visto Homeware" />
        <meta property="og:description" content="Shop premium kitchen containers, airtight food storage solutions, tiffin boxes & household products. BPA-free containers for modern kitchens." />
        <meta property="og:image" content="/vh-logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistohomeware.com/products" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Kitchen Containers & Food Storage Solutions" />
        <meta name="twitter:description" content="Shop premium kitchen containers, airtight food storage solutions, tiffin boxes & household products." />
        <meta name="twitter:image" content="/vh-logo.png" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Visto Homeware" />
        <link rel="canonical" href="https://vistohomeware.com/products" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Visto Homeware Products",
            "description": "Premium kitchen containers, food storage solutions, and household products",
            "url": "https://vistohomeware.com/products",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": products.length,
              "itemListElement": products.slice(0, 12).map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.name,
                "description": product.description,
                "image": product.img,
                "brand": {
                  "@type": "Brand",
                  "name": "Visto Homeware"
                },
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": product.rating,
                  "reviewCount": product.reviews
                }
              }))
            }
          })}
        </script>
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="h-10 w-auto">
                  <Image
                    src="/vh-logo.png"
                    alt="Visto Homeware"
                    width={120}
                    height={40}
                    className="h-10 w-auto object-contain"
                    priority
                  />
                </div>
                <span className="text-xl font-bold text-burgundy-800 hidden sm:block">Visto Homeware</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-burgundy-800 px-3 py-2 text-sm font-medium">
                  Products
                </Link>
                <Link href="/gallery" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  Gallery
                </Link>
                <Link href="/#about" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-burgundy-800 p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md border-t border-white/20">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="block px-3 py-2 text-burgundy-800 transition-colors">
                  Products
                </Link>
                <Link href="/gallery" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  Gallery
                </Link>
                <Link href="/#about" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-burgundy-50 to-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-burgundy-800">Product Collection</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of premium homeware products designed to elevate your living space
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search containers, tiffin boxes, kitchen storage, water bottles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors text-lg"
              />
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors md:hidden"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <Link 
                href="/gallery"
                className="flex items-center gap-2 px-4 py-3 bg-burgundy-800 text-white rounded-xl hover:bg-burgundy-900 transition-colors"
              >
                <Grid className="w-4 h-4" />
                Gallery View
              </Link>
            </div>
          </div>

          {/* Filters Row */}
          <div className={`${showFilters ? 'block' : 'hidden md:block'} transition-all duration-300`}>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Prices</option>
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="popularity">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="size">By Size</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || filterCategory !== 'all' || priceRange !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setPriceRange('all');
                    setSortBy('name');
                  }}
                  className="text-burgundy-800 hover:text-burgundy-900 font-medium text-sm underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredProducts.length} of {allProducts.length} products
              {searchTerm && ` for "${searchTerm}"`}
            </span>
            
            {/* Quick Filter Tags */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-gray-500">Quick filters:</span>
              {['containers', 'tiffin', 'storage', 'water bottles'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="text-xs bg-gray-100 hover:bg-burgundy-100 text-gray-700 hover:text-burgundy-800 px-2 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
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
                className="mt-4 text-burgundy-800 hover:text-burgundy-900 font-medium"
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
      <section id="help-section" className="py-16 bg-white">
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
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Phone className="w-10 h-10 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Call Us</h3>
              <p className="text-gray-600 mb-2">Mon-Fri 9AM-6PM</p>
              <a href="tel:+918336900588" className="text-burgundy-800 font-semibold hover:underline text-lg">
                +91 83369 00588
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <Mail className="w-10 h-10 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Email Us</h3>
              <p className="text-gray-600 mb-2">Quick response guaranteed</p>
              <a href="mailto:smplastics@gmail.com" className="text-burgundy-800 font-semibold hover:underline">
                smplastics@gmail.com
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <MapPin className="w-10 h-10 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Visit Us</h3>
              <p className="text-gray-600 mb-2">Our showroom location</p>
              <p className="text-burgundy-800 font-semibold text-center leading-relaxed">
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
                    src="/vh-logo.png"
                    alt="Visto Homeware"
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain brightness-0 invert"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">Visto Homeware</h3>
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
                <li>smplastics@gmail.com</li>
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