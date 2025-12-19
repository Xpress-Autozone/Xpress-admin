import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";

const AlertModal = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50",
      button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      titleColor: "text-green-900",
    },
    error: {
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      titleColor: "text-red-900",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      titleColor: "text-yellow-900",
    },
    info: {
      icon: Info,
      color: "text-blue-500",
      bg: "bg-blue-50",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      titleColor: "text-blue-900",
    },
  };

  const style = config[type] || config.info;
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100 border border-gray-100 m-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${style.bg}`}>
              <Icon className={`w-6 h-6 ${style.color}`} />
            </div>
            <h3 className={`text-lg font-bold ${style.titleColor}`}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 pl-12">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 ${style.button}`}
          >
            Okay, got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
