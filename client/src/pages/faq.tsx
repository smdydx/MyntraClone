
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";
import { useState } from "react";

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setOpenItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const faqs = [
    {
      id: "shipping",
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within India. Express shipping takes 1-2 business days. International shipping is currently not available."
    },
    {
      id: "returns",
      question: "What is your return policy?",
      answer: "We offer 30-day returns for most items. Items must be in original condition with tags attached. Some items like underwear and swimwear are not returnable for hygiene reasons."
    },
    {
      id: "sizing",
      question: "How do I find the right size?",
      answer: "Use our size guide available on each product page. If you're between sizes, we recommend sizing up. You can also contact our customer support for personalized sizing advice."
    },
    {
      id: "payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery (COD) for orders below ₹5000."
    },
    {
      id: "tracking",
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking link via SMS and email. You can also track your order by logging into your account and going to 'My Orders'."
    },
    {
      id: "exchange",
      question: "Can I exchange an item?",
      answer: "Yes, we offer exchanges within 30 days of purchase. The item must be in original condition. Exchange shipping is free for the first exchange."
    },
    {
      id: "discounts",
      question: "Do you offer student discounts?",
      answer: "Yes, we offer 10% student discount with valid student ID verification. Sign up for our newsletter to get notified about special offers and sales."
    },
    {
      id: "care",
      question: "How should I care for my clothes?",
      answer: "Care instructions are provided on the product label and description. Generally, we recommend washing in cold water and air drying to maintain quality and color."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-hednor-gold">Home</Link>
              <span>/</span>
              <span>FAQ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">How can we help you?</CardTitle>
            <p className="text-gray-600">
              Find answers to commonly asked questions. Can't find what you're looking for? 
              <Link href="/contact" className="text-hednor-gold hover:underline ml-1">
                Contact our support team
              </Link>
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <Collapsible>
                <CollapsibleTrigger 
                  className="w-full"
                  onClick={() => toggleItem(faq.id)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      {faq.question}
                    </h3>
                    {openItems.includes(faq.id) ? (
                      <Minus className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-500" />
                    )}
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Live Chat</h4>
                <p className="text-gray-600 mb-2">Chat with our support team</p>
                <Link href="/live-chat">
                  <Button className="bg-hednor-gold hover:bg-yellow-500 text-hednor-dark">
                    Start Chat
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
                <p className="text-gray-600 mb-2">support@hednor.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Phone Support</h4>
                <p className="text-gray-600 mb-2">+91 12345 67890</p>
                <p className="text-sm text-gray-500">Mon-Fri: 9AM-6PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
