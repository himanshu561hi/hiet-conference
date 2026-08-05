import React, { useState } from 'react';
import { adminApi } from '../../api/admin';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { handleApiError } from '../../utils/apiErrorHandler';
import toast from 'react-hot-toast';
import { Check, X, AlertTriangle, Plus, Trash2 } from 'lucide-react';

const CORRECTION_CATEGORIES = ['Paper Title', 'Abstract', 'Keywords', 'PDF', 'Author Details', 'Registration Information', 'Other'];

export const AdminReviewActions = ({ registrationId, currentStatus, onActionComplete }) => {
  const [activeModal, setActiveModal] = useState(null); // 'approve', 'reject', 'correction'
  const [loading, setLoading] = useState(false);
  
  // State for Reject
  const [rejectReason, setRejectReason] = useState('');
  
  // State for Correction
  const [internalNotes, setInternalNotes] = useState('');
  const [correctionItems, setCorrectionItems] = useState([{ category: 'PDF', comment: '' }]);

  const closeModals = () => {
    setActiveModal(null);
    setRejectReason('');
    setInternalNotes('');
    setCorrectionItems([{ category: 'PDF', comment: '' }]);
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await adminApi.approveRegistration(registrationId);
      toast.success('Registration Approved!');
      closeModals();
      onActionComplete();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (rejectReason.trim().length < 20) {
      return toast.error('Reason must be at least 20 characters.');
    }
    try {
      setLoading(true);
      await adminApi.rejectRegistration(registrationId, rejectReason);
      toast.success('Registration Rejected!');
      closeModals();
      onActionComplete();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCorrection = async () => {
    const invalidItems = correctionItems.filter(i => !i.comment.trim());
    if (invalidItems.length > 0) return toast.error('All correction items must have a comment.');
    
    try {
      setLoading(true);
      await adminApi.requestCorrection(registrationId, correctionItems, internalNotes);
      toast.success('Corrections requested!');
      closeModals();
      onActionComplete();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const addCorrectionItem = () => setCorrectionItems([...correctionItems, { category: 'Other', comment: '' }]);
  const removeCorrectionItem = (idx) => setCorrectionItems(correctionItems.filter((_, i) => i !== idx));

  // If already locked/decided, don't show action buttons
  if (currentStatus === 'Approved' || currentStatus === 'Rejected') {
    return (
      <div className="text-center mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500 font-medium">This registration has been {currentStatus.toLowerCase()} and is now locked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {currentStatus !== 'Needs Correction' && (
        <Button variant="primary" className="w-full justify-center bg-green-600 hover:bg-green-700" onClick={() => setActiveModal('approve')}>
          <Check size={16} className="mr-2" /> Approve Registration
        </Button>
      )}
      
      <Button variant="outline" className="w-full justify-center text-yellow-600 border-yellow-200 hover:bg-yellow-50" onClick={() => setActiveModal('correction')}>
        <AlertTriangle size={16} className="mr-2" /> Request Correction
      </Button>
      
      {currentStatus !== 'Needs Correction' && (
        <Button variant="outline" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50" onClick={() => setActiveModal('reject')}>
          <X size={16} className="mr-2" /> Reject Registration
        </Button>
      )}

      {/* APPROVE MODAL */}
      <Modal isOpen={activeModal === 'approve'} onClose={closeModals} title="Confirm Approval">
        <p className="text-gray-600 mb-6">Are you sure you want to approve this registration? After approval, it will become permanently read-only for the participant.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeModals} disabled={loading}>Cancel</Button>
          <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={handleApprove} isLoading={loading}>Yes, Approve</Button>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal isOpen={activeModal === 'reject'} onClose={closeModals} title="Reject Registration">
        <p className="text-gray-600 mb-4 text-sm">Please provide a mandatory reason for rejection. This will be sent to the team leader.</p>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-2"
          rows={4}
          placeholder="Reason for rejection (min 20 chars)..."
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
        />
        <p className="text-xs text-gray-500 mb-6 text-right">{rejectReason.length} chars</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeModals} disabled={loading}>Cancel</Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={handleReject} isLoading={loading}>Reject Permanently</Button>
        </div>
      </Modal>

      {/* CORRECTION MODAL */}
      <Modal isOpen={activeModal === 'correction'} onClose={closeModals} title="Request Corrections">
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
          <p className="text-gray-600 text-sm">Specify the exact items that need correction. The team will be unlocked and notified.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900">Correction Items</h4>
              <Button type="button" variant="outline" size="sm" onClick={addCorrectionItem} className="text-xs py-1 h-auto">
                <Plus size={14} className="mr-1" /> Add Item
              </Button>
            </div>
            
            {correctionItems.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 relative">
                {correctionItems.length > 1 && (
                  <button onClick={() => removeCorrectionItem(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary"
                    value={item.category}
                    onChange={(e) => {
                      const newItems = [...correctionItems];
                      newItems[idx].category = e.target.value;
                      setCorrectionItems(newItems);
                    }}
                  >
                    {CORRECTION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Specific Comment</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`What needs fixing in ${item.category}?`}
                    value={item.comment}
                    onChange={(e) => {
                      const newItems = [...correctionItems];
                      newItems[idx].comment = e.target.value;
                      setCorrectionItems(newItems);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Internal Notes (Admin Only - Optional)</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              rows={2}
              placeholder="Notes for other admins..."
              value={internalNotes}
              onChange={e => setInternalNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={closeModals} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleCorrection} isLoading={loading}>Send Request</Button>
        </div>
      </Modal>
    </div>
  );
};
