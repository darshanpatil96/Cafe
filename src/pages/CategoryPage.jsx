import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_DATA, CATEGORY_LIST } from '../data/menuData';
import MenuCard from '../components/MenuCard';
import ProductModal from '../components/ProductModal';
import ImageWithFallback from '../components/ImageWithFallback';

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);

  // Find category by slug
  const categoryMeta = CATEGORY_LIST.find((c) => c.slug === slug);
  const categoryName = categoryMeta?.name;
  const items = categoryName ? MENU_DATA[categoryName] || [] : [];

  // Update document title + meta
  useEffect(() => {
    if (categoryMeta) {
      document.title = `${categoryMeta.name} | Veloura Café`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = categoryMeta.description;
    }
    return () => {
      document.title = 'Veloura Café | Crafted Moments. Exceptional Coffee.';
    };
  }, [categoryMeta]);

  if (!categoryMeta) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
        <p className="text-stone-400 font-light text-lg">Category not found.</p>
        <Link to="/#menu" className="text-orange-200 underline underline-offset-4 text-sm">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-stone-950"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <ImageWithFallback
          src={categoryMeta.bannerImage}
          alt={categoryMeta.name}
          className="w-full h-full object-cover"
          wrapperClassName="w-full h-full"
          loading="eager"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${categoryMeta.color} to-stone-950`} />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent" />

        {/* Content over banner */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-8 md:pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-stone-400 text-xs tracking-widest uppercase mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <Link to="/#menu" className="hover:text-orange-200 transition-colors">Menu</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-orange-200">{categoryMeta.name}</span>
          </nav>
          <motion.h1
            className="font-headline text-4xl md:text-6xl text-stone-100 mb-3 italic"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {categoryMeta.name}
          </motion.h1>
          <motion.p
            className="text-stone-300 font-light text-sm md:text-base max-w-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {categoryMeta.description}
          </motion.p>
        </div>

        {/* Item count badge */}
        <div className="absolute top-6 right-6 md:top-8 md:right-16 bg-stone-900/80 backdrop-blur border border-stone-700/50 px-4 py-2 rounded-full">
          <span className="text-orange-200 font-bold text-sm">{items.length}</span>
          <span className="text-stone-400 text-xs ml-1.5">items</span>
        </div>
      </div>

      {/* Category Pills (navigation between categories) */}
      <div className="sticky top-[72px] z-30 bg-stone-950/90 backdrop-blur-xl border-b border-stone-800/40">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 md:px-16 py-3">
          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.slug}
              to={`/menu/${cat.slug}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                cat.slug === slug
                  ? 'bg-orange-200 text-stone-950'
                  : 'border border-stone-700 text-stone-400 hover:border-orange-200/40 hover:text-orange-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-16 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="material-symbols-outlined text-6xl text-stone-700">restaurant_menu</span>
            <p className="text-stone-500 text-lg font-light">Nothing here yet — check back soon.</p>
          </div>
        ) : (
          <motion.div
            key={slug}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {items.map((item) => (
              <motion.div key={item.id} variants={cardVariant}>
                <MenuCard item={item} onOpenModal={setSelectedItem} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Back to home CTA */}
      <div className="px-6 md:px-16 pb-16 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-200 text-xs tracking-widest uppercase font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Veloura
        </Link>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryPage;
