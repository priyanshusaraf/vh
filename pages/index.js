import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, Mail, MapPin, Star, Search, Menu, X, Download } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Logo = ({ className = "h-10 w-auto" }) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/vh-logo.png"
        alt="Visto Homeware"
        width={120}
        height={40}
        className="object-contain"
        priority
      />
    </div>
  );
};

const CurvedSVG = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) {
      gsap.fromTo(pathRef.current, 
        { 
          strokeDasharray: 1000,
          strokeDashoffset: 1000 
        },
        { 
          strokeDashoffset: 0,
          duration: 3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: pathRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20" 
      viewBox="0 0 1200 800"
      fill="none"
    >
      <path
        ref={pathRef}
        d="M0,400 Q300,200 600,400 T1200,300"
        stroke="url(#gradient)"
        strokeWidth="2"
        fill="none"
        className="drop-shadow-sm"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#db2777" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const AnimatedCounter = ({ target, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${label}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [label, isVisible]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const increment = target / (duration / 50);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isVisible, target]);

  return (
    <div id={`counter-${label}`} className="text-center animate-slide-up">
      <div className="text-4xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-rose-200 font-medium">{label}</div>
    </div>
  );
};

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const carouselRef = useRef(null);
  
  const products = [
    {
      id: 1,
      name: "Feel Fresh Medium Container",
      image: "/FEEL FRESH MEDIUM 800ml.jpg",
      rating: 4.7,
      size: "800ml",
      description: "Versatile medium-sized container ideal for cereals, pasta, rice, and daily essentials."
    },
    {
      id: 2,
      name: "Feel Fresh 3-Piece Container Set",
      image: "/FEEL FRESH 3 Pcs.jpeg",
      rating: 4.9,
      size: "3 Pieces",
      description: "Complete storage solution featuring small, medium, and large containers."
    },
    {
      id: 3,
      name: "Feel Fresh Large Container",
      image: "/FEEL FRESH LARGE 1500ml.jpeg",
      rating: 4.9,
      size: "1500ml",
      description: "Premium large container with enhanced capacity for storing large quantities."
    },
    {
      id: 4,
      name: "Feel Fresh Square Big Container",
      image: "/FEEL FRESH SQUARE BIG 1000ml.jpeg",
      rating: 4.8,
      size: "1000ml",
      description: "Large square container with maximum storage efficiency for organized arrangement."
    },
    {
      id: 5,
      name: "Feel Fresh Small Container",
      image: "/FEEL FRESH SMALL 300ml.jpg",
      rating: 4.6,
      size: "300ml",
      description: "Compact airtight container perfect for snacks, nuts, and small portions."
    }
  ];

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
      setCurrentIndex(0);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex > maxIndex ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? maxIndex : nextIndex;
    });
  };

  const getTranslateX = () => {
    return (currentIndex * 100) / itemsPerView;
  };

  const getItemWidth = () => {
    return 100 / itemsPerView;
  };

  // Handle scroll snap for mobile reel-like experience
  const handleScroll = (e) => {
    if (window.innerWidth < 768) {
      const container = e.target;
      const itemWidth = container.scrollWidth / products.length;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="relative">
      {/* Mobile: Reel-like scroll experience */}
      <div className="md:hidden">
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
          onScroll={handleScroll}
        >
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-[85vw] mx-2 snap-center"
            >
                          <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 mx-auto group h-[70vh] flex flex-col">
              <div className="flex-1 relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-2 text-lg text-gray-600 font-semibold">{product.rating}</span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">{product.size}</div>
                </div>
                <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white py-3 px-6 rounded-xl text-center font-semibold hover:shadow-lg transition-all duration-300">
                  View Details
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
        
        {/* Mobile pagination dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (carouselRef.current) {
                  const container = carouselRef.current;
                  const itemWidth = container.scrollWidth / products.length;
                  container.scrollTo({
                    left: itemWidth * index,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-burgundy-800 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Original carousel experience */}
      <div className="hidden md:block">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${getTranslateX()}%)` }}
          >
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="flex-shrink-0 px-2 md:px-4"
                style={{ width: `${getItemWidth()}%` }}
              >
                              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 mx-auto max-w-sm group">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2 text-gray-800 min-h-[3rem]">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600 font-medium">{product.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">{product.size}</div>
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-2">{product.description}</p>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
        
        {products.length > itemsPerView && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-200 z-10 md:left-2 group"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-burgundy-800 transition-colors" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-3 hover:bg-white hover:scale-110 transition-all duration-200 z-10 md:right-2 group"
              aria-label="Next products"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-burgundy-800 transition-colors" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-burgundy-800 text-white p-2 rounded-lg hover:bg-burgundy-900 transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    // Simple hero animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(heroRef.current.querySelector('h1'), 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
      .fromTo(heroRef.current.querySelector('p'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5"
      );
    }

    // Floating animation for icons
    gsap.utils.toArray('.float-icon').forEach((icon, index) => {
      gsap.to(icon, {
        y: -10,
        duration: 2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 0.5
      });
    });

  }, []);

  return (
    <>
      <Head>
        <title>Visto Homeware - Premium Kitchen Containers, Tiffin Boxes & Food Storage Solutions</title>
        <meta name="description" content="India's leading brand for premium kitchen containers, airtight food storage, tiffin boxes, water bottles & household products. BPA-free, microwave safe containers. Free delivery across India." />
        <meta name="keywords" content="kitchen containers, food storage containers, tiffin boxes, lunch boxes, water bottles, airtight containers, BPA free containers, microwave safe containers, Feel Fresh containers, plastic containers, kitchen storage solutions, household products, kitchenware India, food containers online, storage boxes, meal prep containers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/vh-logo.png" />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content="Visto Homeware - Premium Kitchen Containers & Food Storage Solutions" />
        <meta property="og:description" content="India's leading brand for premium kitchen containers, airtight food storage, tiffin boxes & household products. BPA-free, microwave safe containers." />
        <meta property="og:image" content="/vh-logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistohomeware.com" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Visto Homeware - Premium Kitchen Containers & Food Storage Solutions" />
        <meta name="twitter:description" content="India's leading brand for premium kitchen containers, airtight food storage, tiffin boxes & household products." />
        <meta name="twitter:image" content="/vh-logo.png" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Visto Homeware" />
        <meta name="geo.region" content="IN-WB" />
        <meta name="geo.placename" content="Kolkata" />
        <meta name="geo.position" content="22.5726;88.3639" />
        <meta name="ICBM" content="22.5726, 88.3639" />
        <link rel="canonical" href="https://vistohomeware.com" />
        
        {/* Structured Data for Business */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Visto Homeware",
            "image": "/vh-logo.png",
            "description": "Premium kitchen containers, food storage solutions, tiffin boxes and household products manufacturer and retailer",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1/2, Chanditala Branch Road",
              "addressLocality": "Kolkata",
              "addressRegion": "West Bengal",
              "postalCode": "700053",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 22.5726,
              "longitude": 88.3639
            },
            "url": "https://vistohomeware.com",
            "telephone": "+91-98301-61908",
            "email": "smplastics@gmail.com",

            "openingHours": "Mo-Sa 09:00-18:00",
            "paymentAccepted": "Cash, Credit Card, Debit Card, UPI",
            "currenciesAccepted": "INR",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "makesOffer": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Kitchen Containers",
                  "description": "Airtight food storage containers for kitchen organization"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Product",
                  "name": "Tiffin Boxes",
                  "description": "Lunch boxes and tiffin containers for office and school"
                }
              }
            ]
          })}
        </script>

        {/* Product Category Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Feel Fresh Kitchen Container Collection",
            "image": "/FEEL FRESH MEDIUM 800ml.jpg",
            "description": "Premium airtight kitchen containers for food storage. BPA-free, microwave safe, and available in multiple sizes.",
            "brand": {
              "@type": "Brand", 
              "name": "Visto Homeware"
            },
            "manufacturer": {
              "@type": "Organization",
              "name": "Visto Homeware"
            },
            "category": "Kitchen Storage Containers",

            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "1250"
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
                <Link href="/products" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  Products
                </Link>
                <Link href="/gallery" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  Gallery
                </Link>
                <Link href="#about" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="#contact" className="text-gray-700 hover:text-burgundy-800 px-3 py-2 text-sm font-medium transition-colors">
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
                <Link href="/gallery" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  Gallery
                </Link>
                <Link href="#about" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  About
                </Link>
                <Link href="#contact" className="block px-3 py-2 text-gray-700 hover:text-burgundy-800 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-rose-50 via-white to-rose-25 py-20 lg:py-32 mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Home with 
              <span className="bg-gradient-to-r from-rose-400 to-burgundy-800 bg-clip-text text-transparent block">Premium Homeware</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collection of premium kitchen containers, airtight food storage solutions, 
              tiffin boxes, water bottles, and household products. BPA-free, microwave safe containers 
              that elevate your kitchen organization and everyday living experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <a 
                href="/product-catalogue.pdf" 
                download="Visto-Homeware-Catalogue.pdf"
                className="inline-flex items-center bg-burgundy-800 text-white px-8 py-4 hover:bg-burgundy-900 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Download className="mr-2 w-5 h-5" />
                Download Catalogue
              </a>
              <SearchBar />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">

 
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative py-20 lg:py-32 bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-2xl md:text-2xl lg:text-4xl font-bold text-white mb-8 relative">
                About Visto Homeware
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-300 to-burgundy-100 rounded-full"></div>
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-rose-100 max-w-5xl mx-auto leading-relaxed">
              We've been dedicated to bringing you the finest homeware products 
              that combine functionality with style. Our commitment to quality and customer satisfaction 
              has made us a trusted name in home essentials.
            </p>
          </div>

          {/* Stats Section with enhanced design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <AnimatedCounter target={50000} label="Units Sold" suffix="+" />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <AnimatedCounter target={500} label="Products" suffix="+" />
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <AnimatedCounter target={98} label="Satisfaction Rate" suffix="%" />
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards with enhanced design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-8 float-icon group-hover:bg-white/25 transition-all duration-300 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-300/30 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Star className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Premium Quality</h3>
              <p className="text-rose-100 leading-relaxed text-lg md:text-xl">
                Excellence in every product.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-8 float-icon group-hover:bg-white/25 transition-all duration-300 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-300/30 to-red-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Phone className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">Expert Support</h3>
              <p className="text-rose-100 leading-relaxed text-lg md:text-xl">
                Our knowledgeable team is here to help you find the perfect products for your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-red-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Products
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular homeware essentials
            </p>
          </div>

          <ProductCarousel />

          <div className="text-center mt-12">
            <Link href="/products" className="inline-flex items-center bg-burgundy-800 text-white px-8 py-4 rounded-xl hover:bg-burgundy-900 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              See All Products
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-red-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have transformed their homes with Visto Homeware
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "The quality of these products is exceptional. My new dinner set has become the centerpiece 
                of every family gathering. Absolutely worth every penny!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-burgundy-800 font-semibold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "Fast shipping, excellent customer service, and products that exceed expectations. 
                Visto Homeware has become my go-to for all kitchen essentials."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-burgundy-800 font-semibold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "I love how these products blend functionality with style. My kitchen has never looked 
                better, and everything works perfectly after months of daily use."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-burgundy-800 font-semibold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Amanda Rodriguez</h4>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center mx-auto mb-6 float-icon group-hover:shadow-lg transition-shadow">
                <Mail className="w-10 h-10 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Email Us</h3>
              <p className="text-gray-600 mb-2">Quick response guaranteed</p>
              <a href="mailto:smplastics@gmail.com" className="text-burgundy-800 font-semibold hover:underline">
                smplastics@gmail.com
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center mx-auto mb-6 float-icon group-hover:shadow-lg transition-shadow">
                <Phone className="w-10 h-10 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Raj Agarwal</h3>
              <p className="text-gray-600 mb-2">Business Inquiries</p>
              <a href="tel:+919830161908" className="text-burgundy-800 font-semibold hover:underline text-lg">
                +91 98301 61908
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center mx-auto mb-6 float-icon group-hover:shadow-lg transition-shadow">
                <Phone className="w-10 h-10 text-burgundy-800" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Gopal Saraf</h3>
              <p className="text-gray-600 mb-2">Business Inquiries</p>
              <a href="tel:+919831033736" className="text-burgundy-800 font-semibold hover:underline text-lg">
                +91 98310 33736
              </a>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-burgundy-200 flex items-center justify-center mx-auto mb-6 float-icon group-hover:shadow-lg transition-shadow">
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

          {/* Map Section */}
          <div className="mt-16">
            <div className="bg-gray-100 h-96 w-full rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.5449662447786!2d88.35637387536996!3d22.514745979520243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0270d15c5f7b47%3A0x8e8c9c0f6b5b4b8b!2sChanditala%20Branch%20Rd%2C%20Kolkata%2C%20West%20Bengal%20700053%2C%20India!5e0!3m2!1sen!2sus!4v1635789012345!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Visto Homeware Location"
              ></iframe>
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
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
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
                <li>+91 98310 33736</li>
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
