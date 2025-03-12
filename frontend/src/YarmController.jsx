import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, RotateCw, ArrowUp, ArrowDown, Grab, HandMetal } from "lucide-react";

function YarmController() {
  const [motorStatus, setMotorStatus] = useState({
    base: "IDLE",
    elbow: "IDLE",
    wrist: "IDLE"
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendMotorCommand = async (motor, command) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://192.168.31.220/yarm?motor=${motor}&command=${command}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const responseText = await response.text();
      console.log(`Motor: ${motor}, Command: ${command}`);
      console.log(responseText);

      setMotorStatus({
        ...motorStatus,
        [motor]: command
      });
      
      // Reset status to IDLE after 2 seconds
      setTimeout(() => {
        setMotorStatus({
          ...motorStatus,
          [motor]: "IDLE"
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "IDLE": return "bg-gray-700";
      case "CLOCKWISE": return "bg-blue-600";
      case "ANTICLOCKWISE": return "bg-green-600";
      case "UP": return "bg-blue-600";
      case "DOWN": return "bg-green-600";
      case "GRAB": return "bg-purple-600";
      case "EASE": return "bg-yellow-600";
      default: return "bg-gray-700";
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-white">Robotic Arm Controller</CardTitle>
        <CardDescription className="text-gray-400">
          Control the movement of your robotic arm
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Base Motor Controls */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg text-white font-medium">Base Motor</h3>
            <Badge 
              className={`${getStatusColor(motorStatus.base)} px-3`}
            >
              {motorStatus.base}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4"
              onClick={() => sendMotorCommand("base", "CLOCKWISE")}
              disabled={isLoading}
            >
              <RotateCw className="mr-2 h-5 w-5" />
              Clockwise
            </Button>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4"
              onClick={() => sendMotorCommand("base", "ANTICLOCKWISE")}
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Anti-clockwise
            </Button>
          </div>
        </div>

        {/* Elbow Motor Controls */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg text-white font-medium">Elbow Motor</h3>
            <Badge 
              className={`${getStatusColor(motorStatus.elbow)} px-3`}
            >
              {motorStatus.elbow}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4"
              onClick={() => sendMotorCommand("elbow", "UP")}
              disabled={isLoading}
            >
              <ArrowUp className="mr-2 h-5 w-5" />
              Up
            </Button>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-4"
              onClick={() => sendMotorCommand("elbow", "DOWN")}
              disabled={isLoading}
            >
              <ArrowDown className="mr-2 h-5 w-5" />
              Down
            </Button>
          </div>
        </div>

        {/* Wrist Motor Controls */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg text-white font-medium">Wrist Motor</h3>
            <Badge 
              className={`${getStatusColor(motorStatus.wrist)} px-3`}
            >
              {motorStatus.wrist}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="default" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4"
              onClick={() => sendMotorCommand("wrist", "GRAB")}
              disabled={isLoading}
            >
              <Grab className="mr-2 h-5 w-5" />
              Grab
            </Button>
            <Button 
              variant="default" 
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-4"
              onClick={() => sendMotorCommand("wrist", "EASE")}
              disabled={isLoading}
            >
              <HandMetal className="mr-2 h-5 w-5" />
              Ease
            </Button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <p>Status: All motors will return to IDLE after command execution</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default YarmController;