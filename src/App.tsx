import { Route, Routes } from "react-router-dom";

import DatingPage from "@/pages/dating";
import MatchScreen from "./components/MatchScreen";

import profiles from '@/dating_profiles.yaml';

function App() {
  return (
    <Routes>
      <Route element={<DatingPage />} path="/kachekran-tinder/" />
      <Route element={<MatchScreen userName={"Nadějný Chemik"} profile={profiles[0]} onContinue={undefined} />} path="/kachekran-tinder/match" />
    </Routes>
  );
}

export default App;
