import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardFooter from "@/components/DashboardFooter";
import { useAuth } from "../context/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COMPLETION_THRESHOLD = 90;

const getVideoType = (videoUrl: string | null): "youtube" | "html5" | "unknown" => {
  if (!videoUrl) return "unknown";
  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) return "youtube";
  if (videoUrl.startsWith("/") || videoUrl.startsWith("http")) return "html5";
  return "unknown";
};

const extractYouTubeVideoId = (url: string | null): string | null => {
  if (!url) return null;
  const match =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/youtube\.com\/embed\/([^?]+)/);
  return match ? match[1] : null;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Video {
  id: number;
  title: string;
  source: string;
  isLocal: boolean;
  access: string;
  views: number;
  order: number | null;
  courseId: number;
}

interface Note {
  id: number;
  title: string;
  source: string;
  isLocal: boolean;
  type: string;
  author: string;
  access: string;
  courseId: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  publishedWhen: string;
  author: string;
  level: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptionId: number;
  CourseVideos: Video[];
  CourseNotes: Note[];
}

interface FormattedCourse {
  id: number;
  documentId?: string;
  title: string;
  slug?: string;
  description: string;
  image: string;
  videos: Video[];
  notes: Note[];
  price: number | null;
  isFree: boolean | null;
  publishedWhen: string | null;
  instructor: string;
  level: string;
  levelNumber: number;
  uploadDate: string;
  rating: number;
  color: string;
  modules: any[];
  nextCourse: any | null;
  instructorAvatar: string;
  archived: boolean;
}

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = parseInt(id || "0", 10);

  const [courses, setCourses] = useState<FormattedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<FormattedCourse | null>(null);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [videoType, setVideoType] = useState<"youtube" | "html5" | "unknown">("unknown");
  const [pdfError, setPdfError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCourseFinished, setIsCourseFinished] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [percentageWatched, setPercentageWatched] = useState(0);
  const [youtubeApiReady, setYoutubeApiReady] = useState(false);
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/user/courses/free`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);

        const data: Course[] = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        const formattedCourses: FormattedCourse[] = data.map((course: Course) => ({
          id: course.id,
          documentId: course.id.toString(),
          title: course.title?.replace("Begginers", "Beginners").replace("Intewrmidiate", "Intermediate") || "Untitled Course",
          slug: course.title?.toLowerCase().replace(/\s+/g, "-") || "untitled-course",
          description: course.description?.replace("Begginers", "Beginners").replace("Intewrmidiate", "Intermediate") || "No description available",
          image: course.thumbnail ? `${API_URL}${course.thumbnail}` : "/images/course_card.jpeg",
          videos: Array.isArray(course.CourseVideos)
            ? course.CourseVideos.map((video: Video) => ({
                ...video,
                source: video.isLocal ? `${API_URL}${video.source}` : video.source,
              })).sort((a: Video, b: Video) => (a.order || a.id) - (b.order || b.id))
            : [],
          notes: Array.isArray(course.CourseNotes)
            ? course.CourseNotes.map((note: Note) => ({
                ...note,
                source: `${API_URL}${note.source}`,
              })).sort((a: Note, b: Note) => a.id - b.id)
            : [],
          price: null,
          isFree: true,
          publishedWhen: course.publishedWhen,
          instructor: course.author || "Unknown Instructor",
          level: course.level || "Beginner",
          levelNumber: course.level === "Intermediate" ? 1 : course.level === "Advanced" ? 2 : 0,
          uploadDate: course.createdAt || new Date().toISOString(),
          rating: 0,
          color: course.level === "Intermediate" ? "#D69E2E" : course.level === "Advanced" ? "#9F1239" : "#3182CE",
          modules: [],
          nextCourse: null,
          instructorAvatar: "/images/avatar.png",
          archived: course.archived, // Add this
        }));

        setCourses(formattedCourses);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.id) fetchCourses();
    else {
      setLoading(false);
      setError("Authentication required");
      toast.error("Please log in to access courses");
    }
  }, [token, user?.id, API_URL]);

  // Set course and initial video
  useEffect(() => {
    if (!loading && courses.length > 0) {
      let foundCourse = courses.find((c) => c.id === numericId);
      if (!foundCourse) {
        const targetDocumentId = localStorage.getItem("targetDocumentId");
        if (targetDocumentId) foundCourse = courses.find((c) => c.documentId === targetDocumentId);
      }

      if (foundCourse) {
        setCourse(foundCourse);
        setCourseInfo({
          id: foundCourse.id,
          title: foundCourse.title,
          description: foundCourse.description,
          level: foundCourse.level,
          imageUrl: foundCourse.image,
          videos: foundCourse.videos,
          notes: foundCourse.notes,
          publishedWhen: foundCourse.publishedWhen,
          instructor: foundCourse.instructor,
          instructorAvatar: foundCourse.instructorAvatar,
          archived: foundCourse.archived,
        });

        if (foundCourse.videos.length > 0) {
          setSelectedVideo(foundCourse.videos[0]);
          setVideoType(getVideoType(foundCourse.videos[0].source));
        }
      } else if (courses.length > 0) {
        navigate(`/watch-course/${courses[0].id}`, { replace: true });
      } else {
        setError("No courses available. Please check back later or contact support.");
      }
    }
  }, [courses, numericId, loading, navigate]);

  // Load YouTube API
  useEffect(() => {
    if (videoType === "youtube" && isModalOpen && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = () => setYoutubeApiReady(true);
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT) {
      setYoutubeApiReady(true);
    }
  }, [videoType, isModalOpen]);

  // Initialize YouTube player
  useEffect(() => {
    if (videoType === "youtube" && youtubeApiReady && isModalOpen && selectedVideo?.source) {
      const videoId = extractYouTubeVideoId(selectedVideo.source);
      if (!videoId) {
        setVideoError("Invalid YouTube video URL");
        toast.error("Invalid YouTube video URL");
        return;
      }
      youtubePlayerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        events: {
          onStateChange: (event: any) => {
            if (event.data === 0) markCourseAsCompleted();
          },
          onReady: () => console.log("YouTube player ready"),
        },
        playerVars: { modestbranding: 1, rel: 0, showinfo: 0 },
      });

      const trackingInterval = setInterval(() => {
        if (youtubePlayerRef.current?.getCurrentTime) {
          const currentTime = youtubePlayerRef.current.getCurrentTime();
          const duration = youtubePlayerRef.current.getDuration();
          if (duration > 0) {
            const percentage = (currentTime / duration) * 100;
            setWatchTime(currentTime);
            setPercentageWatched(percentage);
          }
        }
      }, 1000);

      return () => clearInterval(trackingInterval);
    }
  }, [youtubeApiReady, isModalOpen, videoType, selectedVideo]);

  // Mark course as completed
  useEffect(() => {
    if (percentageWatched >= COMPLETION_THRESHOLD && !isCourseFinished) {
      markCourseAsCompleted();
    }
  }, [percentageWatched, isCourseFinished]);

  // Preload images
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
      img.onerror = () => console.warn(`Failed to preload ${src}`);
    };
    preloadImage("/images/course_card.jpeg");
    preloadImage("/images/default.jpg");
    preloadImage("/images/avatar.png");
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  // Memoize next course
  const nextCourse = useMemo(() => {
    if (!course) return null;
    const next = courses.find((c) => c.id > course?.id);
    return next
      ? {
          id: next.id,
          title: next.title,
          image: next.image || "/images/default.jpg",
          path: `/watch-course/${next.id}`,
        }
      : null;
  }, [courses, course?.id]);

  const closeModal = () => {
    if (videoType === "youtube" && youtubePlayerRef.current) youtubePlayerRef.current.pauseVideo();
    if (videoType === "html5" && videoRef.current) videoRef.current.pause();
    setIsModalOpen(false);
    setSelectedVideo(courseInfo?.videos.length > 0 ? courseInfo.videos[0] : null);
    setSelectedNote(null);
    setPdfError(false);
    setIsSidebarOpen(false);
  };

  const markCourseAsCompleted = () => {
    setIsCourseFinished(true);
    fetch(`${API_URL}/api/user/courses/mark-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: courseInfo?.id, userId: user?.id }),
    })
      .then(() => toast.success("Course marked as completed!"))
      .catch((err) => {
        console.error("Error marking course as completed:", err);
        toast.error("Failed to mark course as completed");
      });
  };

  const handleArchiveCourse = async () => {
    try {
      const dataToSend = {
        courseId: courseInfo?.id,
        userId: user?.id,
      };
  
      console.log("Sending data to archive course:", dataToSend);

      const res = await fetch(`${API_URL}/api/user/courses/archive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ courseId: courseInfo?.id, userId: user?.id }),
      });

      if (!res.ok) throw new Error(`Failed to archive course: ${res.status}`);

      // Update local state to reflect archived status
      setCourseInfo((prev: any) => ({ ...prev, archived: true }));
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c.id === courseInfo?.id ? { ...c, archived: true } : c
        )
      );
      toast.success("Course marked as archived!");
    } catch (err: any) {
      console.error("Error archiving course:", err);
      toast.error("Failed to archive course");
    }
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration || 1;
    const percentage = (currentTime / duration) * 100;
    setWatchTime(currentTime);
    setPercentageWatched(percentage);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setSelectedNote(null);
    setVideoType(getVideoType(video.source));
    setPercentageWatched(0);
    setWatchTime(0);
    setIsCourseFinished(false);
    setVideoError(null);
    setIsModalOpen(true);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setSelectedVideo(null);
    setVideoType("unknown");
    setPercentageWatched(0);
    setWatchTime(0);
    setIsCourseFinished(false);
    setVideoError(null);
    setPdfError(false);
    setIsModalOpen(true);
  };

  const formatRelativeDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
         <DashboardHeader isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-lg text-gray-600">Loading course content...</p>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
         <DashboardHeader isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <svg className="h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-gray-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Retry loading course"
          >
            Retry
          </button>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (!course || !courseInfo) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
         <DashboardHeader isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <svg className="h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-xl text-gray-800 mb-4">Course not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Back to dashboard"
          >
            Back to Dashboard
          </button>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashboardHeader isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                aria-label="Back to dashboard"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-sm font-medium text-gray-500 truncate max-w-xs">{courseInfo.title}</li>
          </ol>
        </nav>

        {/* Course Hero */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={courseInfo.imageUrl}
              alt={courseInfo.title}
              className="w-full h-64 object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/images/course_card.jpeg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
              <button
                onClick={() => {
                  if (courseInfo.videos.length > 0) {
                    handleVideoSelect(courseInfo.videos[0]);
                    setIsModalOpen(true);
                  }
                }}
                className="bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                disabled={!courseInfo.videos.length}
                aria-label="Play first video"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseInfo.title}</h1>
            <p className="text-gray-600 mb-4 leading-relaxed">{courseInfo.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {courseInfo.instructor}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {courseInfo.level}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatRelativeDate(courseInfo.publishedWhen)}
              </div>
            </div>
            <button
              style={{
                borderBottomRightRadius: 0,
              }}
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Start course"
            >
              Start Course
            </button>
            <button
              style={{
                borderBottomRightRadius: 0,
              }}
                onClick={handleArchiveCourse}
                className={`px-6 py-3 ml-2 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  courseInfo.archived
                    ? "bg-green-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-100 text-gray-700 hover:bg-green-200"
                }`}
                disabled={courseInfo.archived}
                aria-label={courseInfo.archived ? "Course already archived" : "Archive course"}
              >
                {courseInfo.archived ? "Archived" : "Archive Course"}
              </button>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 ${isSidebarOpen ? "block" : "hidden"} lg:block fixed lg:static inset-y-0 left-0 w-80 bg-white z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:translate-x-0`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              <button
                className="lg:hidden text-gray-600 hover:text-gray-800"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Videos ({courseInfo.videos.length})</h3>
                {courseInfo.videos.length > 0 ? (
                  courseInfo.videos.map((video) => (
                    <button
                      style={{
                        borderBottomRightRadius: 0,
                      }}
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 text-sm transition-colors duration-200 ${
                        selectedVideo?.id === video.id ? "bg-green-100 text-green-800" : "hover:bg-green-100"
                      }`}
                      aria-label={`Play video: ${video.title}`}
                    >
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate">{video.title}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No videos available</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Notes ({courseInfo.notes.length})</h3>
                {courseInfo.notes.length > 0 ? (
                  courseInfo.notes.map((note) => (
                    <button
                      style={{
                        borderBottomRightRadius: 0,
                      }}
                      key={note.id}
                      onClick={() => handleNoteSelect(note)}
                      className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 text-sm transition-colors duration-200 ${
                        selectedNote?.id === note.id ? "bg-green-100 text-green-800" : "hover:bg-green-100"
                      }`}
                      aria-label={`View note: ${note.title}`}
                    >
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate">{note.title}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No notes available</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Course Resources */}
            <div className="bg-white rounded-2xl shadow-lg p-6 ml-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Resources</h2>
              <div className="space-y-4">
                {courseInfo.videos.length === 0 && courseInfo.notes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No resources available for this course.</p>
                ) : (
                  <>
                    {courseInfo.videos.map((video, index) => (
                      <div
                        key={video.id}
                        className={`flex items-center gap-4 p-4 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200 ${
                          index === courseInfo.videos.length - 1 && courseInfo.notes.length === 0 ? "" : "border-b-0"
                        }`}
                      >
                        <div className="flex-shrink-0 w-16 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                          <button
                            onClick={() => handleVideoSelect(video)}
                            className="flex items-center justify-center w-full h-full bg-black/30 hover:bg-black/40 transition-colors"
                            aria-label={`Play video: ${video.title}`}
                          >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-gray-900 truncate">{video.title}</h3>
                          <p className="text-sm text-gray-500">Video • {Math.floor(video.views / 60) || 5} min</p>
                        </div>
                      </div>
                    ))}
                    {courseInfo.notes.map((note, index) => (
                      <div
                        key={note.id}
                        className={`flex items-center gap-4 p-4 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200 ${
                          index === courseInfo.notes.length - 1 ? "" : "border-b-0"
                        }`}
                      >
                        <div className="flex-shrink-0 w-16 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-medium text-gray-900 truncate">{note.title}</h3>
                          <p className="text-sm text-gray-500">PDF Document</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            style={{
                              borderBottomRightRadius: 0,
                            }}
                            onClick={() => handleNoteSelect(note)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-2xl text-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={`View note: ${note.title}`}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Up Next */}
            {nextCourse && (
              <div className="bg-white rounded-2xl shadow-lg p-6 ml-4">
                <h2 className="text-xl font-semibold text-green-900 mb-4">Up Next</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={nextCourse.image}
                    alt={nextCourse.title}
                    className="w-24 h-16 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default.jpg";
                    }}
                  />
                  <div>
                    <h3 className="text-base font-medium text-gray-800">{nextCourse.title}</h3>
                    <button
                      onClick={() => navigate(nextCourse.path)}
                      className="mt-2 text-green-600 hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label={`Start next course: ${nextCourse.title}`}
                    >
                      Start Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {selectedVideo?.title || selectedNote?.title || "Resource Viewer"}
              </h3>
              <div className="flex gap-2">
                <button
                  className="lg:hidden text-gray-600 hover:text-gray-800"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <aside className={`w-80 bg-gray-50 p-6 overflow-y-auto ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Videos ({courseInfo.videos.length})</h4>
                    {courseInfo.videos.length > 0 ? (
                      courseInfo.videos.map((video) => (
                        <button
                        style={{
                          borderBottomRightRadius: 0,
                        }}
                          key={video.id}
                          onClick={() => handleVideoSelect(video)}
                          className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 text-sm transition-colors duration-200 ${
                            selectedVideo?.id === video.id ? "bg-green-100 text-green-800" : "hover:bg-green-100"
                          }`}
                          aria-label={`Play video: ${video.title}`}
                        >
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{video.title}</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No videos available</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Notes ({courseInfo.notes.length})</h4>
                    {courseInfo.notes.length > 0 ? (
                      courseInfo.notes.map((note) => (
                        <button
                        style={{
                          borderBottomRightRadius: 0,
                        }}
                          key={note.id}
                          onClick={() => handleNoteSelect(note)}
                          className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 text-sm transition-colors duration-200 ${
                            selectedNote?.id === note.id ? "bg-green-100 text-green-800" : "hover:bg-green-100"
                          }`}
                          aria-label={`View note: ${note.title}`}
                        >
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate">{note.title}</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No notes available</p>
                    )}
                  </div>
                </div>
              </aside>
              <div className="flex-1 p-6">
                {videoError ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-4">{videoError}</p>
                      {selectedVideo?.source && (
                        <a
                          href={selectedVideo.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Open video in new tab"
                        >
                          Open in New Tab
                        </a>
                      )}
                    </div>
                  </div>
                ) : selectedVideo && videoType === "youtube" ? (
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                    <div id="youtube-player" className="w-full h-full"></div>
                  </div>
                ) : selectedVideo && videoType === "html5" ? (
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
                    <video
                      ref={videoRef}
                      src={selectedVideo.source}
                      controls
                      className="w-full h-full object-contain"
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={markCourseAsCompleted}
                    />
                    <button
                      onClick={() => videoRef.current?.requestFullscreen()}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      aria-label="Enter fullscreen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                ) : selectedNote ? (
                  <div className="h-full flex flex-col">
                    {pdfError ? (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium text-gray-900 mb-2">Unable to display PDF</p>
                          <p className="text-gray-500 mb-4">The document couldn't be loaded in the viewer.</p>
                          <div className="flex gap-3 justify-center">
                            <a
                            style={{
                              borderBottomRightRadius: 0,
                            }}
                              href={selectedNote.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                              aria-label="Open note in new tab"
                            >
                              Open in New Tab
                            </a>
                            <a
                            style={{
                              borderBottomRightRadius: 0,
                            }}
                              href={selectedNote.source}
                              download
                              onClick={() => toast.success("Download started")}
                              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-2xl hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                              aria-label="Download note"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        <iframe
                          src={selectedNote.source}
                          className="w-full flex-1 rounded-t-lg"
                          title={selectedNote.title}
                          onError={() => setPdfError(true)}
                        />
                        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">{selectedNote.title}</h4>
                            <p className="text-xs text-gray-500">PDF Document</p>
                          </div>
                          <div className="flex gap-2">
                            <a
                            style={{
                              borderBottomRightRadius: 0,
                            }}
                              href={selectedNote.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-2xl text-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                              aria-label="Open note in new tab"
                            >
                              Open
                            </a>
                            <a
                            style={{
                              borderBottomRightRadius: 0,
                            }}
                              href={selectedNote.source}
                              download
                              onClick={() => toast.success("Download started")}
                              className="inline-flex items-center px-3 py-1.5 bg-green-100 text-gray-700 rounded-2xl text-sm hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                              aria-label="Download note"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Please select a video or note to view
                  </div>
                )}
                {selectedVideo && (
                  <div className="p-4 bg-green-50 border-t border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-green-700">
                        Progress: {Math.round(percentageWatched)}%
                      </span>
                      {isCourseFinished && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${percentageWatched}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <DashboardFooter />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CoursePage;