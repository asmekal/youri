# component_store.py
from typing import List, Dict, Optional
import re

class ComponentStore:
    def __init__(self):
        self._components: List[Dict] = []
    
    def add_component(self, component: Dict) -> None:
        self._components.append(component)
    
    def get_component(self, component_id: str) -> Optional[Dict]:
        return next((comp for comp in self._components if comp["component_id"] == component_id), None)
    
    def update_component(self, component_id: str, new_code: str) -> None:
        component = self.get_component(component_id)
        if component:
            component["code"] = new_code
    
    def get_all_components(self) -> List[Dict]:
        return self._components
    
    def extract_tags(self, intent: str) -> List[str]:
        # Simple tag extraction - split on spaces and common punctuation
        words = re.findall(r'\w+', intent.lower())
        # Filter out common words
        stop_words = {'a', 'an', 'the', 'in', 'on', 'at', 'for', 'to', 'of', 'with'}
        return [word for word in words if word not in stop_words]
    
    def find_similar_components(self, intent: str) -> List[Dict]:
        intent_tags = set(self.extract_tags(intent))
        similar_components = []
        
        for component in self._components:
            component_tags = set(component["tags"])
            if len(intent_tags.intersection(component_tags)) > 0:
                similar_components.append(component)
        
        return similar_components[:3]  # Return top 3 similar components


# Initialize with default components
DEFAULT_COMPONENTS = [
    {
        "component_id": "mock_weather_widget",
        "name": "Mock Weather Now",
        "tags": ["mock", "weather", "now"],
        "code": """
const WeatherWidget = () => {
    return (
        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6">Weather Widget</Typography>
            <Typography variant="body1">It's sunny and 25°C outside.</Typography>
        </Paper>
    );
};

export default WeatherWidget;
""",
    },
    {
        "component_id": "empty_component",
        "name": "Empty Component",
        "tags": ["empty", "default", "dynamic"],
        "code": """
const DefaultComponent = () => {
    return (
        <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="h6">Default Component</Typography>
            <Typography variant="body1">This is a dynamically generated component.</Typography>
        </Paper>
    );
};

export default DefaultComponent;
""",
    },
    {
        "component_id": "basic_email_client",
        "name": "Basic email client",
        "tags": ["default", "email"],
        "code": """
const EmailClient = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Fetch emails on component mount
  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await listMessages({
        userId: 'me',
        maxResults: 10,
        labelIds: ['INBOX'],
      });

      const messagePromises = response.messages.map((msg) =>
        getMessage({ userId: 'me', id: msg.id, format: 'full' })
      );

      const messages = await Promise.all(messagePromises);
      setEmails(messages);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleEmailSelect = async (email) => {
    try {
      const fullEmail = await getMessage({ userId: 'me', id: email.id, format: 'full' });
      setSelectedEmail(fullEmail);

      // Mark as read if it's unread
      if (!fullEmail.read) {
        await modifyMessage({
          userId: 'me',
          id: email.id,
          resource: { removeLabelIds: ['UNREAD'] },
        });
        // Update local state
        setEmails((prevEmails) =>
          prevEmails.map((e) =>
            e.id === email.id ? { ...e, read: true } : e
          )
        );
      }
    } catch (error) {
      console.error('Error selecting email:', error);
    }
  };

  const handleComposeOpen = () => {
    setIsComposeOpen(true);
  };

  const handleComposeClose = () => {
    setIsComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  const handleSendEmail = async () => {
    try {
      const rawMessage = btoa(
        `From: you@example.com\r\nTo: ${composeTo}\r\nSubject: ${composeSubject}\r\n\r\n${composeBody}`
      )
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const sentEmail = await sendMessage({
        userId: 'me',
        resource: {
          raw: rawMessage,
        },
      });

      // Refresh email list
      fetchEmails();
      handleComposeClose();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={2}>
        {/* Email List */}
        <Grid item xs={4}>
          <List>
            {emails.map((email) => (
              <div key={email.id}>
                <ListItem button onClick={() => handleEmailSelect(email)}>
                  <ListItemIcon>
                    <Badge
                      color="secondary"
                      variant="dot"
                      invisible={email.read}
                    >
                      <MailIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={email.payload.headers.find((h) => h.name === 'Subject')?.value || 'No Subject'}
                    secondary={
                      `${email.payload.headers.find((h) => h.name === 'From')?.value || 'Unknown Sender'} - ` +
                      new Date(parseInt(email.internalDate)).toLocaleDateString()
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Grid>

        {/* Email Content */}
        <Grid item xs={8}>
          {selectedEmail ? (
            <Paper style={{ padding: 20 }}>
              <Typography variant="h4">
                {selectedEmail.payload.headers.find((h) => h.name === 'Subject')?.value || 'No Subject'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                From: {selectedEmail.payload.headers.find((h) => h.name === 'From')?.value || 'Unknown Sender'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                To: {selectedEmail.payload.headers.find((h) => h.name === 'To')?.value || 'Unknown Recipient'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Date: {new Date(parseInt(selectedEmail.internalDate)).toLocaleString()}
              </Typography>
              <Typography variant="body1" style={{ marginTop: 20 }}>
                {decodeBase64(selectedEmail.payload.body.data)}
              </Typography>
            </Paper>
          ) : (
            <Paper style={{ padding: 20 }}>
              <Typography variant="h6">Select an email to read</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Compose Button */}
      <Fab
        color="primary"
        aria-label="compose"
        onClick={handleComposeOpen}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        <AddIcon />
      </Fab>

      {/* Compose Dialog */}
      <Dialog open={isComposeOpen} onClose={handleComposeClose} fullWidth maxWidth="sm">
        <DialogTitle>New Email</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="To"
            type="email"
            fullWidth
            value={composeTo}
            onChange={(e) => setComposeTo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Subject"
            type="text"
            fullWidth
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={composeBody}
            onChange={(e) => setComposeBody(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleComposeClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendEmail} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EmailClient;
""",
    },
    {
        "component_id": "weather",
        "name": "Weather component",
        "tags": ["simple", "weather"],
        "code": """
const WeatherApp = () => {
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch coordinates for the city
  const fetchCoordinates = async (cityName) => {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { latitude, longitude } = data.results[0];
        return { latitude, longitude };
      } else {
        alert("City not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Fetch weather data
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const coords = await fetchCoordinates(city);
      if (coords) {
        const { latitude, longitude } = coords;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await response.json();
        setWeatherData(data.current_weather);
      } else {
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(); // Fetch weather data on component mount
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card style={{ width: "400px", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Weather App
          </Typography>
          <TextField
            fullWidth
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" fullWidth onClick={fetchWeather}>
            Get Weather
          </Button>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <CircularProgress />
            </div>
          ) : weatherData ? (
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h6">Weather in {city}</Typography>
              <Typography variant="body1">Temperature: {weatherData.temperature}°C</Typography>
              <Typography variant="body1">Wind Speed: {weatherData.windspeed} km/h</Typography>
              <Typography variant="body1">Condition: {weatherData.weathercode}</Typography>
            </div>
          ) : (
            <Typography variant="body2" color="textSecondary" style={{ marginTop: "20px" }}>
              No data available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherApp;
"""
    }

]



