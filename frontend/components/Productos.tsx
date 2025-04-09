'use client';

export default function ProductCard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
        <div className="relative">
          <img
            src="https://placehold.co/400x300"
            alt="Product"
            className="w-full h-52 object-cover"
          />
          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Sale
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Classic T-Shirt</h3>
            <p className="text-gray-500 mt-1">Premium cotton blend</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">$49.99</p>
              <p className="text-sm text-gray-500 line-through">$69.99</p>
            </div>

            <div className="flex items-center gap-1">
              <div className="text-yellow-400">★★★★</div>
              <div className="text-gray-300">★</div>
              <span className="text-sm text-gray-600 ml-1">(42)</span>
            </div>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}