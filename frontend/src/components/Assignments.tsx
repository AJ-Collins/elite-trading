import React from 'react';
import AssignmentCard from './AssignmentCard';
import { useAssignments } from '../hooks/useAssignments';


const Assignments = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id;
  const token = localStorage.getItem('auth_token');
  const { assignments, loading, error, refresh } = useAssignments(userId, token);

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Your assignments</h2>
      </div>
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} onSubmissionSuccess={refresh} />
      ))}
    </div>
  );
};

export default Assignments;