
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Button } from '@/components/ui/button';

// Mock data for charts
const userActivityData = [
  { name: 'Jan', users: 400, sessions: 240 },
  { name: 'Feb', users: 300, sessions: 139 },
  { name: 'Mar', users: 200, sessions: 980 },
  { name: 'Apr', users: 278, sessions: 390 },
  { name: 'May', users: 189, sessions: 480 },
  { name: 'Jun', users: 239, sessions: 380 },
  { name: 'Jul', users: 349, sessions: 430 },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const courseData = [
  { name: 'Technical Analysis', value: 40 },
  { name: 'Day Trading', value: 30 },
  { name: 'Forex', value: 20 },
  { name: 'Crypto', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">Last 30 Days</Button>
            <Button variant="outline">Export Report</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold">5,245</p>
            <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold">$42,890</p>
            <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Active Courses</h3>
            <p className="text-4xl font-bold">24</p>
            <p className="text-sm text-gray-600 mt-2">3 added this month</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">User Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userActivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" />
                  <Bar dataKey="sessions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border col-span-1">
            <h3 className="text-lg font-medium mb-4">Course Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border col-span-2">
            <h3 className="text-lg font-medium mb-4">Top Performing Content</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Advanced Forex Strategies</p>
                  <p className="text-sm text-gray-500">Course • Premium</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">$12,450</p>
                  <p className="text-sm text-gray-500">265 enrollments</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Technical Analysis Masterclass</p>
                  <p className="text-sm text-gray-500">Course • Premium</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">$9,870</p>
                  <p className="text-sm text-gray-500">213 enrollments</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Day Trading Live Session</p>
                  <p className="text-sm text-gray-500">Video • Premium</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">$8,320</p>
                  <p className="text-sm text-gray-500">3,211 views</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">Cryptocurrency Trading</p>
                  <p className="text-sm text-gray-500">Course • Premium</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">$7,650</p>
                  <p className="text-sm text-gray-500">167 enrollments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
