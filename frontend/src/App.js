import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';
import Chat from './pages/Chat';
import { Provider } from 'react-redux';
import store from './store/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Nav from './components/navComponents/Nav';
import Box from '@mui/material/Box';
import Expenses from './pages/Expenses';
import Account from './pages/Account';


// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Nav />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </Box>
          </Box>
        </Provider>   
      </ThemeProvider>
    </Router>
  );
}

export default App;
