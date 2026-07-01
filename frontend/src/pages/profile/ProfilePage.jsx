import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import useAuth from "../../hooks/useAuth.jsx";
import userService from "../../services/userService";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load user data
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await userService.updateProfile(form);
      updateUser(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const roleLabels = {
    passenger: "Passenger",
    driver: "Driver",
    admin: "Administrator",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl space-y-6"
    >
      <h1 className="text-2xl font-display font-bold text-text">Profile</h1>

      {/* Avatar Section */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-hover flex items-center justify-center text-2xl font-bold text-white">
              {user?.firstName?.[0] || "R"}
              {user?.lastName?.[0] || ""}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-muted">{user?.email}</p>
            <Badge variant="primary" className="mt-2">
              {roleLabels[user?.role] || "User"}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Personal Details */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">
          Personal Details
        </h3>

        {/* Success/Error messages */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-sm text-success mb-4"
          >
            <CheckCircle className="w-4 h-4" />
            Profile updated successfully
          </motion.div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            icon={User}
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            icon={Mail}
            value={form.email}
            disabled
            helperText="Email cannot be changed"
          />
          <Input
            label="Phone"
            type="tel"
            icon={Phone}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="mt-5">
          <Button onClick={handleSave} loading={saving} icon={Save}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">
          Emergency Contact
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Contact Name" icon={User} placeholder="Full name" />
          <Input
            label="Contact Phone"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="mt-4">
          <Button variant="secondary" size="sm" icon={Plus}>
            Add Contact
          </Button>
        </div>
      </Card>

      {/* Saved Locations */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">
          Saved Locations
        </h3>
        <div className="space-y-3">
          {(user?.savedLocations?.length > 0
            ? user.savedLocations
            : [
                {
                  name: "Home",
                  address: "123 Main Street, Apt 4B, New York, NY",
                },
                {
                  name: "Work",
                  address: "456 Business Ave, Suite 200, New York, NY",
                },
              ]
          ).map((loc) => (
            <div
              key={loc.name}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{loc.name}</p>
                  <p className="text-xs text-muted">{loc.address}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-danger/10 text-muted hover:text-danger transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="secondary" size="sm" icon={Plus}>
            Add Location
          </Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-text mb-4">Preferences</h3>
        <div className="space-y-4">
          {[
            {
              key: "notifications",
              label: "Push Notifications",
              desc: "Receive ride updates and promotions",
            },
            {
              key: "emailUpdates",
              label: "Email Updates",
              desc: "Get weekly summaries and offers",
            },
            {
              key: "darkMode",
              label: "Dark Mode",
              desc: "Use dark theme (always on)",
            },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium text-text">{pref.label}</p>
                <p className="text-xs text-muted">{pref.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={user?.preferences?.[pref.key] ?? true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
