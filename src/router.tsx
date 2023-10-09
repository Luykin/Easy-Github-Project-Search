import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './view/home/index';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
