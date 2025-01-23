import { HashRouter as Router, Route, Routes } from "react-router-dom";

import DatingPage from "@/pages/dating";
import MatchScreen from "./components/MatchScreen";

import profiles from '@/dating_profiles.yaml';
import { Provider } from "./provider";

function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route element={<DatingPage />} path="/" />
          <Route element={<MatchScreen userName={"Nadějný Chemik"} profile={profiles[0]} onContinue={undefined} />} path="/match" />
        </Routes>
      </Provider>
    </Router >
  );
}

export default App;
