import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";
import CartSlideout from "./cart-slideout";
import MobileSearch from "./mobile-search";
import AuthModal from "./auth-modal";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  {
    name: "Men",
    href: "/products?category=men",
    submenu: [
      {
        name: "Topwear",
        href: "/products?category=men&subcategory=topwear",
        isCategory: true,
      },
      { name: "T-Shirts", href: "/products?category=men&subcategory=tshirts" },
      {
        name: "Casual Shirts",
        href: "/products?category=men&subcategory=casual-shirts",
      },
      {
        name: "Formal Shirts",
        href: "/products?category=men&subcategory=formal-shirts",
      },
      {
        name: "Sweatshirts",
        href: "/products?category=men&subcategory=sweatshirts",
      },
      { name: "Sweaters", href: "/products?category=men&subcategory=sweaters" },
      { name: "Jackets", href: "/products?category=men&subcategory=jackets" },
      {
        name: "Blazers & Coats",
        href: "/products?category=men&subcategory=blazers-coats",
      },
      { name: "Suits", href: "/products?category=men&subcategory=suits" },
      {
        name: "Rain Jackets",
        href: "/products?category=men&subcategory=rain-jackets",
      },
      {
        name: "Indian & Festive Wear",
        href: "/products?category=men&subcategory=indian-festive",
        isCategory: true,
      },
      {
        name: "Kurtas & Kurta Sets",
        href: "/products?category=men&subcategory=kurtas",
      },
      {
        name: "Sherwanis",
        href: "/products?category=men&subcategory=sherwanis",
      },
      {
        name: "Nehru Jackets",
        href: "/products?category=men&subcategory=nehru-jackets",
      },
      { name: "Dhotis", href: "/products?category=men&subcategory=dhotis" },
      {
        name: "Bottomwear",
        href: "/products?category=men&subcategory=bottomwear",
        isCategory: true,
      },
      { name: "Jeans", href: "/products?category=men&subcategory=jeans" },
      {
        name: "Casual Trousers",
        href: "/products?category=men&subcategory=casual-trousers",
      },
      {
        name: "Formal Trousers",
        href: "/products?category=men&subcategory=formal-trousers",
      },
      { name: "Shorts", href: "/products?category=men&subcategory=shorts" },
      {
        name: "Track Pants & Joggers",
        href: "/products?category=men&subcategory=track-pants",
      },
      {
        name: "Innerwear & Sleepwear",
        href: "/products?category=men&subcategory=innerwear",
        isCategory: true,
      },
      {
        name: "Briefs & Trunks",
        href: "/products?category=men&subcategory=briefs-trunks",
      },
      { name: "Boxers", href: "/products?category=men&subcategory=boxers" },
      { name: "Vests", href: "/products?category=men&subcategory=vests" },
      {
        name: "Sleepwear & Loungewear",
        href: "/products?category=men&subcategory=sleepwear",
      },
      { name: "Thermals", href: "/products?category=men&subcategory=thermals" },
      {
        name: "Plus Size",
        href: "/products?category=men&subcategory=plus-size",
      },
      {
        name: "Footwear",
        href: "/products?category=men&subcategory=footwear",
        isCategory: true,
      },
      {
        name: "Casual Shoes",
        href: "/products?category=men&subcategory=casual-shoes",
      },
      {
        name: "Sports Shoes",
        href: "/products?category=men&subcategory=sports-shoes",
      },
      {
        name: "Formal Shoes",
        href: "/products?category=men&subcategory=formal-shoes",
      },
      { name: "Sneakers", href: "/products?category=men&subcategory=sneakers" },
      {
        name: "Sandals & Floaters",
        href: "/products?category=men&subcategory=sandals",
      },
      {
        name: "Flip Flops",
        href: "/products?category=men&subcategory=flip-flops",
      },
      { name: "Socks", href: "/products?category=men&subcategory=socks" },
      {
        name: "Personal Care & Grooming",
        href: "/products?category=men&subcategory=grooming",
        isCategory: true,
      },
      {
        name: "Sunglasses & Frames",
        href: "/products?category=men&subcategory=sunglasses",
      },
      { name: "Watches", href: "/products?category=men&subcategory=watches" },
      {
        name: "Fashion Accessories",
        href: "/products?category=men&subcategory=accessories",
        isCategory: true,
      },
      { name: "Wallets", href: "/products?category=men&subcategory=wallets" },
      { name: "Belts", href: "/products?category=men&subcategory=belts" },
      {
        name: "Perfumes & Body Mists",
        href: "/products?category=men&subcategory=perfumes",
      },
      { name: "Trimmers", href: "/products?category=men&subcategory=trimmers" },
      {
        name: "Deodorants",
        href: "/products?category=men&subcategory=deodorants",
      },
    ],
  },
  {
    name: "Women",
    href: "/products?category=women",
    submenu: [
      {
        name: "Indian & Fusion Wear",
        href: "/products?category=women&subcategory=indian-fusion",
        isCategory: true,
      },
      {
        name: "Kurtas & Suits",
        href: "/products?category=women&subcategory=kurtas-suits",
      },
      {
        name: "Kurtis, Tunics & Tops",
        href: "/products?category=women&subcategory=kurtis-tunics",
      },
      { name: "Sarees", href: "/products?category=women&subcategory=sarees" },
      {
        name: "Ethnic Wear",
        href: "/products?category=women&subcategory=ethnic",
      },
      {
        name: "Leggings, Salwars & Churidars",
        href: "/products?category=women&subcategory=leggings-salwars",
      },
      {
        name: "Skirts & Palazzos",
        href: "/products?category=women&subcategory=skirts-palazzos",
      },
      {
        name: "Dress Materials",
        href: "/products?category=women&subcategory=dress-materials",
      },
      {
        name: "Lehenga Cholis",
        href: "/products?category=women&subcategory=lehenga-cholis",
      },
      {
        name: "Dupattas & Shawls",
        href: "/products?category=women&subcategory=dupattas-shawls",
      },
      {
        name: "Western Wear",
        href: "/products?category=women&subcategory=western",
        isCategory: true,
      },
      { name: "Dresses", href: "/products?category=women&subcategory=dresses" },
      { name: "Tops", href: "/products?category=women&subcategory=tops" },
      {
        name: "T-shirts",
        href: "/products?category=women&subcategory=tshirts",
      },
      { name: "Jeans", href: "/products?category=women&subcategory=jeans" },
      {
        name: "Trousers & Capris",
        href: "/products?category=women&subcategory=trousers-capris",
      },
      {
        name: "Shorts & Skirts",
        href: "/products?category=women&subcategory=shorts-skirts",
      },
      { name: "Co-ords", href: "/products?category=women&subcategory=coords" },
      {
        name: "Playsuits",
        href: "/products?category=women&subcategory=playsuits",
      },
      {
        name: "Jumpsuits",
        href: "/products?category=women&subcategory=jumpsuits",
      },
      { name: "Shrugs", href: "/products?category=women&subcategory=shrugs" },
      {
        name: "Sweaters & Sweatshirts",
        href: "/products?category=women&subcategory=sweaters",
      },
      {
        name: "Jackets & Coats",
        href: "/products?category=women&subcategory=jackets-coats",
      },
      {
        name: "Blazers & Waistcoats",
        href: "/products?category=women&subcategory=blazers",
      },
      {
        name: "Plus Size",
        href: "/products?category=women&subcategory=plus-size",
      },
      {
        name: "Maternity",
        href: "/products?category=women&subcategory=maternity",
      },
      {
        name: "Footwear",
        href: "/products?category=women&subcategory=footwear",
        isCategory: true,
      },
      { name: "Flats", href: "/products?category=women&subcategory=flats" },
      {
        name: "Casual Shoes",
        href: "/products?category=women&subcategory=casual-shoes",
      },
      { name: "Heels", href: "/products?category=women&subcategory=heels" },
      { name: "Boots", href: "/products?category=women&subcategory=boots" },
      {
        name: "Sports Shoes & Floaters",
        href: "/products?category=women&subcategory=sports-shoes",
      },
      {
        name: "Lingerie & Sleepwear",
        href: "/products?category=women&subcategory=lingerie",
        isCategory: true,
      },
      { name: "Bra", href: "/products?category=women&subcategory=bra" },
      { name: "Briefs", href: "/products?category=women&subcategory=briefs" },
      {
        name: "Shapewear",
        href: "/products?category=women&subcategory=shapewear",
      },
      {
        name: "Sleepwear & Loungewear",
        href: "/products?category=women&subcategory=sleepwear",
      },
      {
        name: "Swimwear",
        href: "/products?category=women&subcategory=swimwear",
      },
      {
        name: "Beauty & Personal Care",
        href: "/products?category=women&subcategory=beauty",
        isCategory: true,
      },
      { name: "Makeup", href: "/products?category=women&subcategory=makeup" },
      {
        name: "Skincare",
        href: "/products?category=women&subcategory=skincare",
      },
      {
        name: "Premium Beauty",
        href: "/products?category=women&subcategory=premium-beauty",
      },
      {
        name: "Lipsticks",
        href: "/products?category=women&subcategory=lipsticks",
      },
      {
        name: "Fragrances",
        href: "/products?category=women&subcategory=fragrances",
      },
      {
        name: "Jewellery",
        href: "/products?category=women&subcategory=jewellery",
        isCategory: true,
      },
      {
        name: "Fashion Jewellery",
        href: "/products?category=women&subcategory=fashion-jewellery",
      },
      {
        name: "Fine Jewellery",
        href: "/products?category=women&subcategory=fine-jewellery",
      },
      {
        name: "Earrings",
        href: "/products?category=women&subcategory=earrings",
      },
      {
        name: "Handbags, Bags & Wallets",
        href: "/products?category=women&subcategory=handbags",
      },
    ],
  },
  {
    name: "Kids",
    href: "/products?category=kids",
    submenu: [
      {
        name: "Boys Clothing",
        href: "/products?category=kids&subcategory=boys",
        isCategory: true,
      },
      {
        name: "T-Shirts",
        href: "/products?category=kids&subcategory=boys-tshirts",
      },
      {
        name: "Shirts",
        href: "/products?category=kids&subcategory=boys-shirts",
      },
      {
        name: "Shorts",
        href: "/products?category=kids&subcategory=boys-shorts",
      },
      { name: "Jeans", href: "/products?category=kids&subcategory=boys-jeans" },
      {
        name: "Trousers",
        href: "/products?category=kids&subcategory=boys-trousers",
      },
      {
        name: "Boys Clothing Sets",
        href: "/products?category=kids&subcategory=boys-sets",
      },
      {
        name: "Ethnic Wear",
        href: "/products?category=kids&subcategory=boys-ethnic",
      },
      {
        name: "Track Pants & Pyjamas",
        href: "/products?category=kids&subcategory=boys-trackpants",
      },
      {
        name: "Boys Jackets & Sweatshirts",
        href: "/products?category=kids&subcategory=boys-jackets",
      },
      {
        name: "Party Wear",
        href: "/products?category=kids&subcategory=boys-party",
      },
      {
        name: "Innerwear & Thermals",
        href: "/products?category=kids&subcategory=boys-innerwear",
      },
      {
        name: "Nightwear & Loungewear",
        href: "/products?category=kids&subcategory=boys-nightwear",
      },
      {
        name: "Girls Clothing",
        href: "/products?category=kids&subcategory=girls",
        isCategory: true,
      },
      {
        name: "Dresses",
        href: "/products?category=kids&subcategory=girls-dresses",
      },
      { name: "Tops", href: "/products?category=kids&subcategory=girls-tops" },
      {
        name: "T-shirts",
        href: "/products?category=kids&subcategory=girls-tshirts",
      },
      {
        name: "Girls Clothing Sets",
        href: "/products?category=kids&subcategory=girls-sets",
      },
      {
        name: "Lehenga choli",
        href: "/products?category=kids&subcategory=girls-lehenga",
      },
      {
        name: "Kurta Sets",
        href: "/products?category=kids&subcategory=girls-kurta",
      },
      {
        name: "Party wear",
        href: "/products?category=kids&subcategory=girls-party",
      },
      {
        name: "Dungarees & Jumpsuits",
        href: "/products?category=kids&subcategory=girls-dungarees",
      },
      {
        name: "Skirts & shorts",
        href: "/products?category=kids&subcategory=girls-skirts",
      },
      {
        name: "Tights & Leggings",
        href: "/products?category=kids&subcategory=girls-tights",
      },
      {
        name: "Jeans, Trousers & Capris",
        href: "/products?category=kids&subcategory=girls-jeans",
      },
      {
        name: "Girls Jackets & Sweatshirts",
        href: "/products?category=kids&subcategory=girls-jackets",
      },
      {
        name: "Footwear",
        href: "/products?category=kids&subcategory=footwear",
        isCategory: true,
      },
      {
        name: "Casual Shoes",
        href: "/products?category=kids&subcategory=casual-shoes",
      },
      {
        name: "Flipflops",
        href: "/products?category=kids&subcategory=flipflops",
      },
      {
        name: "Sports Shoes",
        href: "/products?category=kids&subcategory=sports-shoes",
      },
      { name: "Flats", href: "/products?category=kids&subcategory=flats" },
      { name: "Sandals", href: "/products?category=kids&subcategory=sandals" },
      { name: "Heels", href: "/products?category=kids&subcategory=heels" },
      {
        name: "School Shoes",
        href: "/products?category=kids&subcategory=school-shoes",
      },
      { name: "Socks", href: "/products?category=kids&subcategory=socks" },
      {
        name: "Toys & Games",
        href: "/products?category=kids&subcategory=toys",
        isCategory: true,
      },
      {
        name: "Learning & Development",
        href: "/products?category=kids&subcategory=learning-toys",
      },
      {
        name: "Activity Toys",
        href: "/products?category=kids&subcategory=activity-toys",
      },
      {
        name: "Soft Toys",
        href: "/products?category=kids&subcategory=soft-toys",
      },
      {
        name: "Action Figure / Play set",
        href: "/products?category=kids&subcategory=action-figures",
      },
      {
        name: "Infants",
        href: "/products?category=kids&subcategory=infants",
        isCategory: true,
      },
      {
        name: "Bodysuits",
        href: "/products?category=kids&subcategory=bodysuits",
      },
      {
        name: "Rompers & Sleepsuits",
        href: "/products?category=kids&subcategory=rompers",
      },
      {
        name: "Kids Accessories",
        href: "/products?category=kids&subcategory=accessories",
        isCategory: true,
      },
      {
        name: "Bags & Backpacks",
        href: "/products?category=kids&subcategory=bags",
      },
      { name: "Watches", href: "/products?category=kids&subcategory=watches" },
      {
        name: "Jewellery & Hair accessory",
        href: "/products?category=kids&subcategory=jewellery",
      },
      {
        name: "Sunglasses",
        href: "/products?category=kids&subcategory=sunglasses",
      },
      { name: "Caps & Hats", href: "/products?category=kids&subcategory=caps" },
    ],
  },
  {
    name: "Home & Living",
    href: "/products?category=home",
    submenu: [
      {
        name: "Bed Linen & Furnishing",
        href: "/products?category=home&subcategory=bed-linen",
        isCategory: true,
      },
      {
        name: "Bed Runners",
        href: "/products?category=home&subcategory=bed-runners",
      },
      {
        name: "Mattress Protectors",
        href: "/products?category=home&subcategory=mattress-protectors",
      },
      {
        name: "Bedsheets",
        href: "/products?category=home&subcategory=bedsheets",
      },
      {
        name: "Bedding Sets",
        href: "/products?category=home&subcategory=bedding-sets",
      },
      {
        name: "Blankets, Quilts & Dohars",
        href: "/products?category=home&subcategory=blankets",
      },
      {
        name: "Pillows & Pillow Covers",
        href: "/products?category=home&subcategory=pillows",
      },
      {
        name: "Bed Covers",
        href: "/products?category=home&subcategory=bed-covers",
      },
      {
        name: "Diwan Sets",
        href: "/products?category=home&subcategory=diwan-sets",
      },
      {
        name: "Chair Pads & Covers",
        href: "/products?category=home&subcategory=chair-covers",
      },
      {
        name: "Sofa Covers",
        href: "/products?category=home&subcategory=sofa-covers",
      },
      {
        name: "Flooring",
        href: "/products?category=home&subcategory=flooring",
        isCategory: true,
      },
      {
        name: "Floor Runners",
        href: "/products?category=home&subcategory=floor-runners",
      },
      { name: "Carpets", href: "/products?category=home&subcategory=carpets" },
      {
        name: "Floor Mats & Dhurries",
        href: "/products?category=home&subcategory=floor-mats",
      },
      {
        name: "Door Mats",
        href: "/products?category=home&subcategory=door-mats",
      },
      {
        name: "Bath",
        href: "/products?category=home&subcategory=bath",
        isCategory: true,
      },
      {
        name: "Bath Towels",
        href: "/products?category=home&subcategory=bath-towels",
      },
      {
        name: "Hand & Face Towels",
        href: "/products?category=home&subcategory=hand-towels",
      },
      {
        name: "Beach Towels",
        href: "/products?category=home&subcategory=beach-towels",
      },
      {
        name: "Towels Set",
        href: "/products?category=home&subcategory=towel-sets",
      },
      {
        name: "Bath Rugs",
        href: "/products?category=home&subcategory=bath-rugs",
      },
      {
        name: "Bath Robes",
        href: "/products?category=home&subcategory=bath-robes",
      },
      {
        name: "Bathroom Accessories",
        href: "/products?category=home&subcategory=bathroom-accessories",
      },
      {
        name: "Shower Curtains",
        href: "/products?category=home&subcategory=shower-curtains",
      },
      {
        name: "Lamps & Lighting",
        href: "/products?category=home&subcategory=lighting",
        isCategory: true,
      },
      {
        name: "Floor Lamps",
        href: "/products?category=home&subcategory=floor-lamps",
      },
      {
        name: "Ceiling Lamps",
        href: "/products?category=home&subcategory=ceiling-lamps",
      },
      {
        name: "Table Lamps",
        href: "/products?category=home&subcategory=table-lamps",
      },
      {
        name: "Wall Lamps",
        href: "/products?category=home&subcategory=wall-lamps",
      },
      {
        name: "Outdoor Lamps",
        href: "/products?category=home&subcategory=outdoor-lamps",
      },
      {
        name: "String Lights",
        href: "/products?category=home&subcategory=string-lights",
      },
      {
        name: "Home Décor",
        href: "/products?category=home&subcategory=decor",
        isCategory: true,
      },
      {
        name: "Plants & Planters",
        href: "/products?category=home&subcategory=plants",
      },
      {
        name: "Aromas & Candles",
        href: "/products?category=home&subcategory=candles",
      },
      { name: "Clocks", href: "/products?category=home&subcategory=clocks" },
      { name: "Mirrors", href: "/products?category=home&subcategory=mirrors" },
      {
        name: "Wall Décor",
        href: "/products?category=home&subcategory=wall-decor",
      },
      {
        name: "Festive Decor",
        href: "/products?category=home&subcategory=festive-decor",
      },
      {
        name: "Pooja Essentials",
        href: "/products?category=home&subcategory=pooja",
      },
      {
        name: "Wall Shelves",
        href: "/products?category=home&subcategory=wall-shelves",
      },
      {
        name: "Fountains",
        href: "/products?category=home&subcategory=fountains",
      },
      {
        name: "Showpieces & Vases",
        href: "/products?category=home&subcategory=showpieces",
      },
      { name: "Ottoman", href: "/products?category=home&subcategory=ottoman" },
      {
        name: "Cushions & Cushion Covers",
        href: "/products?category=home&subcategory=cushions",
      },
      {
        name: "Curtains",
        href: "/products?category=home&subcategory=curtains",
      },
      {
        name: "Furniture",
        href: "/products?category=home&subcategory=furniture",
      },
      {
        name: "Home Gift Sets",
        href: "/products?category=home&subcategory=gift-sets",
      },
      {
        name: "Kitchen & Table",
        href: "/products?category=home&subcategory=kitchen",
        isCategory: true,
      },
      {
        name: "Table Runners",
        href: "/products?category=home&subcategory=table-runners",
      },
      {
        name: "Dinnerware & Serveware",
        href: "/products?category=home&subcategory=dinnerware",
      },
      {
        name: "Cups and Mugs",
        href: "/products?category=home&subcategory=cups-mugs",
      },
      {
        name: "Bakeware & Cookware",
        href: "/products?category=home&subcategory=cookware",
      },
      {
        name: "Kitchen Storage & Tools",
        href: "/products?category=home&subcategory=kitchen-storage",
      },
      {
        name: "Bar & Drinkware",
        href: "/products?category=home&subcategory=barware",
      },
      {
        name: "Table Covers & Furnishings",
        href: "/products?category=home&subcategory=table-covers",
      },
      {
        name: "Storage",
        href: "/products?category=home&subcategory=storage",
        isCategory: true,
      },
      { name: "Bins", href: "/products?category=home&subcategory=bins" },
      { name: "Hangers", href: "/products?category=home&subcategory=hangers" },
      {
        name: "Organisers",
        href: "/products?category=home&subcategory=organisers",
      },
      {
        name: "Hooks & Holders",
        href: "/products?category=home&subcategory=hooks",
      },
      {
        name: "Laundry Bags",
        href: "/products?category=home&subcategory=laundry-bags",
      },
    ],
  },
  {
    name: "Beauty",
    href: "/products?category=beauty",
    submenu: [
      {
        name: "Makeup",
        href: "/products?category=beauty&subcategory=makeup",
        isCategory: true,
      },
      {
        name: "Lipstick",
        href: "/products?category=beauty&subcategory=lipstick",
      },
      {
        name: "Lip Gloss",
        href: "/products?category=beauty&subcategory=lip-gloss",
      },
      {
        name: "Lip Liner",
        href: "/products?category=beauty&subcategory=lip-liner",
      },
      {
        name: "Mascara",
        href: "/products?category=beauty&subcategory=mascara",
      },
      {
        name: "Eyeliner",
        href: "/products?category=beauty&subcategory=eyeliner",
      },
      { name: "Kajal", href: "/products?category=beauty&subcategory=kajal" },
      {
        name: "Eyeshadow",
        href: "/products?category=beauty&subcategory=eyeshadow",
      },
      {
        name: "Foundation",
        href: "/products?category=beauty&subcategory=foundation",
      },
      { name: "Primer", href: "/products?category=beauty&subcategory=primer" },
      {
        name: "Concealer",
        href: "/products?category=beauty&subcategory=concealer",
      },
      {
        name: "Compact",
        href: "/products?category=beauty&subcategory=compact",
      },
      {
        name: "Nail Polish",
        href: "/products?category=beauty&subcategory=nail-polish",
      },
      {
        name: "Skincare, Bath & Body",
        href: "/products?category=beauty&subcategory=skincare",
        isCategory: true,
      },
      {
        name: "Face Moisturiser",
        href: "/products?category=beauty&subcategory=moisturiser",
      },
      {
        name: "Cleanser",
        href: "/products?category=beauty&subcategory=cleanser",
      },
      {
        name: "Masks & Peel",
        href: "/products?category=beauty&subcategory=masks",
      },
      {
        name: "Sunscreen",
        href: "/products?category=beauty&subcategory=sunscreen",
      },
      { name: "Serum", href: "/products?category=beauty&subcategory=serum" },
      {
        name: "Face Wash",
        href: "/products?category=beauty&subcategory=face-wash",
      },
      {
        name: "Eye Cream",
        href: "/products?category=beauty&subcategory=eye-cream",
      },
      {
        name: "Lip Balm",
        href: "/products?category=beauty&subcategory=lip-balm",
      },
      {
        name: "Body Lotion",
        href: "/products?category=beauty&subcategory=body-lotion",
      },
      {
        name: "Body Wash",
        href: "/products?category=beauty&subcategory=body-wash",
      },
      {
        name: "Body Scrub",
        href: "/products?category=beauty&subcategory=body-scrub",
      },
      {
        name: "Hand Cream",
        href: "/products?category=beauty&subcategory=hand-cream",
      },
      {
        name: "Baby Care",
        href: "/products?category=beauty&subcategory=baby-care",
      },
      {
        name: "Haircare",
        href: "/products?category=beauty&subcategory=haircare",
        isCategory: true,
      },
      {
        name: "Shampoo",
        href: "/products?category=beauty&subcategory=shampoo",
      },
      {
        name: "Conditioner",
        href: "/products?category=beauty&subcategory=conditioner",
      },
      {
        name: "Hair Cream",
        href: "/products?category=beauty&subcategory=hair-cream",
      },
      {
        name: "Hair Oil",
        href: "/products?category=beauty&subcategory=hair-oil",
      },
      {
        name: "Hair Gel",
        href: "/products?category=beauty&subcategory=hair-gel",
      },
      {
        name: "Hair Color",
        href: "/products?category=beauty&subcategory=hair-color",
      },
      {
        name: "Hair Serum",
        href: "/products?category=beauty&subcategory=hair-serum",
      },
      {
        name: "Hair Accessory",
        href: "/products?category=beauty&subcategory=hair-accessories",
      },
      {
        name: "Fragrances",
        href: "/products?category=beauty&subcategory=fragrances",
        isCategory: true,
      },
      {
        name: "Perfume",
        href: "/products?category=beauty&subcategory=perfume",
      },
      {
        name: "Deodorant",
        href: "/products?category=beauty&subcategory=deodorant",
      },
      {
        name: "Body Mist",
        href: "/products?category=beauty&subcategory=body-mist",
      },
      {
        name: "Appliances",
        href: "/products?category=beauty&subcategory=appliances",
        isCategory: true,
      },
      {
        name: "Hair Straightener",
        href: "/products?category=beauty&subcategory=hair-straightener",
      },
      {
        name: "Hair Dryer",
        href: "/products?category=beauty&subcategory=hair-dryer",
      },
      {
        name: "Epilator",
        href: "/products?category=beauty&subcategory=epilator",
      },
      {
        name: "Men's Grooming",
        href: "/products?category=beauty&subcategory=mens-grooming",
        isCategory: true,
      },
      {
        name: "Trimmers",
        href: "/products?category=beauty&subcategory=trimmers",
      },
      {
        name: "Beard Oil",
        href: "/products?category=beauty&subcategory=beard-oil",
      },
      {
        name: "Hair Wax",
        href: "/products?category=beauty&subcategory=hair-wax",
      },
      {
        name: "Beauty Gift & Makeup Set",
        href: "/products?category=beauty&subcategory=gift-sets",
        isCategory: true,
      },
      {
        name: "Beauty Gift",
        href: "/products?category=beauty&subcategory=beauty-gifts",
      },
      {
        name: "Makeup Kit",
        href: "/products?category=beauty&subcategory=makeup-kit",
      },
      {
        name: "Premium Beauty",
        href: "/products?category=beauty&subcategory=premium-beauty",
      },
      {
        name: "Wellness & Hygiene",
        href: "/products?category=beauty&subcategory=wellness",
      },
    ],
  },
  {
    name: "GenZ",
    href: "/products?category=genz",
    submenu: [
      {
        name: "Women's Western Wear",
        href: "/products?category=genz&subcategory=womens-western",
        isCategory: true,
      },
      {
        name: "Dresses Under ₹599",
        href: "/products?category=genz&subcategory=dresses-599",
      },
      {
        name: "Tops Under ₹399",
        href: "/products?category=genz&subcategory=tops-399",
      },
      {
        name: "Jeans Under ₹599",
        href: "/products?category=genz&subcategory=jeans-599",
      },
      {
        name: "Trousers Under ₹699",
        href: "/products?category=genz&subcategory=trousers-699",
      },
      {
        name: "T-shirts Under ₹299",
        href: "/products?category=genz&subcategory=tshirts-299",
      },
      {
        name: "Shirts Under ₹499",
        href: "/products?category=genz&subcategory=shirts-499",
      },
      {
        name: "Skirts Under ₹499",
        href: "/products?category=genz&subcategory=skirts-499",
      },
      {
        name: "Shorts Under ₹699",
        href: "/products?category=genz&subcategory=shorts-699",
      },
      {
        name: "Co-ords Under ₹799",
        href: "/products?category=genz&subcategory=coords-799",
      },
      {
        name: "Jumpsuits Under ₹899",
        href: "/products?category=genz&subcategory=jumpsuits-899",
      },
      {
        name: "Track pants Under ₹699",
        href: "/products?category=genz&subcategory=trackpants-699",
      },
      {
        name: "Jackets Under ₹899",
        href: "/products?category=genz&subcategory=jackets-899",
      },
      {
        name: "Sweatshirts Under ₹699",
        href: "/products?category=genz&subcategory=sweatshirts-699",
      },
      {
        name: "Sweaters Under ₹899",
        href: "/products?category=genz&subcategory=sweaters-899",
      },
      {
        name: "Women's Ethnic Wear",
        href: "/products?category=genz&subcategory=womens-ethnic",
        isCategory: true,
      },
      {
        name: "Kurtas Under ₹399",
        href: "/products?category=genz&subcategory=kurtas-399",
      },
      {
        name: "Kurtis Under ₹499",
        href: "/products?category=genz&subcategory=kurtis-499",
      },
      {
        name: "Kurta sets Under ₹499",
        href: "/products?category=genz&subcategory=kurta-sets-499",
      },
      {
        name: "Ethnic Dresses Under ₹999",
        href: "/products?category=genz&subcategory=ethnic-dresses-999",
      },
      {
        name: "Palazzos Under ₹799",
        href: "/products?category=genz&subcategory=palazzos-799",
      },
      {
        name: "Lingerie & Loungewear",
        href: "/products?category=genz&subcategory=lingerie",
        isCategory: true,
      },
      {
        name: "Bras Under ₹399",
        href: "/products?category=genz&subcategory=bras-399",
      },
      {
        name: "Night suits Under ₹799",
        href: "/products?category=genz&subcategory=nightsuits-799",
      },
      {
        name: "Nightdresses Under ₹999",
        href: "/products?category=genz&subcategory=nightdresses-999",
      },
      {
        name: "Lounge pants Under ₹999",
        href: "/products?category=genz&subcategory=lounge-pants-999",
      },
      {
        name: "Briefs Under ₹599",
        href: "/products?category=genz&subcategory=briefs-599",
      },
      {
        name: "Men's Casual Wear",
        href: "/products?category=genz&subcategory=mens-casual",
        isCategory: true,
      },
      {
        name: "T-shirts Under ₹299",
        href: "/products?category=genz&subcategory=mens-tshirts-299",
      },
      {
        name: "Shirts Under ₹499",
        href: "/products?category=genz&subcategory=mens-shirts-499",
      },
      {
        name: "Jeans Under ₹599",
        href: "/products?category=genz&subcategory=mens-jeans-599",
      },
      {
        name: "Trousers Under ₹699",
        href: "/products?category=genz&subcategory=mens-trousers-699",
      },
      {
        name: "Shorts Under ₹599",
        href: "/products?category=genz&subcategory=mens-shorts-599",
      },
      {
        name: "Track pants Under ₹699",
        href: "/products?category=genz&subcategory=mens-trackpants-699",
      },
      {
        name: "Jackets Under ₹899",
        href: "/products?category=genz&subcategory=mens-jackets-899",
      },
      {
        name: "Sweatshirts Under ₹699",
        href: "/products?category=genz&subcategory=mens-sweatshirts-699",
      },
      {
        name: "Sweaters Under ₹999",
        href: "/products?category=genz&subcategory=mens-sweaters-999",
      },
      {
        name: "Co-ords Under ₹999",
        href: "/products?category=genz&subcategory=mens-coords-999",
      },
      {
        name: "Men's Occasion Wear",
        href: "/products?category=genz&subcategory=mens-occasion",
        isCategory: true,
      },
      {
        name: "Kurtas Under ₹799",
        href: "/products?category=genz&subcategory=mens-kurtas-799",
      },
      {
        name: "Kurta Sets Under ₹999",
        href: "/products?category=genz&subcategory=mens-kurta-sets-999",
      },
      {
        name: "Women's Footwear",
        href: "/products?category=genz&subcategory=womens-footwear",
        isCategory: true,
      },
      {
        name: "Heels Under ₹599",
        href: "/products?category=genz&subcategory=heels-599",
      },
      {
        name: "Flats Under ₹499",
        href: "/products?category=genz&subcategory=flats-499",
      },
      {
        name: "Casual shoes Under ₹699",
        href: "/products?category=genz&subcategory=womens-casual-shoes-699",
      },
      {
        name: "Sports shoes Under ₹999",
        href: "/products?category=genz&subcategory=womens-sports-shoes-999",
      },
      {
        name: "Flip flops Under ₹799",
        href: "/products?category=genz&subcategory=womens-flipflops-799",
      },
      {
        name: "Boots Under ₹999",
        href: "/products?category=genz&subcategory=womens-boots-999",
      },
      {
        name: "Ballerinas Under ₹799",
        href: "/products?category=genz&subcategory=ballerinas-799",
      },
      {
        name: "Men's Footwear",
        href: "/products?category=genz&subcategory=mens-footwear",
        isCategory: true,
      },
      {
        name: "Casual shoes Under ₹799",
        href: "/products?category=genz&subcategory=mens-casual-shoes-799",
      },
      {
        name: "Sports shoes Under ₹999",
        href: "/products?category=genz&subcategory=mens-sports-shoes-999",
      },
      {
        name: "Formal shoes Under ₹999",
        href: "/products?category=genz&subcategory=formal-shoes-999",
      },
      {
        name: "Sandals Under ₹799",
        href: "/products?category=genz&subcategory=mens-sandals-799",
      },
      {
        name: "Flip flops Under ₹499",
        href: "/products?category=genz&subcategory=mens-flipflops-499",
      },
      {
        name: "Boots Under ₹999",
        href: "/products?category=genz&subcategory=mens-boots-999",
      },
      {
        name: "Beauty & Grooming",
        href: "/products?category=genz&subcategory=beauty-grooming",
        isCategory: true,
      },
      {
        name: "Skincare Under ₹299",
        href: "/products?category=genz&subcategory=skincare-299",
      },
      {
        name: "Haircare Under ₹399",
        href: "/products?category=genz&subcategory=haircare-399",
      },
      {
        name: "Bath & Body Under ₹399",
        href: "/products?category=genz&subcategory=bath-body-399",
      },
      {
        name: "MakeUp Under ₹299",
        href: "/products?category=genz&subcategory=makeup-299",
      },
      {
        name: "Fragrances Under ₹399",
        href: "/products?category=genz&subcategory=fragrances-399",
      },
      {
        name: "Appliances Under ₹999",
        href: "/products?category=genz&subcategory=appliances-999",
      },
      {
        name: "Accessories",
        href: "/products?category=genz&subcategory=accessories",
        isCategory: true,
      },
      {
        name: "Jewellery Under ₹299",
        href: "/products?category=genz&subcategory=jewellery-299",
      },
      {
        name: "Handbags Under ₹499",
        href: "/products?category=genz&subcategory=handbags-499",
      },
      {
        name: "Clutches Under ₹999",
        href: "/products?category=genz&subcategory=clutches-999",
      },
      {
        name: "Backpacks Under ₹699",
        href: "/products?category=genz&subcategory=backpacks-699",
      },
      {
        name: "Wallets Under ₹499",
        href: "/products?category=genz&subcategory=wallets-499",
      },
      {
        name: "Sunglasses Under ₹699",
        href: "/products?category=genz&subcategory=sunglasses-699",
      },
      {
        name: "Belts Under ₹799",
        href: "/products?category=genz&subcategory=belts-799",
      },
      {
        name: "Caps Under ₹899",
        href: "/products?category=genz&subcategory=caps-899",
      },
    ],
  },
  {
    name: "Studio",
    href: "/products?category=studio",
    submenu: [
      {
        name: "Collections",
        href: "/products?category=studio&subcategory=collections",
        isCategory: true,
      },
      {
        name: "New Arrivals",
        href: "/products?category=studio&subcategory=new",
      },
      {
        name: "Premium Collection",
        href: "/products?category=studio&subcategory=premium",
      },
      {
        name: "Limited Edition",
        href: "/products?category=studio&subcategory=limited",
      },
      {
        name: "Designer Wear",
        href: "/products?category=studio&subcategory=designer",
        isCategory: true,
      },
      {
        name: "Couture",
        href: "/products?category=studio&subcategory=couture",
      },
      {
        name: "Ready to Wear",
        href: "/products?category=studio&subcategory=ready-to-wear",
      },
      {
        name: "Bridal Collection",
        href: "/products?category=studio&subcategory=bridal",
      },
      {
        name: "Accessories",
        href: "/products?category=studio&subcategory=accessories",
        isCategory: true,
      },
      {
        name: "Handbags",
        href: "/products?category=studio&subcategory=handbags",
      },
      {
        name: "Jewelry",
        href: "/products?category=studio&subcategory=jewelry",
      },
      {
        name: "Scarves & Stoles",
        href: "/products?category=studio&subcategory=scarves",
      },
    ],
  },
];

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null,
  );

  const {
    cartCount,
    isCartOpen,
    setCartOpen,
    isMobileSearchOpen,
    setMobileSearchOpen,
    wishlistItems,
  } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="shadow-sm sticky top-0 z-40 border-b border-gray-700 dark:border-gray-700" style={{ backgroundColor: 'rgb(112, 113, 35)' }}>
        {/* Top Banner */}
        <div className="bg-hednor-gold text-hednor-dark text-center py-2 text-sm font-medium">
          <span>Free Shipping on Orders Above ₹1999 | Use Code: FREESHIP</span>
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-between lg:justify-start">
            {/* Mobile: Wishlist on left */}
            <div className="flex items-center lg:hidden">
              <div className="flex flex-col items-center text-white hover:text-hednor-gold cursor-pointer transition-colors relative p-2">
                <Heart className="h-4 w-4" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-hednor-gold text-hednor-dark text-xs rounded-full w-4 h-4 flex items-center justify-center p-0 text-[10px]">
                    {wishlistItems.length}
                  </Badge>
                )}
              </div>
            </div>

            {/* Logo - positioned more to the right */}
            <Link href="/" className="flex items-center lg:mr-6 ml-12 lg:ml-0">
              <img
                src={hednorLogoPath}
                alt="Hednor"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 flex-1">
              {navigation.map((item, index) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="text-gray-200 dark:text-gray-200 hover:text-hednor-gold dark:hover:text-hednor-gold font-bold text-sm uppercase tracking-wide transition-colors px-3 py-2 hover:border-b-2 hover:border-hednor-gold"
                  >
                    {item.name}
                  </Link>

                  {/* Myntra-style Mega Menu */}
                  <div
                    className="absolute top-full left-0 mt-4 bg-white dark:bg-gray-800 shadow-xl border-t-4 border-hednor-gold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-lg"
                    style={{
                      width: "70vw",
                      maxWidth: "800px",
                      minWidth: "600px",
                    }}
                  >
                    <div className="p-6 lg:p-8">
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 max-h-80 overflow-y-auto">
                        {(() => {
                          const categoryGroups: {
                            [key: string]: typeof item.submenu;
                          } = {};
                          let currentCategory = "General";

                          item.submenu.forEach((subItem) => {
                            if (subItem.isCategory) {
                              currentCategory = subItem.name;
                              categoryGroups[currentCategory] = [];
                            } else {
                              if (!categoryGroups[currentCategory]) {
                                categoryGroups[currentCategory] = [];
                              }
                              categoryGroups[currentCategory].push(subItem);
                            }
                          });

                          return Object.entries(categoryGroups)
                            .slice(0, 5)
                            .map(([categoryName, items]) => (
                              <div key={categoryName} className="space-y-4">
                                <h3 className="font-bold text-hednor-gold text-sm uppercase tracking-wide">
                                  {categoryName}
                                </h3>
                                <div className="space-y-2">
                                  {items.slice(0, 8).map((subItem) => (
                                    <Link
                                      key={`${categoryName}-${subItem.name}`}
                                      href={subItem.href}
                                      className="block text-sm text-gray-700 dark:text-gray-300 hover:text-hednor-gold dark:hover:text-hednor-gold transition-colors hover:font-medium"
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ));
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-hednor-gold focus:border-hednor-gold text-sm"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Mobile Search Button - moved to right of logo */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:text-hednor-gold p-1"
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center text-white hover:text-hednor-gold cursor-pointer transition-colors p-2 hover:bg-transparent"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium hidden md:block">
                    Profile
                  </span>
                </Button>

                <div className="flex flex-col items-center text-white hover:text-hednor-gold cursor-pointer transition-colors relative p-2">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium hidden md:block">
                    Wishlist
                  </span>
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-hednor-gold text-hednor-dark text-xs rounded-full w-4 h-4 flex items-center justify-center p-0 text-[10px]">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </div>

                {/* <ThemeToggle /> */}
              </div>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center text-white hover:text-hednor-gold hover:border-hednor-gold cursor-pointer transition-colors relative border border-transparent hover:bg-transparent lg:p-2 p-1"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="text-xs mt-1 font-medium hidden md:block">
                  Bag
                </span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-hednor-gold text-hednor-dark text-xs rounded-full w-4 h-4 flex items-center justify-center p-0 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden text-white hover:text-hednor-gold p-1"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] sm:w-[320px] p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="font-semibold text-lg text-gray-800">
                        Menu
                      </h2>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 space-y-1">
                        {navigation.map((item) => (
                          <div key={item.name} className="space-y-1">
                            {/* Main Category */}
                            <div className="flex items-center justify-between">
                              <Link
                                href={item.href}
                                className="flex-1 text-gray-800 hover:bg-hednor-gold/10 hover:text-hednor-gold font-medium text-sm py-3 px-3 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name.toUpperCase()}
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2"
                                onClick={() =>
                                  setExpandedMobileMenu(
                                    expandedMobileMenu === item.name
                                      ? null
                                      : item.name,
                                  )
                                }
                              >
                                {expandedMobileMenu === item.name ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            {/* Submenu */}
                            {expandedMobileMenu === item.name &&
                              item.submenu && (
                                <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                                  {item.submenu.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      href={subItem.href}
                                      className={`block text-sm py-2 px-3 rounded-md transition-colors ${
                                        subItem.isCategory
                                          ? "font-semibold text-hednor-gold hover:bg-hednor-gold/10"
                                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                      }`}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

                      {/* User Actions */}
                      <div className="border-t border-gray-200 p-4 space-y-2">
                        <Button
                          variant="outline"
                          className="w-full text-hednor-gold border-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark font-medium py-3"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-400 font-medium py-3"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                        >
                          Register
                        </Button>
                        <div className="flex items-center space-x-3 text-gray-800 hover:bg-hednor-gold/10 hover:text-hednor-gold font-medium cursor-pointer transition-colors py-3 px-3 rounded-md mt-4">
                          <Heart className="h-4 w-4" />
                          <span>Wishlist ({wishlistItems.length})</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-xs text-gray-500 text-center">
                        © 2025 Hednor. All rights reserved.
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Slideout */}
      <CartSlideout />

      {/* Mobile Search */}
      <MobileSearch />

      {/* Auth Modal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}
