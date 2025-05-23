import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Share2, MessageSquare, Bookmark } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link, useParams } from 'react-router-dom';

// This would come from an API or database in a real application
const blogPostsData = {
  1: {
    id: 1,
    title: 'How To Read Candlesticks In Forex Trading',
    content: `
      <p>If you want to be successful at forex trading, you have to understand candlestick charts. These charts tell a strong story about how prices change over time. They help traders understand market trends, momentum, and possible turns around. So how do you read charts when you trade forex? For those of you who have ever felt like those tiny bars on your screen were too much, don't worry! This guide will show you how to do everything step by step.</p>
      
      <h4>What Are Candlesticks in Forex Trading</h4>
      
      <p>Candlesticks are graphical representations of price movements within a specified time frame in the forex market. Each candlestick consists of four key parts: the opening price, the closing price, the highest price, and the lowest price during a given period. Together, these components form the candlestick body and its wicks (or shadows). These charts were first developed in Japan during the 18th century and have since become a staple tool in modern trading.</p>
      
      <h4>Understanding Candlestick Components</h4>
      
      <h4>The Body of the Candlestick</h4>
      <p>The body of a candlestick represents the difference between the opening and closing prices.</p>
      <ul>
        <li>A long body signals strong buying or selling pressure.</li>
        <li>A short body means little price movement or indecision in the market.</li>
      </ul>
      
      <h4>The Wick (Shadow) of the Candlestick</h4>
      <img src="/images/photo_1.jpg" alt="Hammer Pattern" class="my-6 rounded-lg w-full max-w-[700px] max-h-[400px] object-cover ml-0" />
      <p>The wick, also called the shadow, shows the highest and lowest prices during a trading session.</p>
      <ul>
        <li>If the top wick is long, it means that buyers tried to take control of the market by driving prices up at first. Even though buyers tried, sellers finally took back control and pushed the price back down until it closed lower than the high point.</li>
        <li>A long lower wick shows that buyers took over at first and pushed prices down a lot. But buyers jumped in and drove prices back up, despite their efforts. This showed that there was strong buying pressure and an attempt to take back control of the market.</li>
      </ul>
      
      <h4>Recognizing Different Candlestick Patterns</h4>
      
      <h4>Hammer and Inverted Hammer</h4>
      <p>A Hammer candlestick pattern has a small body and a long lower shadow. This shows that sellers pushed prices down at first, but buyers eventually took back control and drove prices back up. This pattern often means that there is a chance of a bullish turnaround, which means that the market's mood could soon change from bearish to bullish. The long lower wave shows that there was strong buying interest even though there was downward pressure. This could mean that the price will continue to rise. To be sure that this turnaround is real, traders often wait for bullish price action to follow.</p>
      
      <p>An Inverted Hammer is a type of candlestick pattern that looks a lot like a hammer but shows up after a decline. This means that even though the price has been going down, there is a change in pace as buyers get stronger. This pattern shows that the falling trend might be changing or slowing down, which could mean that bulls are starting to take control. Buyers pushed the price up during the session, as shown by the long upper shadow of the Inverted Hammer.</p>
      
      <p>However, the price was still close to the starting price at the end of the day, which indicates that sellers still had some control. But the pattern's general shape and setting point to a possible turning point, where more buying pressure could cause the trend to change.</p>
      
      <h4>Shooting Star</h4>
      <p>A Shooting Star is a type of candlestick design that has a small body and an upper wick that is long. This pattern usually appears after an increase. It means that even though the price hit a high point during the trading session, it was strongly rejected at that level. The long upper wick shows that buyers pushed the price up at first, but sellers finally took over and pushed it back down.</p>
      
      <p>So, the Shooting Star points to a possible bearish reversal, which means that the upward trend may be losing strength and a falling trend may follow. People think this pattern is more important when it shows up after a long period of going up because it shows a change in how the market feels.</p>
      
      <h4>Double Candlestick Patterns</h4>
      <img src="/images/photo_1.jpg" alt="Hammer Pattern" class="my-6 rounded-lg w-full max-w-[700px] max-h-[400px] object-cover ml-0" />
      <ul>
        <li>A Bullish Engulfing pattern occurs when a small bearish candle is followed by a larger bullish candle, signaling a strong uptrend.</li>
        <li>A Bearish Engulfing pattern is the opposite—a small bullish candle followed by a larger bearish one, indicating a downtrend.</li>
        <li>Tweezer Tops: form when two consecutive candles have almost identical high points, signaling a bearish reversal.</li>
        <li>Tweezer Bottoms happen when two candles have matching lows, hinting at a bullish reversal.</li>
      </ul>
      
      <h4>Bullish vs. Bearish Candlesticks</h4>
      <ul>
        <li>A bullish candlestick represents upward market movement. The body of the candlestick is colored green or white (depending on the chart's color scheme), and it shows that the closing price is higher than the opening price, indicating that buyers dominated the market during that time period. This pattern signals optimism and potential price increases.</li>
        <li>A bearish candlestick, typically shown in red or black, indicates that the closing price is lower than the opening price. This suggests that sellers were in control during that period, driving the price down. The longer the body of the candlestick, the stronger the bearish sentiment.</li>
      </ul>
      
      <h4>Common Candlestick Patterns Every Trader Should Know</h4>
      
      <h4>Doji</h4>
      <p>When the starting and closing prices are almost the same, a Doji candlestick shows up. It has a small body with long upper and lower shadows. This pattern shows that the market is stuck, with neither buyers nor sellers taking charge. This can often mean that the direction will change. The formation of a Doji can be seen as a sign that the current trend may be losing steam and that the market may be about to change direction.</p>
      
      <p>Before taking action, traders need to make sure the reversal is real by looking at the surrounding price action and other signs.</p>
      
      <h4>Using Candlestick Patterns with Other Indicators</h4>
      <p>To increase accuracy, combine candlestick patterns with:</p>
      <ul>
        <li>Moving Averages — Confirm trend direction.</li>
        <li>RSI (Relative Strength Index) — Identify overbought or oversold conditions.</li>
        <li>Bollinger Bands — Spot volatility and potential breakouts.</li>
      </ul>
      
      <h4>Common Mistakes Traders Make When Reading Candlesticks</h4>
      <ul>
        <li>Ignoring the overall trend — A bullish pattern in a strong downtrend might not mean a reversal.</li>
        <li>Forgetting confirmation — Always wait for additional signals before acting.</li>
        <li>Trading based on a single candle — Look at multiple timeframes for better accuracy.</li>
      </ul>
      
      <p>Candlestick charts are an essential tool in forex trading, providing insights into price movements, trend reversals, and market sentiment. By mastering these patterns, traders can make smarter, more confident trading decisions. However, always remember to combine candlestick analysis with other technical indicators for the best results. Happy trading!</p>
      
      <h4>FAQs</h4>
      
      <h4>1. What is the best candlestick pattern for forex trading?</h4>
      <p>There's no single best pattern, but engulfing patterns, Doji, and Morning/Evening Stars are among the most reliable.</p>
      
      <h4>2. How do I confirm a candlestick pattern's validity?</h4>
      <p>Use indicators like moving averages, RSI, and volume analysis to confirm patterns before making a trade.</p>
      
      <h4>3. Can I rely only on candlestick patterns for trading?</h4>
      <p>Not entirely. Candlesticks provide great insights, but combining them with support/resistance levels and trend analysis improves accuracy.</p>
      
      <h4>4. How long does it take to master reading candlesticks?</h4>
      <p>It depends on practice. With consistent study and back testing, most traders grasp the basics in a few months.</p>
      
      <h4>5. Do candlestick patterns work in all timeframes?</h4>
      <p>Yes, but their reliability increases in higher timeframes (e.g., 1-hour, 4-hour, or daily charts).</p>
    `,
    author: 'OLUMIDE',
    date: 'April 4, 2025',
    image: '/images/photo_3.jpg',
    category: 'trading',
    readTime: '4.5 mins'
  },
  2: {
    id: 2,
    title: 'Top 10 Best Forex Brokers in Nigeria (2025)',
    excerpt: 'Top 10 Best Forex Brokers in Nigeria (2025)',
    content: `
      <p>If you want to be successful at forex trading, you have to understand candlestick charts. These charts tell a strong story about how prices change over time. They help traders understand market trends, momentum, and possible turns around. So how do you read charts when you trade forex? For those of you who have ever felt like those tiny bars on your screen were too much, don't worry! This guide will show you how to do everything step by step.</p>
      
      <h4>What Are Candlesticks in Forex Trading</h4>
      
      <p>Candlesticks are graphical representations of price movements within a specified time frame in the forex market. Each candlestick consists of four key parts: the opening price, the closing price, the highest price, and the lowest price during a given period. Together, these components form the candlestick body and its wicks (or shadows). These charts were first developed in Japan during the 18th century and have since become a staple tool in modern trading.</p>
      
      <h4>Understanding Candlestick Components</h4>
      
      <h4>The Body of the Candlestick</h4>
      <p>The body of a candlestick represents the difference between the opening and closing prices.</p>
      <ul>
        <li>A long body signals strong buying or selling pressure.</li>
        <li>A short body means little price movement or indecision in the market.</li>
      </ul>
      
      <h4>The Wick (Shadow) of the Candlestick</h4>
      <img src="/images/photo_1.jpg" alt="Hammer Pattern" class="my-6 rounded-lg w-full max-w-[700px] max-h-[400px] object-cover ml-0" />
      <p>The wick, also called the shadow, shows the highest and lowest prices during a trading session.</p>
      <ul>
        <li>If the top wick is long, it means that buyers tried to take control of the market by driving prices up at first. Even though buyers tried, sellers finally took back control and pushed the price back down until it closed lower than the high point.</li>
        <li>A long lower wick shows that buyers took over at first and pushed prices down a lot. But buyers jumped in and drove prices back up, despite their efforts. This showed that there was strong buying pressure and an attempt to take back control of the market.</li>
      </ul>
      
      <h4>Recognizing Different Candlestick Patterns</h4>
      
      <h4>Hammer and Inverted Hammer</h4>
      <p>A Hammer candlestick pattern has a small body and a long lower shadow. This shows that sellers pushed prices down at first, but buyers eventually took back control and drove prices back up. This pattern often means that there is a chance of a bullish turnaround, which means that the market's mood could soon change from bearish to bullish. The long lower wave shows that there was strong buying interest even though there was downward pressure. This could mean that the price will continue to rise. To be sure that this turnaround is real, traders often wait for bullish price action to follow.</p>
      
      <p>An Inverted Hammer is a type of candlestick pattern that looks a lot like a hammer but shows up after a decline. This means that even though the price has been going down, there is a change in pace as buyers get stronger. This pattern shows that the falling trend might be changing or slowing down, which could mean that bulls are starting to take control. Buyers pushed the price up during the session, as shown by the long upper shadow of the Inverted Hammer.</p>
      
      <p>However, the price was still close to the starting price at the end of the day, which indicates that sellers still had some control. But the pattern's general shape and setting point to a possible turning point, where more buying pressure could cause the trend to change.</p>
      
      <h4>Shooting Star</h4>
      <p>A Shooting Star is a type of candlestick design that has a small body and an upper wick that is long. This pattern usually appears after an increase. It means that even though the price hit a high point during the trading session, it was strongly rejected at that level. The long upper wick shows that buyers pushed the price up at first, but sellers finally took over and pushed it back down.</p>
      
      <p>So, the Shooting Star points to a possible bearish reversal, which means that the upward trend may be losing strength and a falling trend may follow. People think this pattern is more important when it shows up after a long period of going up because it shows a change in how the market feels.</p>
      
      <h4>Double Candlestick Patterns</h4>
      <img src="/images/photo_1.jpg" alt="Hammer Pattern" class="my-6 rounded-lg w-full max-w-[700px] max-h-[400px] object-cover ml-0" />
      <ul>
        <li>A Bullish Engulfing pattern occurs when a small bearish candle is followed by a larger bullish candle, signaling a strong uptrend.</li>
        <li>A Bearish Engulfing pattern is the opposite—a small bullish candle followed by a larger bearish one, indicating a downtrend.</li>
        <li>Tweezer Tops: form when two consecutive candles have almost identical high points, signaling a bearish reversal.</li>
        <li>Tweezer Bottoms happen when two candles have matching lows, hinting at a bullish reversal.</li>
      </ul>
      
      <h4>Bullish vs. Bearish Candlesticks</h4>
      <ul>
        <li>A bullish candlestick represents upward market movement. The body of the candlestick is colored green or white (depending on the chart's color scheme), and it shows that the closing price is higher than the opening price, indicating that buyers dominated the market during that time period. This pattern signals optimism and potential price increases.</li>
        <li>A bearish candlestick, typically shown in red or black, indicates that the closing price is lower than the opening price. This suggests that sellers were in control during that period, driving the price down. The longer the body of the candlestick, the stronger the bearish sentiment.</li>
      </ul>
      
      <h4>Common Candlestick Patterns Every Trader Should Know</h4>
      
      <h4>Doji</h4>
      <p>When the starting and closing prices are almost the same, a Doji candlestick shows up. It has a small body with long upper and lower shadows. This pattern shows that the market is stuck, with neither buyers nor sellers taking charge. This can often mean that the direction will change. The formation of a Doji can be seen as a sign that the current trend may be losing steam and that the market may be about to change direction.</p>
      
      <p>Before taking action, traders need to make sure the reversal is real by looking at the surrounding price action and other signs.</p>
      
      <h4>Using Candlestick Patterns with Other Indicators</h4>
      <p>To increase accuracy, combine candlestick patterns with:</p>
      <ul>
        <li>Moving Averages — Confirm trend direction.</li>
        <li>RSI (Relative Strength Index) — Identify overbought or oversold conditions.</li>
        <li>Bollinger Bands — Spot volatility and potential breakouts.</li>
      </ul>
      
      <h4>Common Mistakes Traders Make When Reading Candlesticks</h4>
      <ul>
        <li>Ignoring the overall trend — A bullish pattern in a strong downtrend might not mean a reversal.</li>
        <li>Forgetting confirmation — Always wait for additional signals before acting.</li>
        <li>Trading based on a single candle — Look at multiple timeframes for better accuracy.</li>
      </ul>
      
      <p>Candlestick charts are an essential tool in forex trading, providing insights into price movements, trend reversals, and market sentiment. By mastering these patterns, traders can make smarter, more confident trading decisions. However, always remember to combine candlestick analysis with other technical indicators for the best results. Happy trading!</p>
      
      <h4>FAQs</h4>
      
      <h4>1. What is the best candlestick pattern for forex trading?</h4>
      <p>There's no single best pattern, but engulfing patterns, Doji, and Morning/Evening Stars are among the most reliable.</p>
      
      <h4>2. How do I confirm a candlestick pattern's validity?</h4>
      <p>Use indicators like moving averages, RSI, and volume analysis to confirm patterns before making a trade.</p>
      
      <h4>3. Can I rely only on candlestick patterns for trading?</h4>
      <p>Not entirely. Candlesticks provide great insights, but combining them with support/resistance levels and trend analysis improves accuracy.</p>
      
      <h4>4. How long does it take to master reading candlesticks?</h4>
      <p>It depends on practice. With consistent study and back testing, most traders grasp the basics in a few months.</p>
      
      <h4>5. Do candlestick patterns work in all timeframes?</h4>
      <p>Yes, but their reliability increases in higher timeframes (e.g., 1-hour, 4-hour, or daily charts).</p>
    `,
    author: 'OLUMIDE',
    date: 'April 2, 2025',
    image: '/images/photo_2.jpg',
    category: 'brokers'
  },
  3: {
    id: 3,
    title: 'How FirePipsFX Helps Traders Succeed in Prop Firm Challenges',
    excerpt: 'How FirePipsFX Helps Traders Succeed in Prop Firm Challenges',
    author: 'DEBORAH',
    date: 'March 21, 2025',
    image: '/images/photo_2.jpg',
    category: 'prop-firms'
  },
  4: {
    id: 4,
    title: 'Top Hidden Rules of Prop Firms That Nobody Talks About',
    excerpt: 'Top Hidden Rules of Prop Firms That Nobody Talks About',
    author: 'DEBORAH',
    date: 'March 20, 2025',
    image: '/images/photo_3.jpg',
    category: 'prop-firms'
  },
  5:{
    id: 5,
    title: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    excerpt: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    author: 'DEBORAH',
    date: 'March 20, 2025',
    image: '/images/photo_3.jpg',
    category: 'trading-strategies'
  },
  6: {
    id: 6,
    title: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    excerpt: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    author: 'DEBORAH',
    date: 'March 20, 2025',
    image: '/images/photo_3.jpg',
    category: 'trading-strategies'
  },
  7: {
    id: 7,
    title: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    excerpt: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    author: 'DEBORAH',
    date: 'March 20, 2025',
    image: '/images/photo_3.jpg',
    category: 'trading-strategies'
  },
  8: {
    id: 8,
    title: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    excerpt: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    author: 'DEBORAH',
    date: 'March 20, 2025',
    image: '/images/photo_3.jpg',
    category: 'trading-strategies'
  },
  9: {
    id: 9,
    title: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    excerpt: 'Scalping vs. Swing Trading: Which Strategy Works Best for Prop Firms?',
    author: 'DEBORAH',
    date: 'March 20, 2025',
    image: '/images/photo_3.jpg',
    category: 'trading-strategies'
  },
  // Other blog posts would be defined here...
};

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API fetch with timeout
    setTimeout(() => {
      setPost(blogPostsData[id] || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentName.trim() && commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        name: commentName,
        text: commentText,
        date: new Date().toLocaleDateString()
      };
      setComments([...comments, newComment]);
      setCommentName('');
      setCommentText('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-lg">Blog post not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto w-full px-2 py-2 mb-16 mt-12">
        {/* Back button */}
        <Link to="/blog" className="flex items-center text-green-600 mb-6 hover:text-green-700">
          <ArrowLeft size={18} className="mr-2" />
          Back to blog
        </Link>
        
        {/* Post header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center">
                <div className="bg-green-200 w-8 h-8 rounded-full mr-2 flex items-center justify-center font-bold text-green-800">
                    {post.author.charAt(0).toUpperCase()}
                </div>
              <span className="text-green-600 font-medium">{post.author}</span>
            </div>
            <div className="text-gray-500 text-sm">{post.date}</div>
            <div className="text-gray-500 text-sm">{post.readTime} read</div>
          </div>
          
          {/*<div className="flex gap-4">
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Share2 size={16} className="mr-1" />
              Share
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Bookmark size={16} className="mr-1" />
              Save
            </button>
          </div>*/}
        </div>
        
        {/* Featured image */}
        <div className="mb-8">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>
        
        {/* Post content */}
        <div 
          className="text-sm leading-relaxed space-y-4 mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Call to action */}
        <div className="bg-gray-100 p-6 rounded-lg mb-12">
          <h3 className="text-xl font-bold mb-2">Are you ready to take your trading to the next level?</h3>
          <p className="mb-4">Join Elite Trading Hub today and start your journey toward becoming a successful funded trader!</p>
          <Link 
            to="#"
            style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderBottomRightRadius: 0,
            }}
            className="inline-block bg-green-600 text-white px-6 py-3 border border-green-600 rounded-xl font-medium hover:bg-green-700 transition"
          >
            Join Elite Trading Hub
          </Link>
        </div>
        
        {/* Comments section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
          
          {comments.length > 0 ? (
            <div className="space-y-6 mb-8">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-green-400 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-200 w-8 h-8 rounded-full mr-2 flex items-center justify-center font-bold text-green-800">
                        {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{comment.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">{comment.date}</span>
                  </div>
                  <p className="text-gray-700 text-xs">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No comments yet. Be the first to comment!</p>
          )}
          
          <div>
            <h4 className="text-xl font-bold mb-4">Add a comment</h4>
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium">
                  What do we call you?
                </label>
                <input
                  type="text"
                  id="name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                    style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                  className="w-full px-4 py-2 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter your display name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block mb-2 text-sm font-medium">
                  Write your comment
                </label>
                <textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                    style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                  className="w-full px-4 py-2 border border-green-400 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Comment goes here..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                    style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderBottomRightRadius: 0,
                    }}
                className="flex items-center bg-green-200 text-black px-4 py-3 border border-green-200 rounded-xl font-medium hover:bg-green-300 transition"
              >
                <MessageSquare size={16}                 
                className="mr-2" />
                Upload comment
              </button>
            </form>
          </div>
        </div>
        
        {/* Related posts */} 
        <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Also Read</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(blogPostsData)
            .filter(relatedPost => 
                relatedPost.id > post.id
            )
            .sort((a, b) => a.id - b.id)
            .slice(0, 3) // Limit to 3
            .map(relatedPost => (
                <div 
                key={relatedPost.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                <img 
                    src={relatedPost.image || '/images/default.jpg'} // fallback image if needed
                    alt={relatedPost.title} 
                    className="w-full h-40 object-cover"
                />
                <div className="p-4">
                    <h4 className="font-bold mb-2">{relatedPost.title}</h4>
                    <Link
                    to={`/blog/${relatedPost.id}`}
                    className="text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                    Read more
                    <ArrowRight size={16} className="ml-1" />
                    </Link>
                </div>
            </div>
            ))}
        </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}