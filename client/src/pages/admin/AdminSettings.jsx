import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/Loaders';
import { handleApiError } from '../../utils/apiErrorHandler';
import toast from 'react-hot-toast';
import { Settings, Save, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.fetchSettings();
      // Format date for datetime-local input
      const data = res.data.settings;
      if (data.submissionDeadline) {
        data.submissionDeadline = new Date(data.submissionDeadline).toISOString().slice(0, 16);
      }
      setSettings(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...settings,
        submissionDeadline: new Date(settings.submissionDeadline).toISOString()
      };
      await adminApi.updateSettings(payload);
      toast.success('System Settings updated successfully!');
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading || !settings) return <PageLoader text="Loading Settings..." />;

  const ToggleSwitch = ({ label, description, name, checked }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div>
        <h4 className="font-bold text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" name={name} checked={checked} onChange={handleChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gray-900 text-white rounded-xl">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">Manage global application configuration and limits.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Core Info */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Core Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Conference Name</label>
              <input type="text" name="conferenceName" value={settings.conferenceName || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Calendar size={16}/> Submission Deadline</label>
              <input type="datetime-local" name="submissionDeadline" value={settings.submissionDeadline || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary" required />
            </div>
          </div>
        </div>

        {/* Limits */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Platform Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max Team Size (incl. Leader)</label>
              <input type="number" name="maxTeamSize" min="1" max="10" value={settings.maxTeamSize || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max PDF Upload Size (MB)</label>
              <input type="number" name="maxUploadSizeMB" min="1" max="50" value={settings.maxUploadSizeMB || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary" required />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Feature Toggles</h3>
          <div className="space-y-4">
            <ToggleSwitch 
              label="Registration Open" 
              description="Allow new users to sign up and create teams." 
              name="registrationOpen" 
              checked={settings.registrationOpen} 
            />
            <ToggleSwitch 
              label="Enable Automated Emails" 
              description="Send email notifications via NotificationService." 
              name="emailEnabled" 
              checked={settings.emailEnabled} 
            />
            <ToggleSwitch 
              label="Maintenance Mode" 
              description="Lock down the entire platform for all non-admins." 
              name="maintenanceMode" 
              checked={settings.maintenanceMode} 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <Button type="submit" variant="primary" className="flex items-center gap-2" isLoading={saving}>
            <Save size={18} /> Save Settings
          </Button>
        </div>

      </form>
    </div>
  );
};
