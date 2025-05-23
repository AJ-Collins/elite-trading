import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  Edit,
  Trash,
  Plus,
  ArrowUpDown,
  FileText,
  Image,
  File,
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

const getTypeIcon = (type) => {
  switch (type) {
    case 'PDF':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'Image':
      return <Image className="h-4 w-4 text-green-500" />;
    case 'Slides':
      return <File className="h-4 w-4 text-blue-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};

const Content = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [newNote, setNewNote] = useState({
    title: '',
    courseId: '',
    type: '',
    author: '',
    access: '',
    file: null,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('auth_token');

  // Fetch notes and courses
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch notes');
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
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
      await Promise.all([fetchNotes(), fetchCourses()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Create a note
  const handleCreateNote = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newNote.title);
      formData.append('courseId', newNote.courseId);
      formData.append('type', newNote.type);
      formData.append('author', newNote.author);
      formData.append('access', newNote.access);
      if (newNote.file) {
        formData.append('file', newNote.file);
      }

      const res = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to create note');
      const created = await res.json();
      setNotes((prev) => [...prev, created]);
      setNewNote({
        title: '',
        courseId: '',
        type: '',
        author: '',
        access: '',
        file: null,
      });
      setEditingNoteId(null);
      setIsNoteDialogOpen(false);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  // Update a note
  const handleUpdateNote = async (noteId) => {
    try {
      const formData = new FormData();
      formData.append('title', newNote.title);
      formData.append('courseId', newNote.courseId);
      formData.append('type', newNote.type);
      formData.append('author', newNote.author);
      formData.append('access', newNote.access);
      if (newNote.file) {
        formData.append('file', newNote.file);
      }

      const res = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to update note');
      const updated = await res.json();
      setNotes((prev) => prev.map((note) => (note.id === noteId ? updated : note)));
      setNewNote({
        title: '',
        courseId: '',
        type: '',
        author: '',
        access: '',
        file: null,
      });
      setEditingNoteId(null);
      setIsNoteDialogOpen(false);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    if (searchTerm && !note.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (courseFilter !== 'all' && note.courseId !== parseInt(courseFilter)) {
      return false;
    }
    if (accessFilter !== 'all' && note.access !== accessFilter) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Course Notes</h1>
          <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary"
                onClick={() => {
                  setEditingNoteId(null);
                  setNewNote({
                    title: '',
                    courseId: '',
                    type: '',
                    author: '',
                    access: '',
                    file: null,
                  });
                  setIsNoteDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingNoteId ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                <DialogDescription>
                  {editingNoteId ? 'Edit the note details' : 'Add a new note and assign it to a course'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Title</label>
                  <Input
                    className="col-span-3"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Course</label>
                  <Select
                    value={newNote.courseId}
                    onValueChange={(value) => setNewNote((prev) => ({ ...prev, courseId: value }))}
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
                  <label className="text-right text-sm">Type</label>
                  <Select
                    value={newNote.type}
                    onValueChange={(value) => setNewNote((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Slides">Slides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Author</label>
                  <Input
                    className="col-span-3"
                    placeholder="Author name"
                    value={newNote.author}
                    onChange={(e) => setNewNote((prev) => ({ ...prev, author: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Access</label>
                  <Select
                    value={newNote.access}
                    onValueChange={(value) => setNewNote((prev) => ({ ...prev, access: value }))}
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
                  <label className="text-right text-sm">File</label>
                  <Input
                    type="file"
                    accept=".pdf,image/jpeg,image/png,.ppt,.pptx"
                    className="col-span-3"
                    onChange={(e) => setNewNote((prev) => ({ ...prev, file: e.target.files[0] || null }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingNoteId(null);
                    setNewNote({
                      title: '',
                      courseId: '',
                      type: '',
                      author: '',
                      access: '',
                      file: null,
                    });
                    setIsNoteDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!(
                    newNote.title &&
                    newNote.courseId &&
                    newNote.type &&
                    newNote.author &&
                    newNote.access &&
                    (editingNoteId || newNote.file) // File required only for create
                  )}
                  onClick={() => {
                    if (
                      newNote.title &&
                      newNote.courseId &&
                      newNote.type &&
                      newNote.author &&
                      newNote.access &&
                      (editingNoteId || newNote.file)
                    ) {
                      if (editingNoteId) {
                        handleUpdateNote(editingNoteId);
                      } else {
                        handleCreateNote();
                      }
                    }
                  }}
                >
                  {editingNoteId ? 'Update Note' : 'Create Note'}
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
              placeholder="Search notes..."
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
                <TableHead>Type</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Loading notes...
                  </TableCell>
                </TableRow>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.id}</TableCell>
                    <TableCell>{note.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(note.type)}
                        {note.type}
                      </div>
                    </TableCell>
                    <TableCell>{note.course?.title || 'Unknown'}</TableCell>
                    <TableCell>{note.author}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          note.access === 'Premium'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {note.access}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Note"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setNewNote({
                              title: note.title,
                              courseId: note.courseId.toString(),
                              type: note.type,
                              author: note.author,
                              access: note.access,
                              file: null,
                            });
                            setIsNoteDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Note"
                          onClick={() => handleDeleteNote(note.id)}
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
                    No notes found matching your filters
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

export default Content;