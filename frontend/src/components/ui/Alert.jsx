import React, { useState } from "react";
import { XCircle, CheckCircle, AlertTriangle } from "lucide-react";

const alertStyles = {
  success: "bg-green-500/10 border-green-500 text-green-300",
  error: "bg-red-500/10 border-red-500 text-red-300",
  warning: "bg-yellow-500/10 border-yellow-500 text-yellow-300",
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

export const Alert = ({ type = "success", message }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const Icon = icons[type];

  return (
    <div className={`flex items-center gap-3 p-4 border-l-4 rounded-lg ${alertStyles[type]}`}>
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-white transition">
        ✖
      </button>
    </div>
  );
};
