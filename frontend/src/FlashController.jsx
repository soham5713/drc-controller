import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PowerIcon, LightbulbIcon, AlertCircleIcon, ActivityIcon } from "lucide-react";

function FlashController() {
  const [ledStatus, setLedStatus] = useState("OFF");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState("checking");
  const [deviceStatus, setDeviceStatus] = useState("unknown");

  // Get API URL from environment variable or use fallback
  const API_URL = process.env.REACT_APP_API_URL || "https://drc-controller.onrender.com/api";

  // Check server health and device status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check server health
        const healthResponse = await fetch(`${API_URL}/health`);
        if (healthResponse.ok) {
          setServerStatus("connected");
          
          // If server is up, check device status
          try {
            const statusResponse = await fetch(`${API_URL}/status`);
            if (statusResponse.ok) {
              const data = await statusResponse.json();
              setLedStatus(data.status);
              setDeviceStatus("connected");
            } else {
              setDeviceStatus("disconnected");
            }
          } catch (err) {
            setDeviceStatus("disconnected");
            console.error("Error fetching device status:", err);
          }
        } else {
          setServerStatus("disconnected");
          setDeviceStatus("unknown");
        }
      } catch (error) {
        setServerStatus("disconnected");
        setDeviceStatus("unknown");
        console.error("Error checking server health:", error);
      }
    };

    checkStatus();
    
    // Set up polling for status updates every 30 seconds
    const statusInterval = setInterval(checkStatus, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(statusInterval);
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
      console.log(`Sent: ${state}, Response: ${responseText}`);

      // Update LED status based on the state sent
      setLedStatus(state === "1" ? "FLASHING" : "OFF");
    } catch (error) {
      console.error("Error sending request:", error);
      setError(error.message);
      
      // Check if the error is related to the device being unreachable
      if (error.message.includes("ESP32 device is not reachable")) {
        setDeviceStatus("disconnected");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine if controls should be disabled
  const isControlDisabled = (action) => {
    if (isLoading || serverStatus !== "connected" || deviceStatus !== "connected") {
      return true;
    }
    
    // Disable the appropriate button based on current state
    if (action === "start" && ledStatus === "FLASHING") return true;
    if (action === "stop" && ledStatus === "OFF") return true;
    
    return false;
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
              variant={deviceStatus === "connected" ? "outline" : "secondary"}
              className={`${deviceStatus === "connected" ? "border-blue-500 text-blue-500" : "bg-gray-700"} px-3`}
            >
              {deviceStatus === "connected" ? "ESP32 Connected" : "ESP32 Disconnected"}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Control the flash pattern of your ESP32 LED
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center my-4">
          <Badge 
            variant={ledStatus === "FLASHING" ? "default" : "secondary"}
            className={`${ledStatus === "FLASHING" ? "bg-green-600 hover:bg-green-700" : "bg-gray-700"} px-4 py-2 text-lg`}
          >
            {isLoading ? (
              <ActivityIcon className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <LightbulbIcon className={`h-5 w-5 mr-2 ${ledStatus === "FLASHING" ? "animate-pulse" : ""}`} />
            )}
            {ledStatus}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6"
            onClick={() => sendSignal("1")}
            disabled={isControlDisabled("start")}
          >
            <LightbulbIcon className="mr-2 h-5 w-5" />
            Start Flashing
          </Button>
          <Button 
            variant="destructive" 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-6"
            onClick={() => sendSignal("0")}
            disabled={isControlDisabled("stop")}
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
          {deviceStatus !== "connected" && (
            <p className="mt-2 text-yellow-400">
              {deviceStatus === "unknown" 
                ? "Unable to determine ESP32 status" 
                : "ESP32 is not reachable. Check if it's powered on and connected to WiFi."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FlashController;