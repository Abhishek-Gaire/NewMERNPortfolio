import React from 'react';
import { Clock, Calendar, Users, AlertTriangle } from 'lucide-react';
import { AdminProject } from '../../../types/project';
import { formatDate } from '../../../utils/dateUtils';

interface ProjectHeaderProps {
  project: AdminProject;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priorityLevel)}`}>
            {project.priorityLevel} Priority
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{formatDate(project.startDate)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-400 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium">{formatDate(project.expectedCompletionDate)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Users className="w-5 h-5 text-gray-400 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Team Size</p>
            <p className="font-medium">{project.teamMembers?.length || 0} Members</p>
          </div>
        </div>
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-gray-400 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Open Tasks</p>
            <p className="font-medium">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}