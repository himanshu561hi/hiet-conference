import React from 'react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6 text-gray-600">
          {children}
        </div>
        {footer && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) => (
  <Modal 
    isOpen={isOpen} 
    onClose={onClose} 
    title={title}
    footer={
      <>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </>
    }
  >
    <p>{message}</p>
  </Modal>
);

export const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal 
    isOpen={isOpen} 
    onClose={onClose} 
    title={title}
    footer={
      <>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
      </>
    }
  >
    <div className="flex items-start gap-4">
      <div className="p-2 bg-red-100 text-red-600 rounded-full">⚠️</div>
      <p className="text-red-900 font-medium">{message}</p>
    </div>
  </Modal>
);
