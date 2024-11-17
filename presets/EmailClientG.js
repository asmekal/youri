// App.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Inbox, Send, Star, Delete, Edit } from '@mui/icons-material';
import { gapi } from 'gapi-script';

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY'; // Optional if you enabled API Key
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

const App = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('inbox');

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
          scope: SCOPES,
        })
        .then(
          () => {
            const authInstance = gapi.auth2.getAuthInstance();
            setSignedIn(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(setSignedIn);
            if (authInstance.isSignedIn.get()) {
              loadEmails();
            }
          },
          (error) => {
            console.error('Error initializing GAPI client:', error);
          }
        );
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEmails([]);
    setSelectedEmail(null);
  };

  const loadEmails = () => {
    setLoading(true);
    gapi.client.gmail.users.messages
      .list({
        userId: 'me',
        labelIds: selectedFolder.toUpperCase(),
        maxResults: 20,
      })
      .then((response) => {
        const messages = response.result.messages || [];
        const batch = gapi.client.newBatch();

        messages.forEach((message) => {
          batch.add(
            gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'metadata',
              metadataHeaders: ['From', 'To', 'Subject', 'Date'],
            })
          );
        });

        batch
          .then((batchResponse) => {
            const emailData = Object.values(batchResponse.result).map((res) => {
              const headers = res.result.payload.headers;
              const email = {
                id: res.result.id,
                threadId: res.result.threadId,
                snippet: res.result.snippet,
                labelIds: res.result.labelIds,
              };
              headers.forEach((header) => {
                if (header.name === 'From') email.from = header.value;
                if (header.name === 'To') email.to = header.value;
                if (header.name === 'Subject') email.subject = header.value;
                if (header.name === 'Date') email.date = new Date(header.value).toLocaleString();
              });
              return email;
            });
            setEmails(emailData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching email details:', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error fetching emails:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (signedIn) {
      loadEmails();
    }
  }, [signedIn, selectedFolder]);

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', height: '100vh', padding: 0 }}>
      {/* Sidebar */}
      <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240, p: 2 }}>
          {signedIn ? (
            <Button variant="contained" fullWidth startIcon={<Edit />} disabled>
              Compose
            </Button>
          ) : (
            <Button variant="contained" fullWidth onClick={handleSignIn}>
              Sign In
            </Button>
          )}
          <List>
            <ListItem
              button
              selected={selectedFolder === 'inbox'}
              onClick={() => setSelectedFolder('inbox')}
            >
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
            <ListItem
              button
              selected={selectedFolder === 'sent'}
              onClick={() => setSelectedFolder('sent')}
            >
              <ListItemIcon>
                <Send />
              </ListItemIcon>
              <ListItemText primary="Sent" />
            </ListItem>
            <ListItem
              button
              selected={selectedFolder === 'starred'}
              onClick={() => setSelectedFolder('starred')}
            >
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItem>
            <ListItem
              button
              selected={selectedFolder === 'trash'}
              onClick={() => setSelectedFolder('trash')}
            >
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText primary="Trash" />
            </ListItem>
          </List>
          {signedIn && (
            <Button variant="outlined" fullWidth onClick={handleSignOut} sx={{ mt: 2 }}>
              Sign Out
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        {/* Email List */}
        <Box sx={{ width: '35%', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : emails.length > 0 ? (
            emails.map((email) => (
              <Paper
                key={email.id}
                sx={{
                  margin: 1,
                  padding: 2,
                  cursor: 'pointer',
                  backgroundColor: selectedEmail?.id === email.id ? '#e0e0e0' : '#ffffff',
                }}
                onClick={() => {
                  setSelectedEmail(email);
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {email.from}
                </Typography>
                <Typography variant="body1">{email.subject}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {email.date}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" sx={{ padding: 2 }}>
              No emails to display.
            </Typography>
          )}
        </Box>

        {/* Email Detail View */}
        <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
          {selectedEmail ? (
            <Paper elevation={2} sx={{ padding: 2, margin: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedEmail.subject}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                From: {selectedEmail.from}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To: {selectedEmail.to}
              </Typography>
              <Typography sx={{ marginTop: 2 }}>{selectedEmail.snippet}</Typography>
            </Paper>
          ) : (
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Select an email to read
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default App;
