
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommunityCard from '@/components/CommunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, TrendingUp, MessagesSquare, Users, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample community data
const communityThreads = [
  {
    id: "1",
    title: "How to identify market trends early?",
    author: "TradingPro",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    replies: 24,
    lastActivity: "2 hours ago",
    previewText: "I've been studying various indicators to spot market trends before they fully develop. I'd love to hear what combinations of indicators others are using to get ahead of market movements.",
    category: "Strategies"
  },
  {
    id: "2",
    title: "My journey from $1k to $10k trading account",
    author: "GrowthInvestor",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    replies: 56,
    lastActivity: "1 day ago",
    previewText: "I wanted to share my trading journey over the past year and the key lessons I've learned. It wasn't easy but with proper risk management and consistency, I managed to grow my account 10x.",
    category: "Success Stories",
    isLocked: true
  },
  {
    id: "3",
    title: "Understanding volume analysis for day trading",
    author: "DayTraderX",
    authorAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    replies: 18,
    lastActivity: "3 hours ago",
    previewText: "Volume is one of the most underrated indicators in day trading. I've been developing a strategy that focuses primarily on volume patterns and would like to share some insights.",
    category: "Day Trading"
  },
  {
    id: "4",
    title: "Weekly market recap - April 2023",
    author: "MarketAnalyst",
    authorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    replies: 13,
    lastActivity: "6 hours ago",
    previewText: "Let's discuss the major market moves of this week, key economic data releases, and what to watch for next week. I'm seeing some interesting setups in tech and energy sectors.",
    category: "Market Analysis"
  },
  {
    id: "5",
    title: "Best brokers for options trading in 2023",
    author: "OptionsTrader",
    authorAvatar: "https://randomuser.me/api/portraits/men/15.jpg",
    replies: 42,
    lastActivity: "2 days ago",
    previewText: "I'm looking to switch brokers for my options trading. Which platforms offer the best combination of low fees, good fills, and advanced options analytics tools?",
    category: "Brokers"
  },
  {
    id: "6",
    title: "Risk management techniques that saved my account",
    author: "SafeTrader",
    authorAvatar: "https://randomuser.me/api/portraits/women/10.jpg",
    replies: 37,
    lastActivity: "1 day ago",
    previewText: "After almost blowing up my account twice, I've developed a strict risk management system that has completely transformed my trading. Here's what I learned the hard way.",
    category: "Risk Management"
  },
  {
    id: "7",
    title: "Technical indicators that actually work",
    author: "ChartWizard",
    authorAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    replies: 29,
    lastActivity: "12 hours ago",
    previewText: "After years of testing, I've narrowed down to 5 technical indicators that provide consistent edge in the markets. Let's discuss which indicators you've found most reliable.",
    category: "Technical Analysis",
    isLocked: true
  },
  {
    id: "8",
    title: "Tips for trading during high volatility",
    author: "VolTrader",
    authorAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    replies: 19,
    lastActivity: "4 hours ago",
    previewText: "Market volatility has been increasing lately. I'd like to share some approaches for adjusting your trading style during these conditions and hear how others adapt.",
    category: "Volatility"
  }
];

// Popular categories
const popularCategories = [
  { name: "Technical Analysis", count: 128, icon: TrendingUp },
  { name: "Day Trading", count: 95, icon: Clock },
  { name: "Risk Management", count: 84, icon: MessagesSquare },
  { name: "Strategies", count: 76, icon: Users },
];

const Community = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-tradingblue-600 to-tradingblue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Trading Community</h1>
              <p className="text-xl text-blue-100 mb-8">
                Connect with fellow traders, share insights, ask questions, and learn from the experiences of others.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white rounded-lg flex overflow-hidden shadow-lg flex-grow">
                  <Input
                    type="text"
                    placeholder="Search discussions..."
                    className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button className="rounded-none">
                    <Search className="h-4 w-4 mr-2" /> Search
                  </Button>
                </div>
                <Button className="bg-white text-tradingblue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" /> New Post
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main threads */}
            <div className="lg:w-3/4">
              <Tabs defaultValue="trending" className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <TabsList>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="popular">Most Discussed</TabsTrigger>
                    <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="trending">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {communityThreads.map(thread => (
                      <CommunityCard key={thread.id} {...thread} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="recent">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...communityThreads]
                      .sort((a, b) => a.lastActivity.localeCompare(b.lastActivity))
                      .map(thread => (
                        <CommunityCard key={thread.id} {...thread} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="popular">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...communityThreads]
                      .sort((a, b) => b.replies - a.replies)
                      .map(thread => (
                        <CommunityCard key={thread.id} {...thread} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="unanswered">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...communityThreads]
                      .filter(thread => thread.replies < 5)
                      .map(thread => (
                        <CommunityCard key={thread.id} {...thread} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/4 space-y-6">
              {/* Community stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members</span>
                      <span className="font-semibold">15,243</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discussions</span>
                      <span className="font-semibold">3,872</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comments</span>
                      <span className="font-semibold">28,941</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Online Now</span>
                      <span className="font-semibold text-tradinggreen-600">142</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Popular categories */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Popular Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-tradingblue-50 flex items-center justify-center mr-3">
                            <category.icon className="h-4 w-4 text-tradingblue-600" />
                          </div>
                          <span className="text-gray-800">{category.name}</span>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Top contributors */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communityThreads
                      .slice(0, 5)
                      .map((thread, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img 
                            src={thread.authorAvatar} 
                            alt={thread.author} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{thread.author}</p>
                            <p className="text-xs text-gray-500">{5 + index * 8} posts</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Community rules */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-tradingblue-600 font-bold mr-2">1.</span>
                      <span>Be respectful and helpful to fellow traders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-tradingblue-600 font-bold mr-2">2.</span>
                      <span>No spam or self-promotion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-tradingblue-600 font-bold mr-2">3.</span>
                      <span>Provide sources for market claims</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-tradingblue-600 font-bold mr-2">4.</span>
                      <span>No financial advice - share ideas, not directives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-tradingblue-600 font-bold mr-2">5.</span>
                      <span>Use appropriate categories for your posts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
