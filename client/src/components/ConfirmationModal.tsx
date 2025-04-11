import React, { ReactNode } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title: string;
  description?: string;
  content: ReactNode;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  content,
  primaryAction,
  secondaryAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg p-6 w-5/6 max-w-md">
        <div className="text-center mb-4">
          {icon || (
            <span className="material-icons text-5xl text-[#4CAF50]">check_circle</span>
          )}
          <h3 className="text-xl font-bold mt-2">{title}</h3>
          {description && <p className="text-[#9e9e9e] mt-1">{description}</p>}
        </div>

        <div className="border rounded-lg p-4 mb-4">
          {content}
        </div>

        <div className="flex justify-between">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 border border-[#e0e0e0] rounded-lg text-[#424242] flex items-center"
            >
              {secondaryAction.label}
            </button>
          )}

          <button
            onClick={primaryAction.onClick}
            className={`px-4 py-2 bg-primary text-white rounded-lg ${!secondaryAction ? 'w-full' : ''}`}
          >
            {primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
