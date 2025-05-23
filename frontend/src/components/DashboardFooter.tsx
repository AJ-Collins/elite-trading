import React from 'react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-auto">
      <p>© {currentYear} Elite Trading Hub . All Rights Reserved</p>
    </footer>
  );
}