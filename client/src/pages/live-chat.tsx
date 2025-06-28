
import { ArrowLeft, Send, Bot, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface EnquiryForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Hednor customer support. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState<EnquiryForm>({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('order') && message.includes('track')) {
      return 'You can track your order by visiting the "My Orders" section in your account or using the tracking link sent to your email. Do you need help with a specific order number?';
    }
    
    if (message.includes('return') || message.includes('refund')) {
      return 'Our return policy allows returns within 30 days of purchase. Items must be in original condition with tags. Would you like me to help you initiate a return?';
    }
    
    if (message.includes('size') || message.includes('sizing')) {
      return 'You can find our size guide on each product page. If you need personalized sizing advice, I can connect you with our sizing expert. What product are you looking at?';
    }
    
    if (message.includes('payment') || message.includes('cod')) {
      return 'We accept credit/debit cards, UPI, net banking, and Cash on Delivery (for orders below ₹5000). Is there a specific payment issue you\'re facing?';
    }
    
    if (message.includes('shipping') || message.includes('delivery')) {
      return 'Standard shipping takes 3-5 business days, Express shipping takes 1-2 days. Shipping is free on orders above ₹1999. Where would you like your order delivered?';
    }
    
    if (message.includes('discount') || message.includes('coupon')) {
      return 'Check out our current offers on the homepage! We also have a 10% student discount and regular newsletter offers. Would you like me to help you apply a discount code?';
    }
    
    if (message.includes('exchange')) {
      return 'We offer free exchanges within 30 days. The item should be in original condition. Would you like to exchange an item you recently purchased?';
    }
    
    if (message.includes('human') || message.includes('agent')) {
      return 'I\'ll connect you with a human agent. Please fill out the enquiry form and our team will get back to you within 2 hours during business hours.';
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hi there! I\'m here to help with any questions about orders, returns, sizing, or anything else. What can I assist you with?';
    }
    
    return 'I understand your concern. For more specific help, I can connect you with our human support team. Would you like to fill out an enquiry form or try asking your question differently?';
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the enquiry to your backend
    toast({
      title: "Enquiry Submitted!",
      description: "Our team will get back to you within 2 hours during business hours.",
    });
    
    setEnquiryForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setShowEnquiryForm(false);
  };

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEnquiryForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Live Chat Support</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-hednor-gold" />
                  Hednor Support Bot
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Available 24/7 • Human agents available Mon-Fri 9AM-6PM
                </p>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-hednor-gold' 
                          : 'bg-gray-200'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-hednor-dark" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-hednor-gold text-hednor-dark'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-hednor-gold hover:bg-yellow-500 text-hednor-dark"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => setShowEnquiryForm(true)}
                    className="text-hednor-gold"
                  >
                    Need to speak with a human agent? Submit an enquiry
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Track My Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Return/Exchange
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Size Guide
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Payment Help
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-hednor-gold" />
                  <div>
                    <p className="font-medium">+91 12345 67890</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-hednor-gold" />
                  <div>
                    <p className="font-medium">support@hednor.com</p>
                    <p className="text-sm text-gray-600">24-48 hour response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enquiry Form Modal */}
        {showEnquiryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Contact Human Support</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you within 2 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={enquiryForm.name}
                        onChange={handleEnquiryChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={enquiryForm.email}
                        onChange={handleEnquiryChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={enquiryForm.phone}
                      onChange={handleEnquiryChange}
                      placeholder="+91 12345 67890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={enquiryForm.subject}
                      onChange={handleEnquiryChange}
                      required
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={enquiryForm.message}
                      onChange={handleEnquiryChange}
                      required
                      placeholder="Please describe your issue in detail..."
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="flex-1 bg-hednor-gold hover:bg-yellow-500 text-hednor-dark"
                    >
                      Submit Enquiry
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEnquiryForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
