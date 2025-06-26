
import { useState, useEffect } from "react";
import { X, Mail, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('newsletter-popup-seen', 'true');
      setIsOpen(false);
      // Here you would typically send the email to your backend
      console.log('Newsletter subscription:', email);
    }
  };

  const handleClose = () => {
    localStorage.setItem('newsletter-popup-seen', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative bg-gradient-to-br from-hednor-gold to-yellow-400 p-6 text-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-hednor-dark hover:bg-black/10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <Gift className="h-8 w-8 text-hednor-gold" />
            </div>
            <h2 className="text-2xl font-bold text-hednor-dark mb-2">
              Get 15% Off Your First Order!
            </h2>
            <p className="text-hednor-dark/80 text-sm">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and fashion tips.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white border-white text-gray-800"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-hednor-dark text-white hover:bg-gray-800">
              Get My 15% Off
            </Button>
          </form>

          <p className="text-xs text-hednor-dark/60 mt-3">
            No spam, unsubscribe at any time
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
