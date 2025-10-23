import React, { useState } from 'react';
import './TicketForm.css';

const TicketForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  submitText = 'Submit',
  title = 'Ticket Form'
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    priority: initialData.priority || ''
  });
  
  const [errors, setErrors] = useState({});

  const categories = [
    'IT Support',
    'Facility Management',
    'Academic',
    'Library',
    'Hostel',
    'Other'
  ];

  const priorities = [
    { value: 'Low', label: 'Low', description: 'Minor issues, can wait for regular business hours' },
    { value: 'Medium', label: 'Medium', description: 'Standard issues affecting daily work' },
    { value: 'High', label: 'High', description: 'Important issues requiring prompt attention' },
    { value: 'Critical', label: 'Critical', description: 'Urgent issues blocking critical operations' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="ticket-form-container">
      <div className="ticket-form-header">
        <h2>{title}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter ticket title"
            maxLength={100}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
          <div className="char-count">{formData.title.length}/100</div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Describe your issue in detail"
            rows={5}
            maxLength={1000}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
          <div className="char-count">{formData.description.length}/1000</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-select ${errors.category ? 'error' : ''}`}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority <span className="required">*</span>
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`form-select ${errors.priority ? 'error' : ''}`}
            >
              <option value="">Select Priority</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            {errors.priority && <span className="error-message">{errors.priority}</span>}
          </div>
        </div>

        {/* Priority Guide - Centered below Category and Priority */}
        <div className="priority-guide-section">
          <div className="priority-guide">
            <h4>Priority Guidelines:</h4>
            {priorities.map(priority => (
              <div 
                key={priority.value} 
                className={`priority-item ${formData.priority === priority.value ? 'selected' : ''}`}
              >
                <span className={`priority-badge ${priority.value.toLowerCase()}`}>
                  {priority.label}
                </span>
                <span className="priority-description">
                  {priority.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;