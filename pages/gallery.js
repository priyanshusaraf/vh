import { useState, useEffect } from 'react';
import { Search, Filter, Menu, X, Grid, List } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Masonry from '../components/Masonry';
import { products } from '../data/products';

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('masonry');
  const [filteredItems, setFilteredItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Convert products to masonry items format
  const convertToMasonryItems = (productList) => {
    return productList.map((product, index) => ({
      id: product.id,
      img: product.img,
      url: `/products?search=${encodeURIComponent(product.name)}`,
      height: 300 + (index % 4) * 120, // Vary heights for masonry effect
      name: product.name,
      size: product.size,
    }));
  };

  // Combined filter and initial load effect
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    let filtered = [...products];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredItems(convertToMasonryItems(filtered));
  }, [searchTerm, filterCategory, products]);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'containers', name: 'Food Containers' },
    { id: 'container-sets', name: 'Container Sets' },
    { id: 'specialty', name: 'Specialty Items' }
  ];

  return (
    <>
      <Head>
        <title>Product Gallery - Visto Homeware | Premium Kitchen Containers & Storage Solutions</title>
        <meta name="description" content="Explore our complete visual gallery of premium kitchen containers, food storage solutions, tiffin boxes, and homeware products. High-quality airtight containers for modern kitchens." />
        <meta name="keywords" content="kitchen containers gallery, food storage containers, tiffin boxes, airtight containers, kitchen storage solutions, homeware gallery, premium containers, BPA free containers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/vh-logo.png" />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Product Gallery - Visto Homeware | Premium Kitchen Storage Solutions" />
        <meta property="og:description" content="Explore our complete visual gallery of premium kitchen containers and food storage solutions. High-quality airtight containers for modern kitchens." />
        <meta property="og:image" content="/vh-logo.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Product Gallery - Visto Homeware" />
        <meta name="twitter:description" content="Premium kitchen containers and food storage solutions gallery" />
        <meta name="twitter:image" content="/vh-logo.png" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Visto Homeware" />
        <link rel="canonical" href="https://vistohomeware.com/gallery" />
        
        {/* Structured Data for Products */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Visto Homeware Product Gallery",
            "description": "Complete gallery of premium kitchen containers and food storage solutions",
            "url": "https://vistohomeware.com/gallery",
            "numberOfItems": products.length,
            "itemListElement": products.slice(0, 10).map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "description": product.description,
              "image": product.img,
              "availability": "https://schema.org/InStock"
            }))
          })}
        </script>
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-white/20">
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
                <Link href="/products" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  Products
                </Link>
                <Link href="/gallery" className="text-burgundy-800 px-3 py-2 text-sm font-medium">
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
                <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  Products
                </Link>
                <Link href="/gallery" className="block px-3 py-2 text-burgundy-800 transition-colors">
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
              Product <span className="text-burgundy-800">Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore our complete collection of premium kitchen containers, food storage solutions, 
              tiffin boxes, and homeware products in this interactive visual gallery
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">Kitchen Containers</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">Food Storage</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">Tiffin Boxes</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">Airtight Containers</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">BPA Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 bg-white border-b sticky top-16 z-40">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 items-center">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded ${viewMode === 'masonry' ? 'bg-white shadow-sm text-burgundy-800' : 'text-gray-600'}`}
                  title="Masonry View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-burgundy-800' : 'text-gray-600'}`}
                  title="Grid View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredItems.length} of {products.length} products
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                }}
                className="text-burgundy-800 hover:text-burgundy-900 font-medium underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'masonry' ? (
                <div className="min-h-screen">
                  <Masonry
                    items={filteredItems}
                    ease="power3.out"
                    duration={0.6}
                    stagger={0.05}
                    animateFrom="bottom"
                    scaleOnHover={true}
                    hoverScale={1.05}
                    blurToFocus={true}
                    colorShiftOnHover={false}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center justify-center">
                          <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                        </div>
                        <Link 
                          href={item.url}
                          className="mt-3 block w-full bg-burgundy-800 text-white py-2 px-4 rounded-lg text-center hover:bg-burgundy-900 transition-colors font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Choosing the Right Container?
          </h2>
          <p className="text-xl text-burgundy-100 mb-8 max-w-2xl mx-auto">
            Our experts are here to help you find the perfect storage solutions for your kitchen and home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-white text-burgundy-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </Link>
            <Link 
              href="/#contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-burgundy-800 transition-colors"
            >
              Contact Us
            </Link>
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
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products?category=containers" className="hover:text-white transition-colors">Kitchen Containers</Link></li>
                <li><Link href="/products?category=container-sets" className="hover:text-white transition-colors">Container Sets</Link></li>
                <li><Link href="/products?search=tiffin" className="hover:text-white transition-colors">Tiffin Boxes</Link></li>
                <li><Link href="/products?search=storage" className="hover:text-white transition-colors">Storage Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+91 98301 61908</li>
                <li>+91 98310 33736</li>
                <li>smplastics@gmail.com</li>
                <li>1/2, Chanditala Branch Road<br />Kolkata, PIN-700053, W.B.</li>
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
};

export default Gallery;
