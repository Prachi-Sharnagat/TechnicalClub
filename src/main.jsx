import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/base.css';
import './styles/home.css';
import './styles/graphics.css';
import './styles/webdev.css';
import './styles/members.css';
import './styles/electronics.css';
import './styles/video.css';
import './styles/events.css';
import './styles/register.css';
import './styles/site.css';
import './styles/chatbot.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
