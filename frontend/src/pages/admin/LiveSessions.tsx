import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Search,
  Edit,
  Trash,
  Plus,
  ArrowUpDown,
  Link as LinkIcon,
  Calendar,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const LiveSessions = () => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    startTime: "",
    link: "",
    thumbnail: null,
    instructorId: "",
    subscriptionIds: [],
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("auth_token");

  // Fetch live sessions, instructors, and subscriptions on mount
  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/live-sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch live sessions");
        const response = await res.json();
        setLiveSessions(response.data || []);
      } catch (err) {
        console.error("Failed to fetch live sessions:", err);
        setLiveSessions([]);
      }
    };

    const fetchInstructors = async () => {
      try {
        const res = await fetch(`${API_URL}/api/manage/users/instructors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch instructors");
        const data = await res.json();
        setInstructors(data);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      }
    };

    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        const data = await res.json();
        setSubscriptions(data);
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchLiveSessions(), fetchInstructors(), fetchSubscriptions()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Create a new live session
  const handleCreateSession = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newSession.title);
      formData.append("description", newSession.description);
      formData.append("startTime", newSession.startTime);
      formData.append("link", newSession.link);
      formData.append("instructorId", newSession.instructorId);
      newSession.subscriptionIds.forEach((id) =>
        formData.append("subscriptionIds[]", id)
      );
      if (newSession.thumbnail) {
        formData.append("thumbnail", newSession.thumbnail);
      }

      const res = await fetch(`${API_URL}/api/live-sessions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create live session");
      const created = await res.json();
      setLiveSessions((prev) => [...prev, created]);
      resetForm();
    } catch (err) {
      console.error("Failed to create live session:", err);
    }
  };

  // Update an existing live session
  const handleUpdateSession = async (sessionId) => {
    try {
      const formData = new FormData();
      formData.append("title", newSession.title);
      formData.append("description", newSession.description);
      formData.append("startTime", newSession.startTime);
      formData.append("link", newSession.link);
      formData.append("instructorId", newSession.instructorId);
      newSession.subscriptionIds.forEach((id) =>
        formData.append("subscriptionIds[]", id)
      );
      if (newSession.thumbnail) {
        formData.append("thumbnail", newSession.thumbnail);
      }

      const res = await fetch(`${API_URL}/api/live-sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update live session");
      const updated = await res.json();
      setLiveSessions((prev) =>
        prev.map((session) => (session.id === sessionId ? updated : session))
      );
      resetForm();
    } catch (err) {
      console.error("Failed to update live session:", err);
    }
  };

  // Delete a live session
  const handleDeleteSession = async (sessionId) => {
    try {
      const res = await fetch(`${API_URL}/api/live-sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete live session");
      setLiveSessions((prev) => prev.filter((session) => session.id !== sessionId));
    } catch (err) {
      console.error("Failed to delete live session:", err);
    }
  };

  // Reset form and dialog state
  const resetForm = () => {
    setNewSession({
      title: "",
      description: "",
      startTime: "",
      link: "",
      thumbnail: null,
      instructorId: "",
      subscriptionIds: [],
    });
    setEditingSessionId(null);
    setIsSessionDialogOpen(false);
  };

  // Filter live sessions
  const filteredSessions = liveSessions.filter((session) => {
    if (
      searchTerm &&
      !session.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (
      instructorFilter !== "all" &&
      session.instructorId !== parseInt(instructorFilter)
    ) {
      return false;
    }
    if (subscriptionFilter !== "all") {
      const sessionSubscriptionIds = session.subscriptions?.map((sub) => sub.id) || [];
      if (!sessionSubscriptionIds.includes(parseInt(subscriptionFilter))) {
        return false;
      }
    }
    return true;
  });

  // Format start time for display
  const formatStartTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Live Sessions Manager
          </h1>
          <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  setEditingSessionId(null);
                  setNewSession({
                    title: "",
                    description: "",
                    startTime: "",
                    link: "",
                    thumbnail: null,
                    instructorId: "",
                    subscriptionIds: [],
                  });
                  setIsSessionDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Live Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  {editingSessionId ? "Edit Live Session" : "Create New Live Session"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingSessionId
                    ? "Edit the live session details."
                    : "Add a new live session for users to join."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Title */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Session title"
                    value={newSession.title}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                {/* Description */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Session description (optional)"
                    value={newSession.description}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                {/* Start Time */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <Input
                    type="datetime-local"
                    className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    value={newSession.startTime}
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>
                {/* Link */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Link
                  </label>
                  <Input
                    className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="Session link (e.g., Zoom, Google Meet)"
                    value={newSession.link}
                    onChange={(e) =>
                      setNewSession((prev) => ({ ...prev, link: e.target.value }))
                    }
                  />
                </div>
                {/* Thumbnail */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    onChange={(e) =>
                      setNewSession((prev) => ({
                        ...prev,
                        thumbnail: e.target.files[0] || null,
                      }))
                    }
                  />
                </div>
                {/* Instructor */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Instructor
                  </label>
                  <Select
                    value={newSession.instructorId}
                    onValueChange={(value) =>
                      setNewSession((prev) => ({ ...prev, instructorId: value }))
                    }
                  >
                    <SelectTrigger className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(instructors) && instructors.length > 0 ? (
                        instructors.map((instructor) => (
                          <SelectItem
                            key={instructor.id}
                            value={instructor.id.toString()}
                          >
                            {instructor.name || instructor.email}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No instructors found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {/* Subscriptions */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-right text-sm font-medium text-gray-700">
                    Subscriptions
                  </label>
                  <Select
                    onValueChange={(value) => {
                      setNewSession((prev) => {
                        const subscriptionIds = prev.subscriptionIds.includes(value)
                          ? prev.subscriptionIds
                          : [...prev.subscriptionIds, value];
                        return { ...prev, subscriptionIds };
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3 border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Add subscriptions" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(subscriptions) && subscriptions.length > 0 ? (
                        subscriptions.map((subscription) => (
                          <SelectItem
                            key={subscription.id}
                            value={subscription.id.toString()}
                          >
                            {subscription.type}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No subscriptions found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {/* Display selected subscriptions */}
                {newSession.subscriptionIds.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="col-start-2 col-span-3 flex flex-wrap gap-2">
                      {newSession.subscriptionIds.map((id) => {
                        const sub = subscriptions.find((s) => s.id === parseInt(id));
                        return (
                          <span
                            key={id}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"
                          >
                            {sub?.type}
                            <button
                              onClick={() =>
                                setNewSession((prev) => ({
                                  ...prev,
                                  subscriptionIds: prev.subscriptionIds.filter(
                                    (subId) => subId !== id
                                  ),
                                }))
                              }
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    !(
                      newSession.title &&
                      newSession.startTime &&
                      newSession.link &&
                      newSession.instructorId
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    if (
                      newSession.title &&
                      newSession.startTime &&
                      newSession.link &&
                      newSession.instructorId
                    ) {
                      if (editingSessionId) {
                        handleUpdateSession(editingSessionId);
                      } else {
                        handleCreateSession();
                      }
                    }
                  }}
                >
                  {editingSessionId ? "Update Session" : "Create Session"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search live sessions..."
              className="w-full pl-8 border-gray-300 focus:border-green-500 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={instructorFilter} onValueChange={setInstructorFilter}>
              <SelectTrigger className="w-[180px] border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="All Instructors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instructors</SelectItem>
                {Array.isArray(instructors) && instructors.length > 0 ? (
                  instructors.map((instructor) => (
                    <SelectItem
                      key={instructor.id}
                      value={instructor.id.toString()}
                    >
                      {instructor.name || instructor.email}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No instructors found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-[180px] border-gray-300 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="All Subscriptions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                {Array.isArray(subscriptions) && subscriptions.length > 0 ? (
                  subscriptions.map((subscription) => (
                    <SelectItem
                      key={subscription.id}
                      value={subscription.id.toString()}
                    >
                      {subscription.type}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No subscriptions found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px] text-gray-700">ID</TableHead>
                <TableHead className="text-gray-700">
                  <div className="flex items-center">
                    Title
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-700">Start Time</TableHead>
                <TableHead className="text-gray-700">Instructor</TableHead>
                <TableHead className="text-gray-700">Subscriptions</TableHead>
                <TableHead className="text-gray-700">Link</TableHead>
                <TableHead className="text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    Loading live sessions...
                  </TableCell>
                </TableRow>
              ) : filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {session.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-gray-900">{session.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatStartTime(session.startTime)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        {session.instructor?.name || session.instructor?.email || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {session.subscriptions?.length > 0 ? (
                        session.subscriptions.map((sub) => (
                          <span
                            key={sub.id}
                            className="inline-block px-2 py-1 mr-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                          >
                            {sub.type}
                          </span>
                        ))
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-blue-500" />
                        <a
                          href={session.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Session
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Session"
                          onClick={() => {
                            setEditingSessionId(session.id);
                            setNewSession({
                              title: session.title,
                              description: session.description || "",
                              startTime: new Date(session.startTime)
                                .toISOString()
                                .slice(0, 16),
                              link: session.link,
                              thumbnail: null,
                              instructorId: session.instructorId.toString(),
                              subscriptionIds: session.subscriptions?.map((sub) =>
                                sub.id.toString()
                              ) || [],
                            });
                            setIsSessionDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Session"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No live sessions found matching your filters
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

export default LiveSessions;