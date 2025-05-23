import AdminLayout from '@/components/AdminLayout';
import React, { useEffect, useState } from 'react';
import {
  UserPlus, Search, Edit, Trash, ArrowUpDown, 
  Download, Filter, ChevronDown, Check, RefreshCcw,
  Shield,  User as UserIcon, Mail
} from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { json } from 'stream/consumers';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('auth_token');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/manage/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);

      const statusCount = {
        total: data.length,
        active: data.filter(u => u.status === 'active').length,
        inactive: data.filter(u => u.status === 'inactive').length,
        suspended: data.filter(u => u.status === 'suspended').length,
      };
      setStats(statusCount);

    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleCreateUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/manage/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
  
      const createdUser = await res.json();
      setUsers([...users, createdUser]);
      setAddUserOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    } catch (error) {
      alert(error.message || 'Something went wrong');
    }
  };

  const handleEditUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/manage/users/edit/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedUser),
      });
  
      if (!res.ok) throw new Error('Failed to update user');
      const updatedUser = await res.json();
  
      setUsers(users.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditUserOpen(false);
    } catch (error) {
      alert(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${API_URL}/api/manage/users/delete/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error('Failed to delete user');
  
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch(`${API_URL}/api/manage/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
  
      if (!res.ok) throw new Error('Failed to reset password');
      console.log(`Password reset for ${selectedUser.username}`);
      setResetPasswordOpen(false);
      setNewPassword("");
    } catch (error) {
      alert(error.message || 'Failed to reset password');
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';

    try {
      const res = await fetch(`${API_URL}/api/manage/users/${user.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setUsers(users.map(u =>
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
    } catch (error) {
      alert(error.message || 'Failed to reset password');
    }
  };

  const handleSuspendUser = async (user) => {
    try {
      const res = await fetch(`${API_URL}/api/manage/users/${user.id}/suspend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'suspended' }),
      });
  
      if (!res.ok) throw new Error('Failed to suspend user');
  
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, status: 'suspended' } : u
      ));
    } catch (error) {
      console.error(error);
      alert('Failed to suspend user');
    }
  };

  useEffect(() => {
    fetchUsers(token);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0
  });

  useEffect(() => {
    // This would be replaced with your actual data fetching logic
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusToggleText = (status) => {
    return status === 'active' ? 'Deactivate User' : 'Activate User';
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchUsers(token);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="h-full w-full bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Inactive Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-600">{stats.inactive}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Suspended Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.suspended}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with the following details.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="username" className="text-sm font-medium">Username</label>
                        <Input id="username" 
                          value={newUser.username}
                          required
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                          placeholder="Enter username" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input id="email" type="email" 
                          value={newUser.email}
                          required
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="Enter email" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input id="password" type="password" 
                          value={newUser.password}
                          required
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Enter password" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="role" className="text-sm font-medium">Role</label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                              {newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem onSelect={() => setNewUser({ ...newUser, role: 'user' })}>
                              User
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setNewUser({ ...newUser, role: 'admin' })}>
                              Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateUser} className="bg-green-600 hover:bg-green-700">Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="active"></TabsTrigger>
                  <TabsTrigger value="inactive"></TabsTrigger>
                  <TabsTrigger value="suspended"></TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex justify-between items-center gap-4 mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search users..." 
                    className="w-full pl-8" 
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCcw className="h-4 w-4 mr-1" />
                    {loading ? "Refreshing..." : "Refresh"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Check className="h-4 w-4 mr-2" /> Most Recent
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserIcon className="h-4 w-4 mr-2" /> Name (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" /> Email (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" /> Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center">
                    <RefreshCcw className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>
                            <div className="flex items-center cursor-pointer">
                              Name <ArrowUpDown className="ml-1 h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{user.id}</TableCell>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadgeStyles(user.status)}>
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center space-x-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" 
                                    onClick={() => {
                                      setSelectedUser({...user});
                                      setEditUserOpen(true);
                                    }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {user.role !== 'admin' && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" 
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setDeleteDialogOpen(true);
                                      }}
                                      >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  )}                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ChevronDown className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    {user.role === 'admin' ? (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setResetPasswordOpen(true);
                                        }}
                                        className="text-blue-500"
                                      >
                                        Reset Password
                                      </DropdownMenuItem>
                                    ) : (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedUser(user);
                                            setResetPasswordOpen(true);
                                          }}
                                          className="text-blue-500"
                                        >
                                          Reset Password
                                        </DropdownMenuItem>

                                        {user.status === 'active' ? (
                                          <DropdownMenuItem
                                            onClick={() => handleSuspendUser(user)}
                                            className="text-red-500"
                                          >
                                            Suspend User
                                          </DropdownMenuItem>
                                        ) : (
                                          <DropdownMenuItem
                                            onClick={() => handleToggleStatus(user)}
                                            className="text-green-500"
                                          >
                                            {getStatusToggleText(user.status)}
                                          </DropdownMenuItem>
                                        )}
                                      </>
                                    )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No users found matching "{searchTerm}"
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{" "}
                    <span className="font-medium">{stats.total}</span> users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-blue-50">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Edit User Dialog */}
              {selectedUser && (
                <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                      <DialogDescription>
                        Update user information.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="edit-username" className="text-sm font-medium">Username</label>
                        <Input 
                          id="edit-username" 
                          value={selectedUser.username}
                          onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })} 
                        />
                      </div>                      
                      <div className="grid gap-2">
                        <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="edit-email" 
                          type="email" 
                          value={selectedUser.email}
                          onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                        />
                      </div>
                      {selectedUser.role !== 'admin' && (
                        <>
                        <div className="grid gap-2">
                          <label htmlFor="edit-role" className="text-sm font-medium">Role</label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              <DropdownMenuItem onSelect={() => setSelectedUser({ ...selectedUser, role: 'user' })}>
                                User
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setSelectedUser({ ...selectedUser, role: 'admin' })}>
                                Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              <DropdownMenuItem onSelect={() => setSelectedUser({ ...selectedUser, status: 'active' })}>
                                Active
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setSelectedUser({ ...selectedUser, status: 'inactive' })}>
                                Inactive
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setSelectedUser({ ...selectedUser, status: 'suspended' })}>
                                Suspended
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        </>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditUserOpen(false)}>Cancel</Button>
                      <Button onClick={handleEditUser} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Delete User Dialog */}
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the user "{selectedUser?.username}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Reset Password Dialog */}
              <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Set a new password for {selectedUser?.username}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setResetPasswordOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetPassword} className="bg-blue-600 hover:bg-blue-700">Reset Password</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default User;