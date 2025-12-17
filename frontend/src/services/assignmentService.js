import api from './api';

// Get driver recommendations for a load
export const getRecommendations = (loadId) =>
  api.post('/assignment/recommend', { loadId });

// Manually assign a load to a driver
export const assignLoad = (loadId, driverId, isOverride = false) =>
  api.post('/assignment/assign', { loadId, driverId, isOverride });

// Auto-assign a load to the best driver
export const autoAssign = (loadId) =>
  api.post('/assignment/auto-assign', { loadId });

// Auto-assign all pending loads
export const autoAssignAll = () =>
  api.post('/assignment/auto-assign-all');

// Get overload prediction for driver-load combination
export const getOverloadPrediction = (driverId, loadId) =>
  api.get(`/assignment/overload/${driverId}/${loadId}`);

// Get suitability score for driver-load combination
export const getSuitabilityScore = (driverId, loadId) =>
  api.get(`/assignment/suitability/${driverId}/${loadId}`);

// Check driver eligibility for a load
export const checkEligibility = (driverId, loadId) =>
  api.get(`/assignment/eligibility/${driverId}/${loadId}`);

// Get all assignments with optional filters
export const getAssignments = (filters = {}) => {
  // Ensure date is in YYYY-MM-DD string format
  if (filters.date) {
    if (filters.date instanceof Date) {
      const year = filters.date.getFullYear();
      const month = String(filters.date.getMonth() + 1).padStart(2, '0');
      const day = String(filters.date.getDate()).padStart(2, '0');
      filters.date = `${year}-${month}-${day}`;
    } else if (typeof filters.date === 'string') {
      filters.date = filters.date.split('T')[0];
    }
  }

  return api.get('/assignment/list', { params: filters });
};

// Get assignment statistics
export const getAssignmentStats = () =>
  api.get('/assignment/stats');

// Update assignment status
export const updateAssignmentStatus = (assignmentId, status) =>
  api.patch(`/assignment/${assignmentId}/status`, { status });
