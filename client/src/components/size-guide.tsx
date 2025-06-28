import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SizeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  const mensSizes = [
    { size: "S", chest: "36-38", waist: "30-32", hip: "36-38" },
    { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
    { size: "L", chest: "40-42", waist: "34-36", hip: "40-42" },
    { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44" },
    { size: "XXL", chest: "44-46", waist: "38-40", hip: "44-46" },
  ];

  const womensSizes = [
    { size: "XS", bust: "32-34", waist: "24-26", hip: "34-36" },
    { size: "S", bust: "34-36", waist: "26-28", hip: "36-38" },
    { size: "M", bust: "36-38", waist: "28-30", hip: "38-40" },
    { size: "L", bust: "38-40", waist: "30-32", hip: "40-42" },
    { size: "XL", bust: "40-42", waist: "32-34", hip: "42-44" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-hednor-gold border-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark">
          <Ruler className="h-4 w-4 mr-2" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Size Guide</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="men" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="men">Men</TabsTrigger>
            <TabsTrigger value="women">Women</TabsTrigger>
          </TabsList>

          <TabsContent value="men" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-lg mb-2">Men's Clothing Size Chart</h3>
              <p className="text-sm text-gray-600">All measurements are in inches</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-hednor-gold/20">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Size</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Chest</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Waist</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {mensSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">{row.size}</td>
                      <td className="border border-gray-300 p-3">{row.chest}</td>
                      <td className="border border-gray-300 p-3">{row.waist}</td>
                      <td className="border border-gray-300 p-3">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="women" className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-lg mb-2">Women's Clothing Size Chart</h3>
              <p className="text-sm text-gray-600">All measurements are in inches</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-hednor-gold/20">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Size</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Bust</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Waist</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {womensSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">{row.size}</td>
                      <td className="border border-gray-300 p-3">{row.bust}</td>
                      <td className="border border-gray-300 p-3">{row.waist}</td>
                      <td className="border border-gray-300 p-3">{row.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">How to Measure:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• <strong>Chest/Bust:</strong> Measure around the fullest part</li>
            <li>• <strong>Waist:</strong> Measure around the narrowest part</li>
            <li>• <strong>Hip:</strong> Measure around the fullest part</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}