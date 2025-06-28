
import { ArrowLeft, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Size Guide</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Intro */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <Ruler className="h-12 w-12 text-hednor-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Fit</h2>
            <p className="text-gray-600">
              Use our comprehensive size guide to find the perfect fit for all our clothing categories.
            </p>
          </CardContent>
        </Card>

        {/* Size Tables */}
        <Tabs defaultValue="women" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="women">Women</TabsTrigger>
            <TabsTrigger value="men">Men</TabsTrigger>
            <TabsTrigger value="kids">Kids</TabsTrigger>
            <TabsTrigger value="shoes">Shoes</TabsTrigger>
          </TabsList>

          {/* Women's Sizes */}
          <TabsContent value="women" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Women's Clothing Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Size</th>
                        <th className="border border-gray-300 px-4 py-2">Bust (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Waist (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Hips (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Length (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">XS</td>
                        <td className="border border-gray-300 px-4 py-2">32-34</td>
                        <td className="border border-gray-300 px-4 py-2">24-26</td>
                        <td className="border border-gray-300 px-4 py-2">34-36</td>
                        <td className="border border-gray-300 px-4 py-2">15-16</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">S</td>
                        <td className="border border-gray-300 px-4 py-2">34-36</td>
                        <td className="border border-gray-300 px-4 py-2">26-28</td>
                        <td className="border border-gray-300 px-4 py-2">36-38</td>
                        <td className="border border-gray-300 px-4 py-2">16-17</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">M</td>
                        <td className="border border-gray-300 px-4 py-2">36-38</td>
                        <td className="border border-gray-300 px-4 py-2">28-30</td>
                        <td className="border border-gray-300 px-4 py-2">38-40</td>
                        <td className="border border-gray-300 px-4 py-2">17-18</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">L</td>
                        <td className="border border-gray-300 px-4 py-2">38-40</td>
                        <td className="border border-gray-300 px-4 py-2">30-32</td>
                        <td className="border border-gray-300 px-4 py-2">40-42</td>
                        <td className="border border-gray-300 px-4 py-2">18-19</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">XL</td>
                        <td className="border border-gray-300 px-4 py-2">40-42</td>
                        <td className="border border-gray-300 px-4 py-2">32-34</td>
                        <td className="border border-gray-300 px-4 py-2">42-44</td>
                        <td className="border border-gray-300 px-4 py-2">19-20</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">XXL</td>
                        <td className="border border-gray-300 px-4 py-2">42-44</td>
                        <td className="border border-gray-300 px-4 py-2">34-36</td>
                        <td className="border border-gray-300 px-4 py-2">44-46</td>
                        <td className="border border-gray-300 px-4 py-2">20-21</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Men's Sizes */}
          <TabsContent value="men" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Men's Clothing Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Size</th>
                        <th className="border border-gray-300 px-4 py-2">Chest (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Waist (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Length (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Shoulder (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">S</td>
                        <td className="border border-gray-300 px-4 py-2">36-38</td>
                        <td className="border border-gray-300 px-4 py-2">28-30</td>
                        <td className="border border-gray-300 px-4 py-2">26-27</td>
                        <td className="border border-gray-300 px-4 py-2">17-18</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">M</td>
                        <td className="border border-gray-300 px-4 py-2">38-40</td>
                        <td className="border border-gray-300 px-4 py-2">30-32</td>
                        <td className="border border-gray-300 px-4 py-2">27-28</td>
                        <td className="border border-gray-300 px-4 py-2">18-19</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">L</td>
                        <td className="border border-gray-300 px-4 py-2">40-42</td>
                        <td className="border border-gray-300 px-4 py-2">32-34</td>
                        <td className="border border-gray-300 px-4 py-2">28-29</td>
                        <td className="border border-gray-300 px-4 py-2">19-20</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">XL</td>
                        <td className="border border-gray-300 px-4 py-2">42-44</td>
                        <td className="border border-gray-300 px-4 py-2">34-36</td>
                        <td className="border border-gray-300 px-4 py-2">29-30</td>
                        <td className="border border-gray-300 px-4 py-2">20-21</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">XXL</td>
                        <td className="border border-gray-300 px-4 py-2">44-46</td>
                        <td className="border border-gray-300 px-4 py-2">36-38</td>
                        <td className="border border-gray-300 px-4 py-2">30-31</td>
                        <td className="border border-gray-300 px-4 py-2">21-22</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kids Sizes */}
          <TabsContent value="kids" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kids' Clothing Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Size</th>
                        <th className="border border-gray-300 px-4 py-2">Age</th>
                        <th className="border border-gray-300 px-4 py-2">Height (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Chest (inches)</th>
                        <th className="border border-gray-300 px-4 py-2">Waist (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">2-3Y</td>
                        <td className="border border-gray-300 px-4 py-2">2-3 Years</td>
                        <td className="border border-gray-300 px-4 py-2">34-37</td>
                        <td className="border border-gray-300 px-4 py-2">20-21</td>
                        <td className="border border-gray-300 px-4 py-2">19-20</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">3-4Y</td>
                        <td className="border border-gray-300 px-4 py-2">3-4 Years</td>
                        <td className="border border-gray-300 px-4 py-2">37-40</td>
                        <td className="border border-gray-300 px-4 py-2">21-22</td>
                        <td className="border border-gray-300 px-4 py-2">20-21</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">4-5Y</td>
                        <td className="border border-gray-300 px-4 py-2">4-5 Years</td>
                        <td className="border border-gray-300 px-4 py-2">40-43</td>
                        <td className="border border-gray-300 px-4 py-2">22-23</td>
                        <td className="border border-gray-300 px-4 py-2">21-22</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-semibold">5-6Y</td>
                        <td className="border border-gray-300 px-4 py-2">5-6 Years</td>
                        <td className="border border-gray-300 px-4 py-2">43-46</td>
                        <td className="border border-gray-300 px-4 py-2">23-24</td>
                        <td className="border border-gray-300 px-4 py-2">22-23</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">6-7Y</td>
                        <td className="border border-gray-300 px-4 py-2">6-7 Years</td>
                        <td className="border border-gray-300 px-4 py-2">46-49</td>
                        <td className="border border-gray-300 px-4 py-2">24-25</td>
                        <td className="border border-gray-300 px-4 py-2">23-24</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shoe Sizes */}
          <TabsContent value="shoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shoe Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Women's Shoes</h4>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2">UK Size</th>
                          <th className="border border-gray-300 px-3 py-2">EU Size</th>
                          <th className="border border-gray-300 px-3 py-2">US Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-gray-300 px-3 py-2">3</td><td className="border border-gray-300 px-3 py-2">36</td><td className="border border-gray-300 px-3 py-2">5.5</td></tr>
                        <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">4</td><td className="border border-gray-300 px-3 py-2">37</td><td className="border border-gray-300 px-3 py-2">6.5</td></tr>
                        <tr><td className="border border-gray-300 px-3 py-2">5</td><td className="border border-gray-300 px-3 py-2">38</td><td className="border border-gray-300 px-3 py-2">7.5</td></tr>
                        <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">6</td><td className="border border-gray-300 px-3 py-2">39</td><td className="border border-gray-300 px-3 py-2">8.5</td></tr>
                        <tr><td className="border border-gray-300 px-3 py-2">7</td><td className="border border-gray-300 px-3 py-2">40</td><td className="border border-gray-300 px-3 py-2">9.5</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Men's Shoes</h4>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2">UK Size</th>
                          <th className="border border-gray-300 px-3 py-2">EU Size</th>
                          <th className="border border-gray-300 px-3 py-2">US Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-gray-300 px-3 py-2">6</td><td className="border border-gray-300 px-3 py-2">40</td><td className="border border-gray-300 px-3 py-2">7</td></tr>
                        <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">7</td><td className="border border-gray-300 px-3 py-2">41</td><td className="border border-gray-300 px-3 py-2">8</td></tr>
                        <tr><td className="border border-gray-300 px-3 py-2">8</td><td className="border border-gray-300 px-3 py-2">42</td><td className="border border-gray-300 px-3 py-2">9</td></tr>
                        <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-2">9</td><td className="border border-gray-300 px-3 py-2">43</td><td className="border border-gray-300 px-3 py-2">10</td></tr>
                        <tr><td className="border border-gray-300 px-3 py-2">10</td><td className="border border-gray-300 px-3 py-2">44</td><td className="border border-gray-300 px-3 py-2">11</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Measuring Tips */}
        <Card>
          <CardHeader>
            <CardTitle>How to Measure Yourself</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">For Clothing:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Chest/Bust:</strong> Measure around the fullest part of your chest</li>
                  <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
                  <li>• <strong>Hips:</strong> Measure around the fullest part of your hips</li>
                  <li>• <strong>Length:</strong> Measure from shoulder to desired length</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Tips for Best Fit:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Use a flexible measuring tape</li>
                  <li>• Measure over thin clothing or undergarments</li>
                  <li>• Keep the tape snug but not tight</li>
                  <li>• When in doubt, size up for comfort</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
