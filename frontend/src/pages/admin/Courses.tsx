import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Search, 
  Edit, 
  Trash,
  MoreHorizontal,
  PlusCircle,
  ArrowUpDown,
  Eye,
  Filter,
  Layers,
  FileText,
  Video,
  Archive,
  Tag
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('auth_token');

  const [newSubscription, setNewSubscription] = useState({
    type: '',
    price: '',
    duration: '',
  });
  const [editingId, setEditingId] = useState(null); 
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/subscriptions`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(data => {
        setSubscriptions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch subscriptions:', err);
        setLoading(false);
      });
  }, []);

  const handleAddSubscription = async (newSub) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSub)
      });
      const created = await res.json();
      setSubscriptions(prev => [...prev, created]);
    } catch (err) {
      console.error('Error creating subscription:', err);
    }
  };

  const handleEditSubscription = async (id, updatedFields) => {
    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      const updated = await res.json();
      setSubscriptions(prev =>
        prev.map(sub => (sub.id === id ? updated : sub))
      );
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    try {
      await fetch(`${API_URL}/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      setSubscriptions((prevSubscriptions) =>
        prevSubscriptions.filter((sub) => sub.id !== subscriptionId)
      );
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false); 
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    subscriptionId: '',
    author: '',
    level: '',
    thumbnail: null, // Add thumbnail to the state
  });

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, []);
  
  const handleCreateCourse = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newCourse.title);
      formData.append('description', newCourse.description);
      formData.append('subscriptionId', newCourse.subscriptionId);
      formData.append('author', newCourse.author);
      formData.append('level', newCourse.level);
      if (newCourse.thumbnail) {
        formData.append('thumbnail', newCourse.thumbnail);
      }
      formData.append('publishedWhen', new Date().toISOString()); // Add current timestamp

      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create course');

      const created = await res.json();
      setCourses((prev) => [...prev, created]);
      setNewCourse({
        title: '',
        description: '',
        subscriptionId: '',
        author: '',
        level: '',
        thumbnail: null,
      });
      setIsCourseDialogOpen(false);
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  const handleUpdateCourse = async (courseId, updatedData) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedData.title);
      formData.append('description', updatedData.description);
      formData.append('subscriptionId', updatedData.subscriptionId);
      formData.append('author', updatedData.author);
      formData.append('level', updatedData.level);
      if (updatedData.thumbnail instanceof File) {
        formData.append('thumbnail', updatedData.thumbnail);
      }

      const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update course');

      const updated = await res.json();
      setCourses((prev) => prev.map((course) => (course.id === courseId ? updated : course)));
      setEditingCourseId(null);
      setNewCourse({
        title: '',
        description: '',
        subscriptionId: '',
        author: '',
        level: '',
        thumbnail: null,
      });
    } catch (err) {
      console.error('Failed to update course:', err);
      throw err;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete course');
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error('Failed to delete course:', err);
      throw err;
    }
  };

  const filteredCourses = courses.filter(course => {
    if (selectedSubscription !== 'all' && course.subscriptionId !== parseInt(selectedSubscription)) {
      return false;
    }
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (levelFilter !== 'all' && course.level !== levelFilter) {
      return false;
    }
    if (statusFilter !== 'all') {
      const isPublished = course.status === 'Published';
      if ((statusFilter === 'published' && !isPublished) || 
          (statusFilter === 'draft' && isPublished)) {
        return false;
      }
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <div className="flex space-x-2">
            <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary"
                  onClick={() => {
                    setEditingCourseId(null);
                    setNewCourse({
                      title: '',
                      description: '',
                      subscriptionId: '',
                      author: '',
                      level: '',
                      thumbnail: null,
                    });
                    setIsCourseDialogOpen(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingCourseId ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                  <DialogDescription>
                    {editingCourseId ? 'Edit the course details' : 'Add a new course and assign it to a subscription tier'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Title</label>
                    <Input className="col-span-3" placeholder="Course title" 
                      value={newCourse.title}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))} 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Description</label>
                    <Input className="col-span-3" placeholder="Course description" 
                      value={newCourse.description}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Thumbnail</label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                      onChange={(e) => setNewCourse((prev) => ({
                        ...prev,
                        thumbnail: e.target.files[0],
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Subscription</label>
                    <Select
                      value={newCourse.subscriptionId}
                      onValueChange={(value) => setNewCourse((prev) => ({ ...prev, subscriptionId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select subscription tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(subscriptions) ? (
                          subscriptions.map(sub => (
                            <SelectItem key={sub.id} value={sub.id.toString()}>
                              {sub.type} (${sub.price})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value='none' disabled>No subscriptions found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Author</label>
                    <Input className="col-span-3" placeholder="Author name" 
                      value={newCourse.author}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Level</label>
                    <Select
                      value={newCourse.level}
                      onValueChange={(value) => setNewCourse((prev) => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline"
                    onClick={() => {
                      setEditingCourseId(null);
                      setNewCourse({
                        title: '',
                        description: '',
                        subscriptionId: '',
                        author: '',
                        level: '',
                        thumbnail: null,
                      });
                      setIsCourseDialogOpen(false);
                    }}
                  >Cancel</Button>
                  <Button
                    onClick={() => {
                      if (
                        newCourse.title &&
                        newCourse.description &&
                        newCourse.subscriptionId &&
                        newCourse.author &&
newCourse.level
                      ) {
                        if (editingCourseId) {
                          handleUpdateCourse(editingCourseId, newCourse);
                        } else {
                          handleCreateCourse();
                        }
                      }
                    }}
                  >
                    {editingCourseId ? 'Update Course' : 'Create Course'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Layers className="h-4 w-4 mr-2" />
                  Manage Subscriptions
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Subscription Management</DialogTitle>
                  <DialogDescription>
                    Manage your subscription tiers and associated courses
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.type}</TableCell>
                          <TableCell>${sub.price}</TableCell>
                          <TableCell>{sub.duration} days</TableCell>
                          <TableCell>{sub.coursesCount}</TableCell>
                          <TableCell>
                            <Badge className={sub.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {sub.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" 
                                onClick={() => {
                                  setEditingId(sub.id);
                                  setNewSubscription({
                                    type: sub.type,
                                    price: sub.price.toString(),
                                    duration: sub.duration.toString(),
                                  });
                                }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteSubscription(sub.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid gap-4 mt-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Type</label>
                    <Input 
                      className="col-span-3" 
                      placeholder="e.g. Basic" 
                      value={newSubscription.type}
                      onChange={(e) =>
                        setNewSubscription({ ...newSubscription, type: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Price ($)</label>
                    <Input 
                      className="col-span-3" 
                      type="number"
                      placeholder="e.g. 49.99"
                      value={newSubscription.price}
                      onChange={(e) =>
                        setNewSubscription({ ...newSubscription, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">Duration (days)</label>
                    <Input 
                      className="col-span-3" 
                      type="number"
                      placeholder="e.g. 30"
                      value={newSubscription.duration}
                      onChange={(e) =>
                        setNewSubscription({ ...newSubscription, duration: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  {editingId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setNewSubscription({ type: '', price: '', duration: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (
                        newSubscription.type &&
                        newSubscription.price &&
                        newSubscription.duration
                      ) {
                        const payload = {
                          ...newSubscription,
                          price: parseFloat(newSubscription.price),
                          duration: parseInt(newSubscription.duration),
                          isActive: true,
                        };

                        if (editingId) {
                          handleEditSubscription(editingId, payload);
                        } else {
                          handleAddSubscription(payload);
                        }

                        setNewSubscription({ type: '', price: '', duration: '' });
                        setEditingId(null);
                      }
                    }}
                  >
                    {editingId ? "Update Subscription" : "Add Subscription"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select 
              value={selectedSubscription} 
              onValueChange={setSelectedSubscription}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                {Array.isArray(subscriptions) ? (
                  subscriptions.map(sub => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.type}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='none' disabled>No subscriptions found</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Select 
              value={levelFilter} 
              onValueChange={setLevelFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Course Title
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <Video className="mr-1 h-4 w-4" />
                    Videos
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    Notes
                  </div>
                </TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={course.thumbnail ? `${API_URL}${course.thumbnail}` : "/api/placeholder/36/36"} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-xs text-gray-500">by {course.author}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          course.subscriptionType === 'Basic' ? 'border-blue-500 text-blue-500' :
                          course.subscriptionType === 'Premium' ? 'border-purple-500 text-purple-500' :
                          'border-orange-500 text-orange-500'
                        }
                      >
                        {course.subscriptionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {course.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.videos || (course.CourseVideos ? course.CourseVideos.length : 0)}</TableCell>
                    <TableCell>{course.notes || (course.CourseNotes ? course.CourseNotes.length : 0)}</TableCell>
                    <TableCell>{course.students || 0}</TableCell>
                    <TableCell>
                      <Badge className={
                        course.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }>
                        {course.status || (course.publishedWhen ? 'Published' : 'Draft')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <Button variant="ghost" size="icon" title="Edit Course"
                          onClick={() => {
                            setEditingCourseId(course.id);
                            setNewCourse({
                              title: course.title,
                              description: course.description,
                              subscriptionId: course.subscriptionId.toString(),
                              author: course.author,
                              level: course.level,
                              thumbnail: null, // Reset thumbnail file input
                            });
                            setIsCourseDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          {/* <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Manage Content">
                              <Layers className="h-4 w-4" />
                            </Button>
                          </DialogTrigger> */}
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Course Content: {course.title}</DialogTitle>
                              <DialogDescription>
                                Manage videos and notes for this course
                              </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="videos" className="mt-4">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="videos">
                                  <Video className="h-4 w-4 mr-2" />
                                  Videos ({course.videos || (course.CourseVideos ? course.CourseVideos.length : 0)})
                                </TabsTrigger>
                                <TabsTrigger value="notes">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Notes ({course.notes || (course.CourseNotes ? course.CourseNotes.length : 0)})
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="videos" className="space-y-4 mt-4">
                                <Button size="sm">
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add Video
                                </Button>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Order</TableHead>
                                      <TableHead>Title</TableHead>
                                      <TableHead>Source</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {course.CourseVideos && course.CourseVideos.length > 0 ? (
                                      course.CourseVideos.map((video, index) => (
                                        <TableRow key={video.id}>
                                          <TableCell>{video.order || index + 1}</TableCell>
                                          <TableCell>{video.title}</TableCell>
                                          <TableCell>{video.isLocal ? 'Local' : 'External'}</TableCell>
                                          <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={4} className="text-center">No videos available</TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                              <TabsContent value="notes" className="space-y-4 mt-4">
                                <Button size="sm">
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add Note
                                </Button>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Title</TableHead>
                                      <TableHead>File</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {course.CourseNotes && course.CourseNotes.length > 0 ? (
                                      course.CourseNotes.map((note) => (
                                        <TableRow key={note.id}>
                                          <TableCell>{note.title}</TableCell>
                                          <TableCell>{note.source.split('/').pop()}</TableCell>
                                          <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={3} className="text-center">No notes available</TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                            </Tabs>
                            <DialogFooter className="mt-4">
                              <Button variant="outline">Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" title="Delete Course"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    No courses found matching your filters
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

export default Courses;