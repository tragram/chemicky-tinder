import { Route, Routes } from "react-router-dom";

import DatingPage from "@/pages/dating";

function App() {
  return (
    <Routes>
      <Route element={<DatingPage />} path="/kachekran-tinder/" />
    </Routes>
  );
}

export default App;
