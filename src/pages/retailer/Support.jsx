import React, { useState } from 'react';
import { FaBook, FaCheckCircle, FaClock, FaEnvelope, FaExclamationCircle, FaFilter, FaHeadset, FaPaperclip, FaPhone, FaQuestionCircle, FaRegStar, FaReply, FaSearch, FaSort, FaStar, FaStarHalfAlt, FaTicketAlt, FaTimesCircle, FaWhatsapp } from 'react-icons/fa';
import './Support.css';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicketForm, setNewTicketForm] = useState(false);

  // Sample data for support statistics
  const supportStats = [
    {
      label: 'Open Tickets',
      value: '12',
      trend: '-3',
      trendDirection: 'down',
      icon: <FaTicketAlt />,
      subLabel: 'Active support requests'
    },
    {
      label: 'Avg. Response Time',
      value: '2.5h',
      trend: '-0.5h',
      trendDirection: 'down',
      icon: <FaClock />,
      subLabel: 'Time to first response'
    },
    {
      label: 'Resolution Rate',
      value: '94%',
      trend: '+2%',
      trendDirection: 'up',
      icon: <FaCheckCircle />,
      subLabel: 'Tickets resolved'
    },
    {
      label: 'Customer Satisfaction',
      value: '4.7',
      trend: '+0.1',
      trendDirection: 'up',
      icon: <FaStar />,
      subLabel: 'Out of 5.0'
    }
  ];

  // Sample data for support tickets
  const supportTickets = [
    {
      id: 'TICKET001',
      subject: 'Order Delivery Delay',
      customer: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43210'
      },
      category: 'Delivery',
      priority: 'high',
      status: 'open',
      createdAt: '2024-02-18 14:30',
      lastUpdated: '2024-02-18 15:45',
      messages: [
        {
          sender: 'customer',
          message: 'My order #ORD001 was supposed to be delivered today but hasn\'t arrived yet. Can you please check the status?',
          timestamp: '2024-02-18 14:30',
          attachments: []
        },
        {
          sender: 'support',
          message: 'I apologize for the delay. Let me check the status of your order and get back to you shortly.',
          timestamp: '2024-02-18 15:45',
          attachments: []
        }
      ]
    },
    {
      id: 'TICKET002',
      subject: 'Product Quality Issue',
      customer: {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91 87654 32109'
      },
      category: 'Product',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-02-17 10:15',
      lastUpdated: '2024-02-18 09:30',
      messages: [
        {
          sender: 'customer',
          message: 'The vegetables I received in order #ORD003 were not fresh. Some items were wilted.',
          timestamp: '2024-02-17 10:15',
          attachments: ['vegetables_photo.jpg']
        },
        {
          sender: 'support',
          message: 'I\'m sorry to hear about this. Could you please share photos of the items? We\'ll arrange a replacement immediately.',
          timestamp: '2024-02-17 11:30',
          attachments: []
        },
        {
          sender: 'customer',
          message: 'I\'ve attached the photos. Please process the replacement soon.',
          timestamp: '2024-02-18 09:30',
          attachments: ['damaged_items.jpg']
        }
      ]
    },
    {
      id: 'TICKET003',
      subject: 'Payment Refund Request',
      customer: {
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91 76543 21098'
      },
      category: 'Payment',
      priority: 'high',
      status: 'resolved',
      createdAt: '2024-02-16 16:45',
      lastUpdated: '2024-02-17 14:20',
      messages: [
        {
          sender: 'customer',
          message: 'I need a refund for order #ORD005 as the items were damaged during delivery.',
          timestamp: '2024-02-16 16:45',
          attachments: ['damage_evidence.jpg']
        },
        {
          sender: 'support',
          message: 'I understand your concern. I\'ve initiated the refund process. You should receive the amount in 3-5 business days.',
          timestamp: '2024-02-17 14:20',
          attachments: ['refund_confirmation.pdf']
        }
      ]
    }
  ];

  // Sample data for quick resources
  const quickResources = [
    {
      title: 'FAQs',
      icon: <FaQuestionCircle />,
      description: 'Common questions and answers',
      link: '#faqs'
    },
    {
      title: 'User Guide',
      icon: <FaBook />,
      description: 'Detailed platform documentation',
      link: '#guide'
    },
    {
      title: 'Contact Support',
      icon: <FaHeadset />,
      description: 'Get help from our team',
      link: '#contact'
    }
  ];

  // Sample data for contact methods
  const contactMethods = [
    {
      method: 'Phone Support',
      icon: <FaPhone />,
      details: '+91 1800-123-4567',
      availability: 'Mon-Sat, 9 AM - 6 PM'
    },
    {
      method: 'Email Support',
      icon: <FaEnvelope />,
      details: 'support@agrihelp.com',
      availability: '24/7'
    },
    {
      method: 'WhatsApp',
      icon: <FaWhatsapp />,
      details: '+91 98765 43210',
      availability: 'Mon-Sat, 9 AM - 8 PM'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaExclamationCircle />;
      case 'in_progress':
        return <FaClock />;
      case 'resolved':
        return <FaCheckCircle />;
      case 'closed':
        return <FaTimesCircle />;
      default:
        return <FaTicketAlt />;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="star half" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="star" />);
    }
    return stars;
  };

  return (
    <div className="retailer-support">
      <div className="support-header">
        <div className="header-content">
          <h1>Support Center</h1>
          <p className="welcome-message">Manage customer support requests and access help resources</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn" onClick={() => setNewTicketForm(true)}>
            <FaTicketAlt /> New Support Ticket
          </button>
        </div>
      </div>

      <div className="support-grid">
        <div className="main-content">
          <div className="support-section">
            <div className="statistics-grid">
              {supportStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h3>{stat.label}</h3>
                    <div className="stat-value">{stat.value}</div>
                    <div className={`stat-trend ${stat.trendDirection}`}>
                      {stat.trend}
                    </div>
                    <div className="stat-sub-label">{stat.subLabel}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="filters-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tickets by ID, subject, or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filters-group">
                <div className="filter-item">
                  <FaFilter className="filter-icon" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="filter-item">
                  <FaSort className="sort-icon" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="tickets-list">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="ticket-header">
                    <div className="ticket-info">
                      <span className="ticket-id">{ticket.id}</span>
                      <span className={`ticket-status ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)} {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="ticket-priority">
                      <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="ticket-details">
                    <div className="ticket-main">
                      <h3 className="ticket-subject">{ticket.subject}</h3>
                      <div className="ticket-category">{ticket.category}</div>
                      <div className="ticket-customer">
                        <div className="customer-info">
                          <span className="customer-name">{ticket.customer.name}</span>
                          <span className="customer-contact">{ticket.customer.email}</span>
                          <span className="customer-contact">{ticket.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-timeline">
                      <div className="timeline-item">
                        <span className="timeline-label">Created</span>
                        <span className="timeline-value">{ticket.createdAt}</span>
                      </div>
                      <div className="timeline-item">
                        <span className="timeline-label">Last Updated</span>
                        <span className="timeline-value">{ticket.lastUpdated}</span>
                      </div>
                    </div>

                    <div className="ticket-messages">
                      <h4>Conversation</h4>
                      <div className="messages-list">
                        {ticket.messages.map((message, index) => (
                          <div key={index} className={`message ${message.sender}`}>
                            <div className="message-header">
                              <span className="message-sender">
                                {message.sender === 'customer' ? ticket.customer.name : 'Support Team'}
                              </span>
                              <span className="message-time">{message.timestamp}</span>
                            </div>
                            <div className="message-content">
                              <p>{message.message}</p>
                              {message.attachments.length > 0 && (
                                <div className="message-attachments">
                                  {message.attachments.map((attachment, idx) => (
                                    <div key={idx} className="attachment">
                                      <FaPaperclip className="attachment-icon" />
                                      <span className="attachment-name">{attachment}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ticket-actions">
                      <button className="action-btn reply">
                        <FaReply /> Reply
                      </button>
                      <button className="action-btn resolve">
                        <FaCheckCircle /> Resolve
                      </button>
                      <button className="action-btn close">
                        <FaTimesCircle /> Close
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="support-sidebar">
          <div className="sidebar-section">
            <h2>Quick Resources</h2>
            <div className="resources-list">
              {quickResources.map((resource, index) => (
                <a key={index} href={resource.link} className="resource-card">
                  <div className="resource-icon">{resource.icon}</div>
                  <div className="resource-content">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h2>Contact Support</h2>
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-details">
                    <h3>{method.method}</h3>
                    <p className="method-info">{method.details}</p>
                    <p className="method-availability">{method.availability}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {newTicketForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Support Ticket</h2>
            <form className="ticket-form">
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="Enter ticket subject" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select>
                  <option value="delivery">Delivery</option>
                  <option value="product">Product</option>
                  <option value="payment">Payment</option>
                  <option value="technical">Technical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe your issue in detail"></textarea>
              </div>
              <div className="form-group">
                <label>Attachments</label>
                <input type="file" multiple />
              </div>
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={() => setNewTicketForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
