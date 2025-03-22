import { Link } from "react-router-dom"
import { Cpu, Lightbulb, ArrowRight } from "lucide-react"

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="space-y-8 w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/flash"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2332] to-[#111827] p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1d4ed8]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-[#1d4ed8]/20 flex items-center justify-center mb-4">
                <Lightbulb className="w-7 h-7 text-[#60a5fa]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">LED Control</h2>
              <p className="text-gray-400 mb-6">
                Control the flash pattern of your ESP32 LED with simple on/off commands
              </p>
              <div className="flex items-center text-[#60a5fa] font-medium">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link
            to="/arm"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2332] to-[#111827] p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1d4ed8]/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-[#1d4ed8]/20 flex items-center justify-center mb-4">
                <Cpu className="w-7 h-7 text-[#60a5fa]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Robotic Arm</h2>
              <p className="text-gray-400 mb-6">Precisely control your robotic arm with intuitive motor controls</p>
              <div className="flex items-center text-[#60a5fa] font-medium">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        <div className="p-6 rounded-xl bg-[#1a2332]/50">
          <h3 className="text-xl font-semibold text-white mb-3">System Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#111827]">
              <div className="text-sm text-gray-400 mb-1">Firebase</div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-white">Connected</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#111827]">
              <div className="text-sm text-gray-400 mb-1">ESP32</div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-white">Online</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#111827]">
              <div className="text-sm text-gray-400 mb-1">LED Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-white">Standby</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#111827]">
              <div className="text-sm text-gray-400 mb-1">Arm Status</div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-white">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

