import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  Edit,
  Trash,
  Plus,
  ArrowUpDown,
  Play,
  Eye,
  Link,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const [newVideo, setNewVideo] = useState({
    title: '',
    courseId: '',
    access: '',
    sourceUrl: '', // For URL input
    sourceFile: null, // For file upload
  });
  const [sourceType, setSourceType] = useState('url'); // Toggle between 'url' and 'file'

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('auth_token');

  // Fetch videos and courses on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchVideos(), fetchCourses()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Create a new video
  const handleCreateVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newVideo.title);
      formData.append('courseId', parseInt(newVideo.courseId));
      formData.append('access', newVideo.access);
      if (sourceType === 'file' && newVideo.sourceFile) {
        formData.append('video', newVideo.sourceFile);
      } else if (sourceType === 'url' && newVideo.sourceUrl) {
        formData.append('source', newVideo.sourceUrl);
      }

      const res = await fetch(`${API_URL}/api/videos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to create video');
      const created = await res.json();
      setVideos((prev) => [...prev, created]);
      setNewVideo({
        title: '',
        courseId: '',
        access: '',
        sourceUrl: '',
        sourceFile: null,
      });
      setSourceType('url');
      setEditingVideoId(null);
      setIsVideoDialogOpen(false);
    } catch (err) {
      console.error('Failed to create video:', err);
    }
  };

  // Update an existing video
  const handleUpdateVideo = async (videoId, updatedData) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedData.title);
      formData.append('courseId', parseInt(updatedData.courseId));
      formData.append('access', updatedData.access);
      if (sourceType === 'file' && updatedData.sourceFile) {
        formData.append('video', updatedData.sourceFile);
      } else if (sourceType === 'url' && updatedData.sourceUrl) {
        formData.append('source', updatedData.sourceUrl);
      }

      const res = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update video');
      const updated = await res.json();
      setVideos((prev) => prev.map((video) => (video.id === videoId ? updated : video)));
      setNewVideo({
        title: '',
        courseId: '',
        access: '',
        sourceUrl: '',
        sourceFile: null,
      });
      setSourceType('url');
      setEditingVideoId(null);
      setIsVideoDialogOpen(false);
    } catch (err) {
      console.error('Failed to update video:', err);
    }
  };

  // Delete a video
  const handleDeleteVideo = async (videoId) => {
    try {
      const res = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete video');
      setVideos((prev) => prev.filter((video) => video.id !== videoId));
    } catch (err) {
      console.error('Failed to delete video:', err);
    }
  };

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    if (searchTerm && !video.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (courseFilter !== 'all' && video.courseId !== parseInt(courseFilter)) {
      return false;
    }
    if (accessFilter !== 'all' && video.access !== accessFilter) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Video Library</h1>
          <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary"
                onClick={() => {
                  setEditingVideoId(null);
                  setNewVideo({
                    title: '',
                    courseId: '',
                    access: '',
                    sourceUrl: '',
                    sourceFile: null,
                  });
                  setSourceType('url');
                  setIsVideoDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingVideoId ? 'Edit Video' : 'Create New Video'}</DialogTitle>
                <DialogDescription>
                  {editingVideoId ? 'Edit the video details' : 'Add a new video and assign it to a course'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Title</label>
                  <Input
                    className="col-span-3"
                    placeholder="Video title"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Course</label>
                  <Select
                    value={newVideo.courseId}
                    onValueChange={(value) => setNewVideo((prev) => ({ ...prev, courseId: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(courses) && courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No courses found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Access</label>
                  <Select
                    value={newVideo.access}
                    onValueChange={(value) => setNewVideo((prev) => ({ ...prev, access: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Source</label>
                  <div className="col-span-3">
                    <Tabs value={sourceType} onValueChange={setSourceType} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">URL</TabsTrigger>
                        <TabsTrigger value="file">Upload File</TabsTrigger>
                      </TabsList>
                      <TabsContent value="url">
                        <Input
                          placeholder="Enter video URL (e.g., YouTube, Vimeo)"
                          value={newVideo.sourceUrl}
                          onChange={(e) =>
                            setNewVideo((prev) => ({ ...prev, sourceUrl: e.target.value, sourceFile: null }))
                          }
                        />
                      </TabsContent>
                      <TabsContent value="file">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            setNewVideo((prev) => ({
                              ...prev,
                              sourceFile: e.target.files[0] || null,
                              sourceUrl: '',
                            }))
                          }
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingVideoId(null);
                    setNewVideo({
                      title: '',
                      courseId: '',
                      access: '',
                      sourceUrl: '',
                      sourceFile: null,
                    });
                    setSourceType('url');
                    setIsVideoDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!(
                    newVideo.title &&
                    newVideo.courseId &&
                    newVideo.access &&
                    (newVideo.sourceUrl || newVideo.sourceFile)
                  )}
                  onClick={() => {
                    if (
                      newVideo.title &&
                      newVideo.courseId &&
                      newVideo.access &&
                      (newVideo.sourceUrl || newVideo.sourceFile)
                    ) {
                      if (editingVideoId) {
                        handleUpdateVideo(editingVideoId, newVideo);
                      } else {
                        handleCreateVideo();
                      }
                    }
                  }}
                >
                  {editingVideoId ? 'Update Video' : 'Create Video'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No courses found</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select value={accessFilter} onValueChange={setAccessFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Access</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Title
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Loading videos...
                  </TableCell>
                </TableRow>
              ) : filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-red-500" />
                        {video.title}
                      </div>
                    </TableCell>
                    <TableCell>{video.views || 0}</TableCell>
                    <TableCell>{video.Course?.title || 'Unknown'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          video.access === 'Premium'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {video.access}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        {video.source.startsWith('http') ? (
                          <a href={video.source} target="_blank" rel="noopener noreferrer">
                            External Link
                          </a>
                        ) : (
                          'Uploaded Video'
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(video.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        {/* <Button variant="ghost" size="icon" title="View Video">
                          <Eye className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Video"
                          onClick={() => {
                            setEditingVideoId(video.id);
                            setNewVideo({
                              title: video.title,
                              courseId: video.courseId.toString(),
                              access: video.access,
                              sourceUrl: video.source.startsWith('http') ? video.source : '',
                              sourceFile: null,
                            });
                            setSourceType(video.source.startsWith('http') ? 'url' : 'file');
                            setIsVideoDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Video"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No videos found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Videos;