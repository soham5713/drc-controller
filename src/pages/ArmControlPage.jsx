"use client"

import { useState, useEffect } from "react"
import { db, doc, updateDoc, getDoc } from "../firebaseConfig"
import { RotateCcw, RotateCw, ArrowUp, ArrowDown, Grip, Hand, Loader2 } from "lucide-react"

export function ArmControlPage() {
  const [armState, setArmState] = useState({
    baseMotor: 0, // 0: stopped, 1: clockwise, -1: anticlockwise
    elbowMotor: 0, // 0: stopped, 1: up, -1: down
    wristMotor: 0, // 0: stopped, 1: grab, -1: ease
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeMotor, setActiveMotor] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState({
    server: false,
    esp32: false,
  })
  const armDocRef = doc(db, "ESP32-CAM", "ArmControl")

  // Fetch the current arm state from Firestore
  useEffect(() => {
    const fetchArmState = async () => {
      try {
        setIsLoading(true)
        const docSnap = await getDoc(armDocRef)
        if (docSnap.exists()) {
          setArmState(docSnap.data())
          setConnectionStatus({
            server: true,
            esp32: true,
          })
        } else {
          // Initialize document if it doesn't exist
          await updateDoc(armDocRef, armState)
          setConnectionStatus({
            server: true,
            esp32: false,
          })
        }
      } catch (error) {
        console.error("Error fetching arm state:", error)
        setConnectionStatus({
          server: false,
          esp32: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchArmState()
  }, [])

  // Update motor state
  const updateMotor = async (motor, value) => {
    try {
      setIsLoading(true)
      setActiveMotor(motor)
      const newArmState = { ...armState, [motor]: value }
      setArmState(newArmState)
      await updateDoc(armDocRef, { [motor]: value })
      console.log(`${motor} updated:`, value)

      // Auto-reset to stopped state after 1 second
      if (value !== 0) {
        setTimeout(async () => {
          setArmState((prev) => ({ ...prev, [motor]: 0 }))
          await updateDoc(armDocRef, { [motor]: 0 })
          setActiveMotor(null)
          console.log(`${motor} auto-stopped`)
        }, 1000)
      }
    } catch (error) {
      console.error("Error updating Firestore:", error)
      // Revert state if update fails
      setArmState(armState)
      setActiveMotor(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-[#141c2b] rounded-lg">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Robotic Arm Control</h2>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-400">Control arm motors</p>
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

        <div className="space-y-4 mb-4">
          <div className="p-4 bg-[#1a2332] rounded-lg">
            <h3 className="text-white font-medium mb-3">Base Motor</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  armState.baseMotor === 1 ? "bg-[#1d4ed8] text-white" : "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                }`}
                onClick={() => updateMotor("baseMotor", 1)}
                disabled={isLoading}
              >
                {isLoading && activeMotor === "baseMotor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCw className="h-4 w-4" />
                )}
                Clockwise
              </button>
              <button
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  armState.baseMotor === -1
                    ? "bg-[#1d4ed8] text-white"
                    : "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                }`}
                onClick={() => updateMotor("baseMotor", -1)}
                disabled={isLoading}
              >
                {isLoading && activeMotor === "baseMotor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                Anticlockwise
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#1a2332] rounded-lg">
            <h3 className="text-white font-medium mb-3">Elbow Motor</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  armState.elbowMotor === 1
                    ? "bg-[#1d4ed8] text-white"
                    : "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                }`}
                onClick={() => updateMotor("elbowMotor", 1)}
                disabled={isLoading}
              >
                {isLoading && activeMotor === "elbowMotor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                Up
              </button>
              <button
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  armState.elbowMotor === -1
                    ? "bg-[#1d4ed8] text-white"
                    : "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                }`}
                onClick={() => updateMotor("elbowMotor", -1)}
                disabled={isLoading}
              >
                {isLoading && activeMotor === "elbowMotor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                Down
              </button>
            </div>
          </div>

          <div className="p-4 bg-[#1a2332] rounded-lg">
            <h3 className="text-white font-medium mb-3">Wrist Motor</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  armState.wristMotor === 1
                    ? "bg-[#1d4ed8] text-white"
                    : "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                }`}
                onClick={() => updateMotor("wristMotor", 1)}
                disabled={isLoading}
              >
                {isLoading && activeMotor === "wristMotor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Grip className="h-4 w-4" />
                )}
                Grab
              </button>
              <button
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  armState.wristMotor === -1
                    ? "bg-[#1d4ed8] text-white"
                    : "bg-[#111827] text-gray-300 hover:bg-[#1e293b]"
                }`}
                onClick={() => updateMotor("wristMotor", -1)}
                disabled={isLoading}
              >
                {isLoading && activeMotor === "wristMotor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Hand className="h-4 w-4" />
                )}
                Ease
              </button>
            </div>
          </div>
        </div>

        <button
          className="w-full py-2 px-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg"
          onClick={() => {
            updateMotor("baseMotor", 0)
            updateMotor("elbowMotor", 0)
            updateMotor("wristMotor", 0)
          }}
          disabled={isLoading}
        >
          Emergency Stop
        </button>
      </div>
    </div>
  )
}

