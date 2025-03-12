import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FlashController from "./FlashController";
import YarmController from "./YarmController";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-950 text-gray-200">
        <nav className="py-4 px-6 bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">ESP32 Control Panel</h1>
            <div className="flex gap-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  LED Control
                </Button>
              </Link>
              <Link to="/yarm">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Robotic Arm
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="flex-grow flex items-center justify-center">
          <Routes>
            <Route path="/" element={<FlashController />} />
            <Route path="/yarm" element={<YarmController />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;