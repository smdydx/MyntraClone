import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

const FloatingCartIcon = () => {
  const [, setLocation] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useStore();

  // This component is now disabled as cart functionality moved to left side floating icons
  return null;
}