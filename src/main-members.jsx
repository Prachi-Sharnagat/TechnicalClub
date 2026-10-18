import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import './styles/members.css';
import './styles/faculty.css';
import MembersPage from './pages/MembersPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MembersPage />
  </StrictMode>
);
