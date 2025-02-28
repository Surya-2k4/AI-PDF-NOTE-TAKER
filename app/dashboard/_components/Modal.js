import React from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@/components/ui/button';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const element = document.getElementById('notes-content');
    html2pdf().from(element).save('saved-notes.pdf');
  };

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative bg-white p-5 rounded-md shadow-lg w-3/4 h-3/4 overflow-auto">
            <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                    onClick={handleDownload}
                    className="text-gray-200 hover:text-gray-400 focus:outline-none">
                        Download
                </Button>
                <Button
                    onClick={onClose}
                    className="text-gray-200 hover:text-gray-400 focus:outline-none">
                        Close
                </Button>
            </div>
            <div id="notes-content">
                {children}
            </div>
        </div>
    </div>
);
}

export default Modal;