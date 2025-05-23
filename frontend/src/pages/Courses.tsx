import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardFooter from "@/components/DashboardFooter";
import { useAuth } from "../context/useAuth";

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
}

interface Note {
  id: number;
  title: string;
  source: string;
}

interface Course {
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
}

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = parseInt(id || "0", 10);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [videoType, setVideoType] = useState<"youtube" | "html5" | "unknown">("unknown");
  const [pdfError, setPdfError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubePlayerRef = useRef<any>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCourseFinished, setIsCourseFinished] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [percentageWatched, setPercentageWatched] = useState(0);
  const [youtubeApiReady, setYoutubeApiReady] = useState(false);
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all courses and user subscriptions
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/courses/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);

        const data = await res.json();
        console.log("Courses API response:", JSON.stringify(data, null, 2));

        if (!Array.isArray(data)) {
          throw new Error("Courses data is not an array");
        }

        const formattedCourses = data.map((course: any) => ({
          id: course.id,
          documentId: course.id.toString(),
          title: course.title
            ? course.title.replace("Begginers", "Beginners").replace("Intewrmidiate", "Intermediate")
            : "",
          slug: course.title
            ? course.title.toLowerCase().replace(/\s+/g, "-")
            : "",
          description: course.description
            ? course.description
                .replace("Begginers", "Beginners")
                .replace("Intewrmidiate", "Intermediate")
            : "",
          image: course.thumbnail
            ? `${API_URL}${course.thumbnail}`
            : " ",
          videos: Array.isArray(course.CourseVideos)
            ? course.CourseVideos.map((video: any) => ({
                id: video.id,
                title: video.title,
                source: video.isLocal ? `${API_URL}${video.source}` : video.source,
                isLocal: video.isLocal,
              })).sort((a: Video, b: Video) => a.id - b.id)
            : [],
          notes: Array.isArray(course.CourseNotes)
            ? course.CourseNotes.map((note: any) => ({
                id: note.id,
                title: note.title,
                source: `${API_URL}${note.source}`,
              })).sort((a: Note, b: Note) => a.id - b.id)
            : [],
          price: course.Subscription?.price ?? null,
          isFree: course.price === 0 ?? false,
          publishedWhen: course.publishedWhen ?? null,
          instructor: course.author || "Default Instructor",
          level: course.level || "Beginner",
          levelNumber: course.level === "Intermediate" ? 1 : 0,
          uploadDate: course.createdAt || new Date().toISOString(),
          rating: course.rating || 0,
          color: course.level === "Intermediate" ? "#D69E2E" : "#3182CE",
          modules: course.modules || [],
          nextCourse: course.nextCourse || null,
          instructorAvatar: "/images/avatar.png",
        }));

        setCourses(formattedCourses);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchUserSubscriptions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/subscriptions/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch user subscriptions: ${res.status}`);

        const userData = await res.json();
        console.log("Subscriptions API response:", JSON.stringify(userData, null, 2));

        if (userData?.data && numericId) {
          const subscriptionCourses: any[] = [];
          for (const sub of userData.data) {
            const now = new Date("2025-05-23T11:55:00.000+03:00");
            const endDate = new Date(sub.endDate);
            if (sub.isActive && endDate > now) {
              const courseRes = await fetch(`${API_URL}/api/user/courses/${user.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              if (!courseRes.ok) continue;
              const coursesData = await courseRes.json();
              const matchingCourses = coursesData.filter(
                (c: any) => c.subscriptionId === sub.subscriptionId
              );
              subscriptionCourses.push(...matchingCourses);
            }
          }
          const targetSubscriptionCourse = subscriptionCourses.find(
            (c: any) => c.id === numericId
          );

          if (targetSubscriptionCourse) {
            localStorage.setItem("targetDocumentId", targetSubscriptionCourse.id.toString());
          } else {
            setError("Course not accessible: Subscription expired or invalid.");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching user subscriptions:", err);
      }
    };

    if (user?.id && token) {
      Promise.all([fetchCourses(), fetchUserSubscriptions()]);
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [numericId, user?.id, token, API_URL]);

  // Match course by id or documentId and set initial video
  useEffect(() => {
    if (!loading && courses.length > 0) {
      let foundCourse = courses.find((c) => c.id === numericId);

      if (!foundCourse) {
        const targetDocumentId = localStorage.getItem("targetDocumentId");
        if (targetDocumentId) {
          foundCourse = courses.find((c) => c.documentId === targetDocumentId);
        }
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
          publishedWhen: foundCourse.publishedWhen, // Add this field
        });
        setSelectedVideo(foundCourse.videos.length > 0 ? foundCourse.videos[0] : null);
        setSelectedNote(null);
        setVideoType(
          foundCourse.videos.length > 0
            ? getVideoType(foundCourse.videos[0].source)
            : "unknown"
        );
      } else if (courses.length > 0) {
        navigate(`/watch-course/${courses[0].id}`, { replace: true });
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

  // Initialize YouTube player & track time
  useEffect(() => {
    if (
      videoType === "youtube" &&
      youtubeApiReady &&
      isModalOpen &&
      selectedVideo?.source
    ) {
      const videoId = extractYouTubeVideoId(selectedVideo.source);
      if (!videoId) {
        setVideoError("Invalid YouTube video URL");
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
        playerVars: { modestbranding: 1, rel: 0 },
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

  // Check completion threshold
  useEffect(() => {
    if (percentageWatched >= COMPLETION_THRESHOLD && !isCourseFinished) {
      markCourseAsCompleted();
    }
  }, [percentageWatched, isCourseFinished]);

  // Preload fallback images with error handling
  useEffect(() => {
    const preloadImage = (src: string, onError: () => void) => {
      const img = new Image();
      img.src = src;
      img.onerror = onError;
      img.onload = () => console.log(`Preloaded ${src}`);
    };

    preloadImage("/images/course_card.jpeg", () => console.warn("Failed to preload /images/course_card.jpeg"));
    preloadImage("/images/default.jpg", () => console.warn("Failed to preload /images/default.jpg"));
  }, []);

  // Allow closing modal with Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  // Memoize nextCourse to return null if there is no next course
  const nextCourse = useMemo(() => {
    const next = courses.find((c) => c.id > course?.id);
    if (next) {
      return {
        id: next.id,
        title: next.title,
        image: next.image || "/images/default.jpg",
        path: `/watch-course/${next.id}`,
      };
    }
    return null;
  }, [courses, course?.id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
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
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading course...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            const fetchCourses = async () => {
              try {
                const res = await fetch(`${API_URL}/api/user/courses/${user.id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                });
                if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
                const data = await res.json();
                if (!Array.isArray(data)) throw new Error("Courses data is not an array");

                const formattedCourses = data.map((course: any) => ({
                  id: course.id,
                  documentId: course.id.toString(),
                  title: course.title
                    ? course.title
                        .replace("Begginers", "Beginners")
                        .replace("Intewrmidiate", "Intermediate")
                    : "",
                  slug: course.title
                    ? course.title.toLowerCase().replace(/\s+/g, "-")
                    : "",
                  description: course.description
                    ? course.description
                        .replace("Begginers", "Beginners")
                        .replace("Intewrmidiate", "Intermediate")
                    : "",
                  image: course.thumbnail
                    ? `${API_URL}${course.thumbnail}`
                    : "/images/course_card.jpeg",
                  videos: Array.isArray(course.CourseVideos)
                    ? course.CourseVideos.map((video: any) => ({
                        id: video.id,
                        title: video.title,
                        source: video.isLocal ? `${API_URL}${video.source}` : video.source,
                        isLocal: video.isLocal,
                      })).sort((a: Video, b: Video) => a.id - b.id)
                    : [],
                  notes: Array.isArray(course.CourseNotes)
                    ? course.CourseNotes.map((note: any) => ({
                        id: note.id,
                        title: note.title,
                        source: `${API_URL}${note.source}`,
                      })).sort((a: Note, b: Note) => a.id - b.id)
                    : [],
                  price: course.Subscription?.price ?? null,
                  isFree: course.price === 0 ?? false,
                  publishedWhen: course.publishedWhen ?? null,
                  instructor: course.author || "Default Instructor",
                  level: course.level || "Beginner",
                  levelNumber: course.level === "Intermediate" ? 1 : 0,
                  uploadDate: course.createdAt || new Date().toISOString(),
                  rating: course.rating || 0,
                  color: course.level === "Intermediate" ? "#D69E2E" : "#3182CE",
                  modules: course.modules || [],
                  nextCourse: course.nextCourse || null,
                  instructorAvatar: "/images/avatar.png",
                }));

                setCourses(formattedCourses);
                setLoading(false);
              } catch (err: any) {
                setError(err.message);
                setLoading(false);
              }
            };
            fetchCourses();
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!course || !courseInfo) {
    return <p className="text-center py-10 text-gray-600">Looking for your course...</p>;
  }

  const handleBack = () => navigate("/dashboard");

  const closeModal = () => {
    if (videoType === "youtube" && youtubePlayerRef.current)
      youtubePlayerRef.current.pauseVideo();
    if (videoType === "html5" && videoRef.current) videoRef.current.pause();
    setIsModalOpen(false);
    setSelectedVideo(courseInfo.videos.length > 0 ? courseInfo.videos[0] : null);
    setSelectedNote(null);
    setPdfError(false);
  };

  const markCourseAsCompleted = () => {
    setIsCourseFinished(true);
    fetch(`${API_URL}/api/courses/mark-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: courseInfo?.id, userId: user?.id }),
    }).catch((err) => console.error("Error marking course as completed:", err));
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration || 1;
    const percentage = (currentTime / duration) * 100;
    setWatchTime(currentTime);
    setPercentageWatched(percentage);
  };

  const handleVideoEnded = () => markCourseAsCompleted();

  const formatRelativeDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const now = new Date("2025-05-23T11:55:00.000+03:00"); // 11:55 AM EAT
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }
  };

  const handleVideoSelect = async (video: Video) => {
    setSelectedVideo(video);
    setSelectedNote(null);
    setVideoType(getVideoType(video.source));
    setPercentageWatched(0);
    setWatchTime(0);
    setIsCourseFinished(false);
    setVideoError(null);

    // Update views
    try {
      await fetch(`${API_URL}/api/videos/${video.id}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Error updating video views:", err);
    }
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
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      <DashboardHeader
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200"
          aria-label="Back to all courses"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Back to All Courses</span>
        </button>

        {/* Main Course Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Course Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={courseInfo.imageUrl}
                alt={courseInfo.title}
                className="w-full aspect-video object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes("/images/course_card.jpeg")) {
                    target.src = "https://via.placeholder.com/640x360?text=Course+Image+Not+Found";
                  } else {
                    target.src = "/images/course_card.jpeg";
                  }
                  target.onerror = null;
                }}
              />
            </div>
          </div>

          {/* Up Next Section (Conditional) */}
          {nextCourse && (
            <div className="w-full lg:w-1/2">
              <div className="border-l-4 border-green-600 pl-4 mb-6">
                <div className="text-gray-600 text-sm font-semibold tracking-wide uppercase">
                  Up Next in This Stage
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={nextCourse.image}
                  alt={nextCourse.title}
                  className="w-32 h-20 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes("/images/default.jpg")) {
                      target.src = "https://via.placeholder.com/160x120?text=Next+Course+Image+Not+Found";
                    } else {
                      target.src = "/images/default.jpg";
                    }
                    target.onerror = null;
                  }}
                />
                <div className="font-medium text-gray-800">{nextCourse.title}</div>
              </div>
              <button
                onClick={() => navigate(nextCourse.path)}
                className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 px-6 text-green-600 font-semibold hover:bg-green-50 hover:border-green-600 transition-all duration-200"
                aria-label={`Start next course: ${nextCourse.title}`}
              >
                Start Next Course
              </button>
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className="mt-12 px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseInfo.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <p>
              <span className="font-medium">Published:</span> {formatRelativeDate(courseInfo.publishedWhen)}
            </p>
            <p>
              <span className="font-medium">Level:</span> {courseInfo.level}
            </p>
            <p>
              <span className="font-medium">Instructor:</span> {course.instructor}
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-8">{courseInfo.description}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-md transition-all duration-200"
            aria-label={`Start course: ${courseInfo.title}`}
          >
            Start Course
          </button>
        </div>
      </div>

      {/* Modal for Videos and Notes */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
          <div className="text-white rounded-2xl max-w-7xl w-full h-[90vh] flex flex-col md:flex-row gap-6 bg-gray-900 shadow-2xl">
            {/* Left Sidebar: List of Videos and Notes */}
            <div className="w-full md:w-1/4 bg-gray-800 p-6 rounded-l-2xl max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <h2 className="text-xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Course Content
              </h2>
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Videos</h3>
                {courseInfo.videos.length > 0 ? (
                  courseInfo.videos.map((video: Video) => (
                    <button
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-all duration-200 ${
                        selectedVideo?.id === video.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate">{video.title}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No videos available.</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Notes</h3>
                {courseInfo.notes.length > 0 ? (
                  courseInfo.notes.map((note: Note) => (
                    <button
                      key={note.id}
                      onClick={() => handleNoteSelect(note)}
                      className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-all duration-200 ${
                        selectedNote?.id === note.id
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{note.title}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No notes available.</p>
                )}
              </div>
            </div>

            {/* Right Content: Display Selected Video or Note */}
            <div className="w-full md:w-3/4 flex flex-col p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedVideo ? selectedVideo.title : selectedNote ? selectedNote.title : "Select Content"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors duration-200"
                  aria-label="Close video modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
              <div className="w-full h-[60vh] bg-black rounded-xl flex items-center justify-center relative shadow-inner">
                {videoError ? (
                  <p className="text-white">{videoError}</p>
                ) : selectedVideo && videoType === "youtube" ? (
                  <div id="youtube-player" className="w-full h-full rounded-xl"></div>
                ) : selectedVideo && videoType === "html5" ? (
                  <>
                    <video
                      ref={videoRef}
                      src={selectedVideo.source}
                      controls
                      className="w-full h-full rounded-xl object-contain"
                      onTimeUpdate={handleVideoTimeUpdate}
                      onEnded={handleVideoEnded}
                    />
                    <button
                      onClick={() => videoRef.current?.requestFullscreen()}
                      className="absolute top-2 right-2 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4h4m12 0h-4v4m-8 12v-4h-4m12 4h-4v-4" />
                      </svg>
                    </button>
                  </>
                ) : selectedNote ? (
                  <div className="w-full h-full flex flex-col items-center">
                    {pdfError ? (
                      <div className="text-white text-center p-4">
                        <p className="mb-2">Unable to display PDF. Please open or download it instead.</p>
                        <div className="flex gap-2 justify-center">
                          <a
                            href={selectedNote.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open in New Tab
                          </a>
                          <a
                            href={selectedNote.source}
                            download
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <>
                        <iframe
                          src={selectedNote.source}
                          className="w-full h-full rounded-xl"
                          title={selectedNote.title}
                          onError={() => setPdfError(true)}
                        />
                        <div className="mt-2 flex gap-2">
                          <a
                            href={selectedNote.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Open in New Tab
                          </a>
                          <a
                            href={selectedNote.source}
                            download
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-white">Select a video or note to view.</p>
                )}
              </div>
              {selectedVideo && percentageWatched > 0 && percentageWatched < COMPLETION_THRESHOLD && (
                <div className="mt-4">
                  <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${percentageWatched}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    {Math.round(percentageWatched)}% complete
                  </div>
                </div>
              )}
              {selectedVideo && isCourseFinished && (
                <div className="mt-4 text-green-400 text-center font-bold flex items-center justify-center gap-2">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Video marked as completed!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <DashboardFooter />
    </div>
  );
};

export default CoursePage;