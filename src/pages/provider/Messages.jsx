import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../provider/Messages.css';

console.log("👀 Provider Messages.jsx file loaded ✅");

const Messages = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  console.log("🔥 Provider Messages.jsx component RENDERED");
  console.log("📌 Current path:", location.pathname);
  console.log("🧑‍💻 Current user:", user);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🚀 useEffect running...");

    if (!user || !user.role) {
      console.log("❌ No user or role:", user);
      setError('User role not available.');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log(`🔍 Fetching: GET http://localhost:5005/api/admin/getMessages?role=${encodeURIComponent(user.role)}&userId=${user.id}`);
        const response = await axios.get(`http://localhost:5005/api/admin/getMessages`, {
          params: { 
            role: user.role,
            userId: user.id
          }
        });
        console.log("✅ API response:", response.data);

        // ✅ Normalize snake_case to camelCase for consistency
        const normalized = response.data.messages.map(msg => ({
          id: msg.id,
          subject: msg.subject,
          content: msg.content,
          sentAt: msg.sent_at, // map sent_at to sentAt
        }));

        setMessages(normalized);
      } catch (err) {
        console.error("❌ API error:", err);
        setError('Failed to fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

  }, [user?.role, location.pathname]);

  if (loading) {
    return (
      <Box className="page-container">
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="page-container">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="provider-messages-dashboard">
      <div className="provider-messages-header">
        <h1>{t('provider.messages', 'Messages')}</h1>
        <p className="provider-messages-welcome-message">
          {t('welcome')}, {user?.email}!
        </p>
      </div>
      <div className="provider-messages-sections">
        <div className="provider-messages-overview" style={{ width: '100%' }}>
          <h2>{t('provider.messages', 'Messages Overview')}</h2>
          {messages.length === 0 ? (
            <Typography>No messages found for your role.</Typography>
          ) : (
            <div className="provider-messages-activity-list">
              {messages.map((msg) => (
                <Paper key={msg.id} sx={{ mb: 2, p: 2 }}>
                  <Typography variant="h6">{msg.subject}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(msg.sentAt).toLocaleString()}
                  </Typography>
                  <Typography>{msg.content}</Typography>
                </Paper>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
