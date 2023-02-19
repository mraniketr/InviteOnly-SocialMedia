import "./App.css";

import ProtectedRoute from "./Components/Security/protectedRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import cookies from "./APIComponents/cookieMaker";
import Navbar from "./Components/UI/Navbar";

import FamilyDirectory from "./pages/Services/FamilyDirectory";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Footer from "./Components/UI/Footer";
import Article from "./pages/Article";
import VisionMission from "./pages/Services/VisionMission";
import History from "./pages/Services/History";
import Contact from "./pages/Services/Contact";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(cookies.get("isLoggedIn"));
    console.log = function () {};
  }, []);

  return (
    <Router>
      {isLoggedIn ? <Navbar /> : ""}
      <div className="App">
        <Switch>
          <Route
            exact
            path="/login"
            component={isLoggedIn ? Services : Login}
          />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/Services" component={Services} />
          <ProtectedRoute exact path="/history" component={History} />
          <ProtectedRoute exact path="/contact" component={Contact} />

          <ProtectedRoute
            exact
            path="/Vision-Mission"
            component={VisionMission}
          />
          <ProtectedRoute
            exact
            path="/family-directory"
            component={FamilyDirectory}
          />
          <ProtectedRoute exact path="/article/:id" component={Article} />
          <ProtectedRoute exact path="/profile" component={Profile} />
          <Route path="*" component={isLoggedIn ? Services : Login} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
