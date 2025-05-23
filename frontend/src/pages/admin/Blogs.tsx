import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  Eye,
  Edit,
  Trash,
  MessageSquare,
  ArrowUpDown,
  AlertTriangle,
  Check,
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

// Define types for TypeScript
interface Blog {
  id: number;
  title: string;
  excerpt: string | null;
  author: string;
  category: string | null;
  status: 'Active' | 'Locked';
  reported: boolean;
  views: number;
  comments: number;
  courseId: number | null;
  course: { title: string } | null;
  createdAt: string;
}

interface Course {
  id: number;
  title: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportedFilter, setReportedFilter] = useState('all');
  const [isBlogDialogOpen, setIsBlogDialogOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    author: '',
    category: '',
    status: 'Active' as 'Active' | 'Locked',
    courseId: '',
    image: null as File | null,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('auth_token');

  // Fetch blogs and courses
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Failed to load blogs');
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchBlogs(), fetchCourses()]);
      setLoading(false);
    };

    fetchData();
  }, [token]);

  // Create a blog
  const handleCreateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('excerpt', newBlog.excerpt);
      formData.append('author', newBlog.author);
      if (newBlog.category && newBlog.category !== 'none') formData.append('category', newBlog.category);
      formData.append('status', newBlog.status);
      if (newBlog.courseId && newBlog.courseId !== 'none') formData.append('courseId', newBlog.courseId);
      if (newBlog.image) formData.append('image', newBlog.image);

      const res = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`Failed to create blog: ${res.status}`);
      const created: Blog = await res.json();
      setBlogs((prev) => [...prev, created]);
      setNewBlog({
        title: '',
        excerpt: '',
        author: '',
        category: '',
        status: 'Active',
        courseId: '',
        image: null,
      });
      setEditingBlogId(null);
      setIsBlogDialogOpen(false);
    } catch (err) {
      console.error('Failed to create blog:', err);
      setError('Failed to create blog');
    }
  };

  // Update a blog
  const handleUpdateBlog = async (blogId: number) => {
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('excerpt', newBlog.excerpt);
      formData.append('author', newBlog.author);
      if (newBlog.category && newBlog.category !== 'none') formData.append('category', newBlog.category);
      formData.append('status', newBlog.status);
      if (newBlog.courseId && newBlog.courseId !== 'none') formData.append('courseId', newBlog.courseId);
      if (newBlog.image) formData.append('image', newBlog.image);

      const res = await fetch(`${API_URL}/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`Failed to update blog: ${res.status}`);
      const updated: Blog = await res.json();
      setBlogs((prev) => prev.map((blog) => (blog.id === blogId ? updated : blog)));
      setNewBlog({
        title: '',
        excerpt: '',
        author: '',
        category: '',
        status: 'Active',
        courseId: '',
        image: null,
      });
      setEditingBlogId(null);
      setIsBlogDialogOpen(false);
    } catch (err) {
      console.error('Failed to update blog:', err);
      setError('Failed to update blog');
    }
  };

  // Delete a blog
  const handleDeleteBlog = async (blogId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to delete blog: ${res.status}`);
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error('Failed to delete blog:', err);
      setError('Failed to delete blog');
    }
  };

  // Toggle reported status
  const handleToggleReported = async (blogId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/blogs/${blogId}/reported`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to toggle reported status: ${res.status}`);
      const updated: Blog = await res.json();
      setBlogs((prev) => prev.map((blog) => (blog.id === blogId ? updated : blog)));
    } catch (err) {
      console.error('Failed to toggle reported status:', err);
      setError('Failed to toggle reported status');
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    if (searchTerm && !blog.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && blog.category !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'all' && blog.status !== statusFilter) {
      return false;
    }
    if (reportedFilter !== 'all' && blog.reported !== (reportedFilter === 'reported')) {
      return false;
    }
    return true;
  });

  const categories = ['all', 'trading', 'brokers', 'prop-firms', 'events'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-md">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <Dialog open={isBlogDialogOpen} onOpenChange={(open) => {
            console.log('Dialog open state:', open); // Debug
            setIsBlogDialogOpen(open);
            if (!open) {
              setEditingBlogId(null);
              setNewBlog({
                title: '',
                excerpt: '',
                author: '',
                category: '',
                status: 'Active',
                courseId: '',
                image: null,
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Opening Create Blog dialog'); // Debug
                  setEditingBlogId(null);
                  setNewBlog({
                    title: '',
                    excerpt: '',
                    author: '',
                    category: '',
                    status: 'Active',
                    courseId: '',
                    image: null,
                  });
                  setIsBlogDialogOpen(true);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Create Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white z-50">
              <DialogHeader>
                <DialogTitle>{editingBlogId ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
                <DialogDescription>
                  {editingBlogId ? 'Edit the blog details' : 'Add a new blog post'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Title</label>
                  <Input
                    className="col-span-3"
                    placeholder="Blog title"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Excerpt</label>
                  <textarea
                    className="col-span-3 border rounded-md p-2"
                    placeholder="Short summary"
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Author</label>
                  <Input
                    className="col-span-3"
                    placeholder="Author name"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, author: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Category</label>
                  <Select
                    value={newBlog.category || 'none'}
                    onValueChange={(value) => setNewBlog((prev) => ({ ...prev, category: value === 'none' ? '' : value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="brokers">Brokers</SelectItem>
                      <SelectItem value="prop-firms">Prop Firms</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Status</label>
                  <Select
                    value={newBlog.status}
                    onValueChange={(value) => setNewBlog((prev) => ({ ...prev, status: value as 'Active' | 'Locked' }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Course</label>
                  <Select
                    value={newBlog.courseId || 'none'}
                    onValueChange={(value) => setNewBlog((prev) => ({ ...prev, courseId: value === 'none' ? '' : value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {courses.length > 0 ? (
                        courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-courses" disabled>No courses found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Image</label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="col-span-3"
                    onChange={(e) => setNewBlog((prev) => ({ ...prev, image: e.target.files?.[0] || null }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBlogDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!(newBlog.title && newBlog.author && newBlog.status)}
                  onClick={() => {
                    if (newBlog.title && newBlog.author && newBlog.status) {
                      if (editingBlogId) {
                        handleUpdateBlog(editingBlogId);
                      } else {
                        handleCreateBlog();
                      }
                    }
                  }}
                >
                  {editingBlogId ? 'Update Blog' : 'Create Blog'}
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
              placeholder="Search blogs..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Locked">Locked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportedFilter} onValueChange={setReportedFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Reported" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reported</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="not-reported">Not Reported</SelectItem>
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
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    Loading blogs...
                  </TableCell>
                </TableRow>
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id} className={blog.reported ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{blog.id}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        {blog.reported && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {blog.title}
                      </div>
                    </TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{blog.category || 'None'}</TableCell>
                    <TableCell>{blog.course?.title || 'None'}</TableCell>
                    <TableCell>{blog.comments}</TableCell>
                    <TableCell>{blog.views}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          blog.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button variant="ghost" size="icon" title="View Blog">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Blog"
                          onClick={() => {
                            setEditingBlogId(blog.id);
                            setNewBlog({
                              title: blog.title,
                              excerpt: blog.excerpt || '',
                              author: blog.author,
                              category: blog.category || 'none',
                              status: blog.status,
                              courseId: blog.courseId ? blog.courseId.toString() : 'none',
                              image: null,
                            });
                            setIsBlogDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {blog.reported && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Clear Reported"
                            className="text-green-500"
                            onClick={() => handleToggleReported(blog.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Blog"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    No blogs found matching your filters
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

export default Blogs;