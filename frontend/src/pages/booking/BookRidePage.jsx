import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  Car,
  CarFront,
  Sparkles,
  Truck,
  ChevronRight,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { VEHICLE_TYPES } from "../../utils/constants";

export default function BookRidePage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("economy");
  const [step, setStep] = useState(1); // 1: locations, 2: vehicle, 3: confirm

  const vehicleIcons = { Car, CarFront, Sparkles, Truck };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">Book a Ride</h1>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Booking Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-text mb-4">Route</h3>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                <input
                  type="text"
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm text-text placeholder:text-muted/50 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-success rounded-full" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm text-text placeholder:text-muted/50 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </Card>

          {/* Vehicle Selection */}
          <Card>
            <h3 className="text-sm font-semibold text-text mb-4">
              Choose Vehicle
            </h3>
            <div className="space-y-2">
              {VEHICLE_TYPES.map((v) => {
                const IconComp = vehicleIcons[v.icon] || Car;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                      selectedVehicle === v.id
                        ? "border-primary/50 bg-primary/5 shadow-glow"
                        : "border-border hover:border-border/80 hover:bg-secondary/20"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedVehicle === v.id
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/50 text-muted"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text">{v.name}</p>
                      <p className="text-xs text-muted">
                        {v.eta} · {v.seats} seats
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-text">
                      ${(12.5 * v.multiplier).toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Confirm */}
          <Button fullWidth size="lg" iconRight={ChevronRight}>
            Confirm Booking
          </Button>
        </div>

        {/* Right: Map Placeholder */}
        <div className="lg:col-span-3">
          <Card className="h-full min-h-[500px] flex flex-col">
            <div className="flex-1 rounded-xl bg-secondary/30 flex items-center justify-center relative overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-5">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full h-px bg-muted"
                    style={{ top: `${(i + 1) * 8.33}%` }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full w-px bg-muted"
                    style={{ left: `${(i + 1) * 12.5}%` }}
                  />
                ))}
              </div>
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-muted/30 mx-auto mb-3" />
                <p className="text-sm text-muted">Map will render here</p>
                <p className="text-xs text-muted/60 mt-1">
                  Google Maps integration
                </p>
              </div>
            </div>

            {/* Ride Summary */}
            <div className="mt-4 p-4 rounded-xl bg-secondary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Estimated Distance</span>
                <span className="text-sm font-medium text-text">8.5 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Estimated Time</span>
                <span className="text-sm font-medium text-text">21 min</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium text-text">
                  Estimated Fare
                </span>
                <span className="text-lg font-display font-bold text-text">
                  $12.50
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
