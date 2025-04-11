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
      <div className="bg-white rounded-lg p-6 w-5/6 max-w-md shadow-xl">
        <div className="text-center mb-5">
          {icon || (
            <span className="material-icons text-5xl text-[#4CAF50] bg-green-50 p-3 rounded-full inline-block">check_circle</span>
          )}
          <h3 className="text-xl font-bold mt-3 text-gray-800">{title}</h3>
          {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-100">
          {content}
        </div>

        <div className="flex justify-between gap-4">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-3 border border-gray-200 rounded-lg text-gray-700 flex items-center justify-center flex-1 hover:bg-gray-50"
            >
              {secondaryAction.label}
            </button>
          )}

          <button
            onClick={primaryAction.onClick}
            className={`px-4 py-3 bg-primary text-white rounded-lg hover:bg-green-700 flex items-center justify-center ${!secondaryAction ? 'w-full' : 'flex-1'}`}
          >
            {primaryAction.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
