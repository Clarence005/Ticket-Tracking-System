// Ticket categories
const TICKET_CATEGORIES = [
  'IT Support',
  'Facility Management',
  'Academic',
  'Library',
  'Hostel',
  'Other'
];

// Ticket priorities
const TICKET_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

// Ticket statuses
const TICKET_STATUSES = [
  'open',
  'In Progress',
  'Resolved',
  'Closed'
];

// User roles
const USER_ROLES = [
  'student',
  'admin'
];

// Validation limits
const VALIDATION_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 1000,
  COMMENT_MAX: 500,
  STUDENT_ID_MAX: 20,
  PASSWORD_MIN: 6
};

module.exports = {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  USER_ROLES,
  VALIDATION_LIMITS
};