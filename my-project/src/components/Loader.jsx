import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full w-full py-12">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-pink-600"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Skeleton loader for product cards
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for product details
export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-12 bg-gray-200 rounded w-1/2 mt-8" />
        </div>
      </div>
    </div>
  );
}