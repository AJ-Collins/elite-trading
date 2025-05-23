
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Video, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarInset,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator
} from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const mainNavItems: AdminNavItem[] = [
  { title: 'Users', icon: Users, href: '/admin/users' },
  { title: 'Courses', icon: BookOpen, href: '/admin/courses' },
  { title: 'Notes', icon: FileText, href: '/admin/notes' },
  { title: 'Videos', icon: Video, href: '/admin/videos' },
  {title: 'Live Sessions', icon: Video, href: '/admin/sessions' },
  { title: 'Blogs', icon: MessageSquare, href: '/admin/blogs' },
];

const secondaryNavItems: AdminNavItem[] = [
  { title: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { title: 'Settings', icon: Settings, href: '/admin/settings' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

const navigate = useNavigate();

const handleLogout = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar variant="inset">
          <SidebarHeader className="flex items-center px-3 py-4">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.href)}
                        tooltip={item.title}
                      >
                        <Link to={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.href)}
                        tooltip={item.title}
                      >
                        <Link to={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <a onClick={handleLogout} className="cursor-pointer text-sm text-gray-500 hover:text-gray-900">
              Logout
            </a>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
              Back to Website
            </Link>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
