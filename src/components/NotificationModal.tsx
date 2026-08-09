import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Sparkles } from 'lucide-react';
import { NotificationItem, CollegeSettings } from '../types';

interface NotificationModalProps {
  notifications: NotificationItem[];
  settings: CollegeSettings | null;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ notifications, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check local storage preference
    const pref = localStorage.getItem('jcs_notification_pref');
    if (pref === 'subscribed' || pref === 'dismissed_perm') {
      return;
    }

    const popupNotif = notifications.find(n => n.showAsPopup && n.status === 'active');
    const enabled = settings?.popupEnabled ?? true;
    const delay = settings?.popupDelay ?? 3000;

    if (enabled) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [notifications, settings]);

  const handleSubscribe = () => {
    localStorage.setItem('jcs_notification_pref', 'subscribed');
    setSubscribed(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleLater = () => {
    localStorage.setItem('jcs_notification_pref', 'later');
    setIsOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem('jcs_notification_pref', 'dismissed_perm');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const activePopupNotif = notifications.find(n => n.showAsPopup && n.status === 'active');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-400 max-w-md w-full overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-xl text-slate-950 shadow-md">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-300">Important Academic Notice</h3>
              <p className="text-xs text-slate-300">Jamal College of Sciences, Mayar</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-left">
          {subscribed ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-pulse" />
              <h4 className="text-xl font-bold text-slate-800">Thank You!</h4>
              <p className="text-sm text-slate-600">
                You have successfully subscribed to Jamal College notifications.
              </p>
            </div>
          ) : (
            <>
              {activePopupNotif ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{activePopupNotif.title}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activePopupNotif.message}
                  </p>
                </div>
              ) : (
                <p className="text-base text-slate-800 font-medium leading-relaxed">
                  {settings?.popupMessage || "Subscribe to receive key educational, admission, and merit list announcements."}
                </p>
              )}

              <p className="text-xs text-slate-500">
                Get timely updates regarding admission deadlines, entrance tests, and academic announcements.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={handleSubscribe}
                  className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Subscribe Now
                </button>
                <button
                  onClick={handleLater}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm"
                >
                  Maybe Later
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
