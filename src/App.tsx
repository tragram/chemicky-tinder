import { HashRouter as Router, Route, Routes } from "react-router-dom";

import DatingPage from "@/pages/dating";
import MatchScreen from "./components/MatchScreen";

import profiles from '@/dating_profiles.yaml';
import UserInfo from "./components/UserInfo";

function App() {
  return (
    <Router>
        <Routes>
          <Route element={<DatingPage />} path="/" />
          <Route element={<MatchScreen userName={"Nadějný Chemik"} profile={profiles[0]} onContinue={undefined} />} path="/match" />
          <Route element={<UserInfo/>} path="/user" />
        </Routes>
    </Router >
  );
}

export default App;
