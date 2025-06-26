
import { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId?: number;
  productName?: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim() || !review.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - in real app, this would submit to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback. Your review will be published after moderation.",
      });

      // Reset form
      setRating(0);
      setName("");
      setEmail("");
      setReview("");
      
      onReviewSubmitted?.();
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              starValue <= (hoveredRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Write a Review</span>
        </CardTitle>
        {productName && (
          <p className="text-sm text-gray-600">Share your experience with {productName}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex space-x-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You rated: {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="reviewerName" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reviewerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="reviewerEmail" className="text-sm font-medium">
              Email (optional)
            </Label>
            <Input
              id="reviewerEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your email will not be published
            </p>
          </div>

          {/* Review */}
          <div>
            <Label htmlFor="reviewText" className="text-sm font-medium">
              Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reviewText"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              className="mt-1 min-h-[100px]"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
