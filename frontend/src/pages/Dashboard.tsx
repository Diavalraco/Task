import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceApi, employeeApi } from '../services/api';
import { AttendanceStatus, User } from '../types';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [todayStatus, setTodayStatus] = useState<AttendanceStatus | null>(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const status = await attendanceApi.getTodayStatus();
      setTodayStatus(status);

      if (isAdmin) {
        const { employees } = await employeeApi.getAll();
        setEmployeeCount(employees.length);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      await attendanceApi.checkIn();
      setMessage({ type: 'success', text: 'Checked in successfully!' });
      fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: error.response?.data?.message || 'Check-in failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage(null);
    try {
      await attendanceApi.checkOut();
      setMessage({ type: 'success', text: 'Checked out successfully!' });
      fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: error.response?.data?.message || 'Check-out failed' });
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
          }`}
        >
          <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  todayStatus?.checkedOut
                    ? 'bg-green-100 text-green-700'
                    : todayStatus?.checkedIn
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {todayStatus?.checkedOut ? 'Completed' : todayStatus?.checkedIn ? 'In Progress' : 'Not Started'}
              </span>
            </div>
            {todayStatus?.attendance?.checkIn && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check In</span>
                <span className="text-gray-900 font-medium">
                  {format(new Date(todayStatus.attendance.checkIn), 'h:mm a')}
                </span>
              </div>
            )}
            {todayStatus?.attendance?.checkOut && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Check Out</span>
                <span className="text-gray-900 font-medium">
                  {format(new Date(todayStatus.attendance.checkOut), 'h:mm a')}
                </span>
              </div>
            )}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCheckIn}
                disabled={todayStatus?.checkedIn || actionLoading}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todayStatus?.checkedIn || todayStatus?.checkedOut || actionLoading}
                className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Name</span>
              <span className="text-gray-900 font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Role</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                {user?.role}
              </span>
            </div>
            {user?.department && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Department</span>
                <span className="text-gray-900 font-medium">{user?.department}</span>
              </div>
            )}
            {user?.position && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Position</span>
                <span className="text-gray-900 font-medium">{user?.position}</span>
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-3xl font-bold text-indigo-600">{employeeCount}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
