
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export default function FloatingCartIcon() {
  const { cartCount, setCartOpen } = useStore();

  if (cartCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Button
        size="lg"
        className="rounded-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 shadow-lg w-14 h-14 p-0 relative"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingBag className="h-6 w-6" />
        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center p-0">
          {cartCount}
        </Badge>
      </Button>
    </div>
  );
}
