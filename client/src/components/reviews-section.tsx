import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Amazing quality and fast delivery! The fabric is excellent and fits perfectly.",
    product: "Women's Silk Dress",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b19c?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    rating: 5,
    comment: "Great collection and affordable prices. Will definitely shop again!",
    product: "Men's Cotton Shirt",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Sneha Patel",
    rating: 4,
    comment: "Love the trendy designs! Customer service was very helpful.",
    product: "Designer Handbag",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Amit Singh",
    rating: 5,
    comment: "Premium quality at reasonable prices. Highly recommended!",
    product: "Sports Shoes",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }
];

export default function ReviewsSection() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-bold text-2xl md:text-3xl text-gray-800 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Hednor for their fashion needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {review.name}
                  </h4>
                  <div className="flex items-center mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-pink-200 absolute -top-2 -left-1" />
                <p className="text-gray-600 text-sm leading-relaxed pl-4">
                  {review.comment}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Purchased: <span className="font-medium">{review.product}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
            <span className="font-semibold text-green-800">4.8/5</span>
            <span className="text-green-600 ml-2">Based on 12,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}