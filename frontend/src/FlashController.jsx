import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PowerIcon, LightbulbIcon, AlertCircleIcon } from "lucide-react";

function FlashController() {
  const [ledStatus, setLedStatus] = useState("OFF");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState("checking");

  // Backend server URL - store this in an environment variable in production
  const API_URL = "https://your-backend-domain.com/api";

  // Check server health on component mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
          setServerStatus("connected");
        } else {
          setServerStatus("disconnected");
        }
      } catch (error) {
        setServerStatus("disconnected");
      }
    };

    checkServerHealth();
    // You could set up a periodic health check here if needed
  }, [API_URL]);

  const sendSignal = async (state) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/led?state=${state}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to control LED");
      }

      const responseText = await response.text();
      console.log(`Sent: ${state}`);
      console.log(responseText);

      setLedStatus(state === "1" ? "FLASHING" : "OFF");
    } catch (error) {
      console.error("Error sending request:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-white">ESP32 LED Control</CardTitle>
          <div className="flex gap-2">
            <Badge 
              variant={serverStatus === "connected" ? "outline" : "secondary"}
              className={`${serverStatus === "connected" ? "border-green-500 text-green-500" : "bg-gray-700"} px-3`}
            >
              {serverStatus === "connected" ? "Server Connected" : "Server Disconnected"}
            </Badge>
            <Badge 
              variant={ledStatus === "FLASHING" ? "default" : "secondary"}
              className={`${ledStatus === "FLASHING" ? "bg-green-600 hover:bg-green-700" : "bg-gray-700"} px-3`}
            >
              {ledStatus}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Control the flash pattern of your ESP32 LED
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6"
            onClick={() => sendSignal("1")}
            disabled={isLoading || ledStatus === "FLASHING" || serverStatus !== "connected"}
          >
            <LightbulbIcon className="mr-2 h-5 w-5" />
            Start Flashing
          </Button>
          <Button 
            variant="destructive" 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-6"
            onClick={() => sendSignal("0")}
            disabled={isLoading || ledStatus === "OFF" || serverStatus !== "connected"}
          >
            <PowerIcon className="mr-2 h-5 w-5" />
            Turn Off
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-md flex items-start gap-2">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          <p>Status: LED is currently {ledStatus === "FLASHING" ? "running the flash pattern" : "turned off"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FlashController;