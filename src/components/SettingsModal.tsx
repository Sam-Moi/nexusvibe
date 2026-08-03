import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { name?: string; email?: string };
  onLogout?: () => void;
}

export default function SettingsModal({ isOpen, onClose, user, onLogout }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');
  const [notifications, setNotifications] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row h-[480px]">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-950/60 p-4 border-r border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-pink-500 mb-6">Settings</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeTab === 'profile' ? 'bg-pink-600/20 text-pink-400 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeTab === 'notifications' ? 'bg-pink-600/20 text-pink-400 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeTab === 'account' ? 'bg-pink-600/20 text-pink-400 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Account & Security
              </button>
            </nav>
          </div>

          <button
            onClick={onClose}
            className="w-full text-center py-2 text-xs text-gray-400 hover:text-white border border-slate-800 rounded-lg"
          >
            Close Settings
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Profile Details</h3>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || 'User'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'user@example.com'}
                  className="w-full bg-slate-800/50 border border-slate-800 rounded-lg p-2.5 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Preferences</h3>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                <div>
                  <p className="text-sm font-medium text-white">Email Notifications</p>
                  <p className="text-xs text-gray-400">Receive updates about AI matches and messages</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-5 h-5 accent-pink-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Account Control</h3>
              <p className="text-xs text-gray-400">Manage your session or sign out of NexusVibe on this device.</p>
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 font-medium py-2.5 rounded-lg transition text-sm mt-4"
                >
                  Log Out
                </button>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 text-right">
            <button
              onClick={onClose}
              className="bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Save & Exit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}