import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  courseTitle?: string;
}

// Blog card component
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  // Clean up author name by removing leading ">"
  const cleanAuthor = post.author.startsWith(">") ? post.author.slice(1) : post.author;

  // Format the date relative to the current time (May 23, 2025, 02:41 AM EAT)
  const formatRelativeDate = (dateString: string) => {
    const postDate = new Date(dateString);
    const now = new Date("2025-05-23T02:41:00.000+03:00"); // EAT is UTC+3
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Posted ${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `Posted ${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `Posted ${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }
  };

  // Trim repetitive excerpt to a single instance and limit length
  const cleanExcerpt = (excerpt: string) => {
    const firstSentence = excerpt.split(" ").slice(0, 20).join(" "); // Limit to ~20 words
    return excerpt.includes(firstSentence + " " + firstSentence)
      ? firstSentence + "..."
      : firstSentence + (excerpt.length > firstSentence.length ? "..." : "");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
      <div className="relative">
        <img
          src={`${import.meta.env.VITE_API_URL}${post.image}`} // Prepend API_URL to image path
          alt={post.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/placeholder.jpg"; // Fallback if image fails to load
          }}
        />
        {post.category === "events" && (
          <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs">
            COMMUNITY
          </div>
        )}
      </div>

      <div className="p-4">
        {(cleanAuthor || post.date) && (
          <div className="flex justify-between items-center mb-2">
            {cleanAuthor && (
              <p className="text-green-500 text-sm font-medium">{cleanAuthor}</p>
            )}
            {post.date && (
              <p className="text-gray-500 text-xs">{formatRelativeDate(post.date)}</p>
            )}
          </div>
        )}

        <h3 className="font-bold text-lg mb-2">{post.title}</h3>

        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4">{cleanExcerpt(post.excerpt)}</p>
        )}

        {post.excerpt && (
          <Link
            to={`/blog/${post.id}`}
            style={{
              backgroundColor: "rgb(0, 128, 0)",
              borderColor: "rgb(0, 128, 0)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderBottomRightRadius: 0,
            }}
            className="w-full max-w-[170px] bg-green-500 text-white px-4 py-2 rounded-2xl flex items-center hover:bg-green-600 transition"
          >
            Read full story
            <ArrowRight size={16} className="ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";
        const response = await fetch(`${API_URL}/api/blogs/public`);

        if (!response.ok) {
          throw new Error(`Failed to fetch blog posts: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw blog API response:", JSON.stringify(data, null, 2));

        if (Array.isArray(data) && data.length > 0) {
          const formattedPosts = data.map((item) => ({
            id: item.id,
            title: item.title || "Untitled",
            excerpt: item.excerpt || "",
            author: item.author || "Unknown",
            date: item.date || "",
            image: item.image || "",
            category: item.category || "",
            courseTitle: item.courseTitle || "", // Include courseTitle
          }));
          setBlogPosts(formattedPosts);
        } else {
          throw new Error("No blog data received");
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError(error.message);
        // Fallback to sample data
        setBlogPosts([
          {
            id: 1,
            title: "How To Read Candlesticks In Forex Trading",
            excerpt: "How To Read Candlesticks In Forex Trading",
            author: "OLUMIDE",
            date: "April 4, 2025",
            image: "/images/photo_3.jpg",
            category: "trading",
          },
          {
            id: 2,
            title: "Top 10 Best Forex Brokers in Nigeria (2025)",
            excerpt: "Top 10 Best Forex Brokers in Nigeria (2025)",
            author: "OLUMIDE",
            date: "April 2, 2025",
            image: "/images/photo_2.jpg",
            category: "brokers",
          },
          {
            id: 3,
            title: "How FirePipsFX Helps Traders Succeed in Prop Firm Challenges",
            excerpt: "How FirePipsFX Helps Traders Succeed in Prop Firm Challenges",
            author: "DEBORAH",
            date: "March 21, 2025",
            image: "/images/photo_2.jpg",
            category: "prop-firms",
          },
          {
            id: 4,
            title: "Top Hidden Rules of Prop Firms That Nobody Talks About",
            excerpt: "Top Hidden Rules of Prop Firms That Nobody Talks About",
            author: "DEBORAH",
            date: "March 20, 2025",
            image: "/images/photo_3.jpg",
            category: "prop-firms",
          },
        ]);
        console.log("Using fallback blog posts:", JSON.stringify(blogPosts, null, 2));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-65xl mx-auto px-8 py-0 mb-16">
        <h1 className="text-4xl font-bold mb-8">Elite Trading Blog</h1>

        {loading ? (
          <div className="text-center text-gray-600">
            <svg
              className="animate-spin h-5 w-5 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Loading blog posts...
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : blogPosts.length === 0 ? (
          <p className="text-gray-600">No blog posts available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}