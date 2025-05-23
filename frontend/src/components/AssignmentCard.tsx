import React, { useState } from 'react';
import AssignmentSubmissionModal from './AssignmentSubmissionModal';

interface Assignment {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  completedDate: string;
  assignmentFile: string | null;
  score: number;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onSubmissionSuccess: () => void; // Callback to refresh assignments after submission
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onSubmissionSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  console.log('Assignment ID:', assignment.id);
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                assignment.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {assignment.status}
            </span>
            <h3 className="text-lg font-medium mt-2">{assignment.title}</h3>
            <p className="text-sm text-gray-500">{assignment.description}</p>
          </div>
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            {assignment.status === 'PENDING' ? (
              <>
                <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                <button
                  onClick={handleOpenModal}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl text-sm transition-colors"
                >
                  Submit
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">Completed: {assignment.completedDate}</p>
                <p className="text-sm font-medium text-green-600">Score: {assignment.score}%</p>
              </>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AssignmentSubmissionModal
          assignmentId={assignment.id}
          onClose={handleCloseModal}
          onSubmissionSuccess={onSubmissionSuccess}
        />
      )}
    </>
  );
};

export default AssignmentCard;