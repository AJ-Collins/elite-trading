import React, { useState } from 'react';

interface AssignmentSubmissionModalProps {
  assignmentId: number;
  onClose: () => void;
  onSubmissionSuccess: () => void;
}

const AssignmentSubmissionModal: React.FC<AssignmentSubmissionModalProps> = ({
  assignmentId,
  onClose,
  onSubmissionSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedFileTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (allowedFileTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError('Please select a PDF or image file (PNG, JPEG, JPG, GIF, WebP).');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const API_URL = 'http://localhost:1337';
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      // Step 1: Upload the file to Strapi
      const formData = new FormData();
      formData.append('files', file);

      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || 'Failed to upload file');
      }

      if (!uploadData[0]?.id) {
        throw new Error('File upload failed: No file ID returned');
      }

      const fileId = uploadData[0].id;

      // Step 2: Update the assignment with the file ID, status, and completedDate
      const updateRes = await fetch(`${API_URL}/api/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            assignmentFile: fileId,
            AssignmentStatus: 'COMPLETED',
            completedDate: new Date().toISOString(),
          },
        }),
      });
      
      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        throw new Error(updateData.error?.message || 'Failed to update assignment');
      }

      // Success: Close modal and refresh assignments
      onSubmissionSuccess();
      onClose();
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-medium mb-4">Submit Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-2">
              Upload PDF or Image
            </label>
            <input
              type="file"
              id="fileInput"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm disabled:bg-green-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmissionModal;