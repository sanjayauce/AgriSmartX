import {
    Add as AddIcon,
    Chat as ChatIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Pending as PendingIcon,
    Search as SearchIcon,
    Send as SendIcon,
    Support as SupportIcon
} from '@mui/icons-material';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Support.css';

const Support = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openNewTicket, setOpenNewTicket] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState('');

  // Mock data - replace with actual API calls
  const tickets = [
    {
      id: 'TICKET-001',
      subject: 'Order Processing Issue',
      category: 'Orders',
      status: 'open',
      priority: 'high',
      createdAt: '2024-03-14 10:30',
      lastUpdated: '2024-03-14 11:45',
      messages: [
        {
          id: 1,
          sender: 'Dealer',
          message: 'I am unable to process new orders in the system.',
          timestamp: '2024-03-14 10:30',
        },
        {
          id: 2,
          sender: 'Support',
          message: 'Could you please provide more details about the error you are seeing?',
          timestamp: '2024-03-14 11:45',
        },
      ],
    },
    {
      id: 'TICKET-002',
      subject: 'Payment Gateway Integration',
      category: 'Payments',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-03-13 15:20',
      lastUpdated: '2024-03-14 09:15',
      messages: [
        {
          id: 1,
          sender: 'Dealer',
          message: 'Need help with payment gateway setup.',
          timestamp: '2024-03-13 15:20',
        },
        {
          id: 2,
          sender: 'Support',
          message: 'Here are the steps to integrate the payment gateway...',
          timestamp: '2024-03-14 09:15',
        },
      ],
    },
  ];

  const faqs = [
    {
      question: 'How do I update my inventory?',
      answer: 'You can update your inventory by going to the Inventory section and clicking on the "Add Item" button. You can also edit existing items by clicking the edit icon next to each item.',
      category: 'Inventory',
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We currently support UPI, Bank Transfer, Cash, and Card payments. You can manage your payment methods in the Payments section.',
      category: 'Payments',
    },
    {
      question: 'How do I process a refund?',
      answer: 'To process a refund, go to the Orders section, find the specific order, and click on the "Refund" button. Follow the prompts to complete the refund process.',
      category: 'Orders',
    },
  ];

  const stats = [
    {
      label: t('dealer.openTickets'),
      value: '3',
      icon: <PendingIcon />,
      color: '#FFA726',
    },
    {
      label: t('dealer.resolvedTickets'),
      value: '12',
      icon: <CheckCircleIcon />,
      color: '#4CAF50',
    },
    {
      label: t('dealer.averageResponseTime'),
      value: '2h',
      icon: <ChatIcon />,
      color: '#2196F3',
    },
    {
      label: t('dealer.satisfactionRate'),
      value: '95%',
      icon: <SupportIcon />,
      color: '#9C27B0',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewTicket = () => {
    setOpenNewTicket(true);
  };

  const handleCloseTicket = () => {
    setOpenNewTicket(false);
  };

  const handleFaqExpand = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#FFA726',
      inProgress: '#2196F3',
      resolved: '#4CAF50',
      closed: '#757575',
    };
    return colors[status] || '#757575';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#F44336',
      medium: '#FFA726',
      low: '#4CAF50',
    };
    return colors[priority] || '#757575';
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dealer-support-dashboard">
      <div className="dealer-support-header">
        <h1>{t('dealer.support', 'Support Center')}</h1>
        <p className="dealer-support-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>

      {/* Statistics Cards */}
      <Grid container spacing={3} className="dealer-support-stats">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: stat.color, mr: 1 }}>{stat.icon}</Box>
                  <Typography variant="h6" component="div" style={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="support tabs">
          <Tab label={t('dealer.tickets')} />
          <Tab label={t('dealer.chat')} />
          <Tab label={t('dealer.faq')} />
        </Tabs>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder={t('dealer.searchSupport')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
          }}
        />
        {activeTab === 0 && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewTicket}
          >
            {t('dealer.newTicket')}
          </Button>
        )}
      </Box>

      {/* Tickets Tab Content */}
      {activeTab === 0 && (
        <div className="dealer-support-tickets">
          <List>
            {filteredTickets.map((ticket) => (
              <Paper key={ticket.id} className="ticket-item">
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={t(`dealer.${ticket.status}`)}
                        size="small"
                        style={{ backgroundColor: getStatusColor(ticket.status), color: 'white' }}
                      />
                      <Chip
                        label={t(`dealer.${ticket.priority}`)}
                        size="small"
                        style={{ backgroundColor: getPriorityColor(ticket.priority), color: 'white' }}
                      />
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <SupportIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={ticket.subject}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {ticket.category}
                        </Typography>
                        {' — '}
                        {t('dealer.lastUpdated')}: {ticket.lastUpdated}
                      </>
                    }
                  />
                </ListItem>
                <Divider />
                <Box sx={{ p: 2 }}>
                  {ticket.messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        mb: 2,
                        alignItems: msg.sender === 'Dealer' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {msg.sender === 'Dealer' ? 'D' : 'S'}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {msg.sender} • {msg.timestamp}
                        </Typography>
                      </Box>
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '80%',
                          backgroundColor: msg.sender === 'Dealer' ? '#E3F2FD' : '#F5F5F5',
                        }}
                      >
                        <Typography variant="body2">{msg.message}</Typography>
                      </Paper>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={t('dealer.typeMessage')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <IconButton color="primary">
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>
        </div>
      )}

      {/* Chat Tab Content */}
      {activeTab === 1 && (
        <div className="dealer-support-chat">
          <Paper className="chat-container">
            <Box className="chat-header">
              <Typography variant="h6">
                <Badge color="success" variant="dot" sx={{ mr: 1 }} />
                {t('dealer.liveSupport')}
              </Typography>
            </Box>
            <Box className="chat-messages">
              <Box className="chat-message support">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196F3' }}>S</Avatar>
                <Paper className="message-bubble">
                  <Typography variant="body2">
                    {t('dealer.welcomeMessage')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    10:00 AM
                  </Typography>
                </Paper>
              </Box>
            </Box>
            <Box className="chat-input">
              <TextField
                fullWidth
                size="small"
                placeholder={t('dealer.typeMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton color="primary">
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Paper>
        </div>
      )}

      {/* FAQ Tab Content */}
      {activeTab === 2 && (
        <div className="dealer-support-faq">
          {filteredFaqs.map((faq, index) => (
            <Paper key={index} className="faq-item">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                }}
                onClick={() => handleFaqExpand(index)}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {faq.question}
                  </Typography>
                  <Chip
                    label={faq.category}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                {expandedFaq === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
              {expandedFaq === index && (
                <>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          ))}
        </div>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={openNewTicket} onClose={handleCloseTicket} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('dealer.newTicket')}
          <IconButton
            aria-label="close"
            onClick={handleCloseTicket}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label={t('dealer.subject')}
              fullWidth
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>{t('dealer.category')}</InputLabel>
              <Select
                value={selectedCategory}
                label={t('dealer.category')}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="orders">{t('dealer.orders')}</MenuItem>
                <MenuItem value="payments">{t('dealer.payments')}</MenuItem>
                <MenuItem value="inventory">{t('dealer.inventory')}</MenuItem>
                <MenuItem value="technical">{t('dealer.technical')}</MenuItem>
                <MenuItem value="other">{t('dealer.other')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>{t('dealer.priority')}</InputLabel>
              <Select label={t('dealer.priority')}>
                <MenuItem value="high">{t('dealer.high')}</MenuItem>
                <MenuItem value="medium">{t('dealer.medium')}</MenuItem>
                <MenuItem value="low">{t('dealer.low')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('dealer.description')}
              fullWidth
              multiline
              rows={4}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTicket}>{t('dealer.cancel')}</Button>
          <Button variant="contained" color="primary" onClick={handleCloseTicket}>
            {t('dealer.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Support;
