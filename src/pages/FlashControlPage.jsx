"use client"

import { useState, useEffect } from "react"
import { db, doc, updateDoc, getDoc } from "../firebaseConfig"
import { Lightbulb, Loader2 } from "lucide-react"

export function FlashControlPage() {
  const [flash, setFlash] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState({
    server: false,
    esp32: false,
  })
  const flashDocRef = doc(db, "ESP32-CAM", "FlashControl")

  // Fetch the current flash state from Firestore
  useEffect(() => {
    const fetchFlashState = async () => {
      try {
        setIsLoading(true)
        const docSnap = await getDoc(flashDocRef)
        if (docSnap.exists()) {
          setFlash(Number.parseInt(docSnap.data().flash))
          setConnectionStatus({
            server: true,
            esp32: true,
          })
        }
      } catch (error) {
        console.error("Error fetching flash state:", error)
        setConnectionStatus({
          server: false,
          esp32: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashState()
  }, [])

  // Toggle Flash State
  const toggleFlash = async (newValue) => {
    try {
      setIsLoading(true)
      setFlash(newValue)
      await updateDoc(flashDocRef, { flash: newValue })
      console.log("Flash state updated:", newValue)
    } catch (error) {
      console.error("Error updating Firestore:", error)
      // Revert state if update fails
      setFlash(flash)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-[#141c2b] rounded-lg">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">LED Control</h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-400">Control ESP32 LED</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus.server ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-xs text-gray-400">Server</span>
              <div
                className={`w-2 h-2 rounded-full ${connectionStatus.esp32 ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
              <span className="text-xs text-gray-400">ESP32</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              flash === 1 ? "bg-[#1d4ed8] text-white" : "bg-[#1a2332] text-gray-400"
            }`}
          >
            <Lightbulb className="w-12 h-12" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
              flash === 1 ? "bg-[#1d4ed8] text-white" : "bg-[#1a2332] text-gray-300 hover:bg-[#1e293b]"
            }`}
            onClick={() => toggleFlash(1)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Turn On"}
          </button>
          <button
            className={`py-3 px-4 rounded-lg flex items-center justify-center transition-all ${
              flash === 0 ? "bg-[#b91c1c] text-white" : "bg-[#1a2332] text-gray-300 hover:bg-[#1e293b]"
            }`}
            onClick={() => toggleFlash(0)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Turn Off"}
          </button>
        </div>
      </div>
    </div>
  )
}

