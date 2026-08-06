import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, AlertCircle, Trash2, Plus, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { useAutosave } from '../../hooks/useAutosave';
import { registrationApi } from '../../api/registration';
import { FinalSubmissionTab } from './FinalSubmissionTab';
import { handleApiError } from '../../utils/apiErrorHandler';
import { Button } from '../ui/Button';
import { tracks } from '../../data/tracks';

const schema = z.object({
  paperCategory: z.string().optional(),
  researchDomain: z.string().optional(),
  presentationPreference: z.string().optional(),
  specialRequirements: z.string().optional(),
  additionalRemarks: z.string().optional(),
  title: z.string().max(120, 'Title cannot exceed 120 characters').optional(),
  abstract: z.string().optional(), // Word count handled dynamically in UI
  keywords: z.array(z.string()).max(7, 'Maximum 7 keywords allowed').optional(),
  conferenceTrack: z.string().optional(),
  language: z.enum(['English', '']).optional()
});

export const RegistrationForm = ({ team, registration, isLeader, isLocked, activeReview, onVersionUpdate, onLiveUpdate }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [keywordInput, setKeywordInput] = useState('');

  const { register, watch, reset, getValues, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      paperCategory: registration?.paperCategory || '',
      researchDomain: registration?.researchDomain || '',
      presentationPreference: registration?.presentationPreference || '',
      specialRequirements: registration?.specialRequirements || '',
      additionalRemarks: registration?.additionalRemarks || '',
      title: registration?.title || '',
      abstract: registration?.abstract || '',
      keywords: registration?.keywords || [],
      conferenceTrack: registration?.conferenceTrack || '',
      language: registration?.language || 'English'
    }
  });

  const { isSaving, lastSaved, triggerSave } = useAutosave(async (payload) => {
    const res = await registrationApi.saveDetails(payload);
    onVersionUpdate(res.data.version);
  }, 2000);

  useEffect(() => {
    const subscription = watch((value, { type }) => {
      onLiveUpdate && onLiveUpdate({ ...registration, ...value });
      if (isLeader && !isLocked && type === 'change') {
        triggerSave(getValues());
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isLeader, isLocked, triggerSave, getValues, onLiveUpdate, registration]);

  const handleManualSave = async (e) => {
    e.preventDefault();
    if (!isLeader || isLocked) return;
    try {
      const payload = getValues();
      triggerSave(payload);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!keywordInput.trim()) return;
      const current = getValues('keywords') || [];
      if (current.length >= 7) return;
      
      setValue('keywords', [...current, keywordInput.trim()], { shouldValidate: true, shouldDirty: true });
      triggerSave(getValues());
      setKeywordInput('');
    }
  };

  const removeKeyword = (idx) => {
    const current = getValues('keywords') || [];
    current.splice(idx, 1);
    setValue('keywords', [...current], { shouldValidate: true, shouldDirty: true });
    triggerSave(getValues());
  };

  const titleVal = watch('title') || '';
  const abstractVal = watch('abstract') || '';
  const abstractWordCount = abstractVal.trim() ? abstractVal.trim().split(/\s+/).length : 0;
  const keywordsArr = watch('keywords') || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          {team?.status === 'Needs Correction' && activeReview?.correctionItems && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl">
              <div className="flex items-center gap-2 text-yellow-800 font-bold mb-2">
                <AlertTriangle size={20} />
                <h3>Corrections Required</h3>
              </div>
              <ul className="space-y-2 mt-3">
                {activeReview.correctionItems.map((item, idx) => (
                  <li key={idx} className="bg-white/50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-900">
                    <span className="font-bold text-yellow-800 uppercase tracking-wider text-xs block mb-1">{item.category}</span>
                    {item.comment}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-yellow-700 mt-3 font-medium">Please fix these issues and click 'Resubmit' on Step 4.</p>
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLeader ? 'Changes are automatically saved as a draft.' : 'You have read-only access.'}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          {isSaving ? (
            <span className="text-sm font-medium text-amber-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="text-sm text-gray-500">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      </div>



      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveStep(1)} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeStep === 1 ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
          1. General Info
        </button>
        <button onClick={() => setActiveStep(2)} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeStep === 2 ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
          2. Paper Metadata
        </button>
        <button onClick={() => setActiveStep(3)} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeStep === 3 ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
          3. Authors
        </button>
        <button onClick={() => setActiveStep(4)} className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeStep === 4 ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
          4. Submit
        </button>
      </div>

      <form className="p-6">
        <fieldset disabled={!isLeader || isLocked}>
          
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">General Requirements</h3>
              
              {!isLeader ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Your Team Leader is managing the General Requirements.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paper Category</label>
                    <select {...register('paperCategory')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-gray-100">
                      <option value="">Select Category</option>
                      <option value="Research Paper">Research Paper</option>
                      <option value="Review Paper">Review Paper</option>
                      <option value="Case Study">Case Study</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Presentation Preference</label>
                    <select {...register('presentationPreference')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-75 disabled:bg-gray-100">
                      <option value="">Select Preference</option>
                      <option value="Oral">Oral Presentation</option>
                      <option value="Poster">Poster Presentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements (Optional)</label>
                    <input type="text" {...register('specialRequirements')} placeholder="Accessibility needs?" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:bg-gray-100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Remarks</label>
                    <textarea {...register('additionalRemarks')} rows="2" placeholder="Notes for committee" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:bg-gray-100"></textarea>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Paper Details</h3>
              
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Paper Title</label>
                  <span className={`text-xs font-medium ${titleVal.length > 120 ? 'text-red-500' : 'text-gray-500'}`}>
                    {titleVal.length} / 120 Characters
                  </span>
                </div>
                <input type="text" {...register('title')} placeholder="Enter the exact title of your paper" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conference Track</label>
                  <select {...register('conferenceTrack')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:bg-gray-100">
                    <option value="">Select a Track</option>
                    {tracks.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select {...register('language')} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 disabled:opacity-75 disabled:bg-gray-100">
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Abstract</label>
                  <span className={`text-xs font-medium ${abstractWordCount > 300 ? 'text-red-500' : 'text-gray-500'}`}>
                    {abstractWordCount} / 300 Words
                  </span>
                </div>
                <textarea 
                  {...register('abstract')} 
                  rows="6" 
                  placeholder="Paste your abstract here..." 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Keywords (Max 7)</label>
                  <span className="text-xs text-gray-500">{keywordsArr.length} / 7</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="text" 
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword(e)}
                    disabled={!isLeader || isLocked || keywordsArr.length >= 7}
                    placeholder="Type keyword & press Enter" 
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20" 
                  />
                  <Button type="button" onClick={handleAddKeyword} disabled={!isLeader || isLocked || keywordsArr.length >= 7}>Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywordsArr.map((kw, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary font-medium text-sm rounded-full">
                      {kw}
                      {isLeader && !isLocked && (
                        <button type="button" onClick={() => removeKeyword(i)} className="text-primary hover:text-red-500"><X size={14} /></button>
                      )}
                    </span>
                  ))}
                  {keywordsArr.length === 0 && <span className="text-sm text-gray-400 italic">No keywords added.</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Author Sequencing</h3>
              <p className="text-sm text-gray-500 mb-6">Authors are automatically pulled from your active team roster. The Team Leader is the designated Corresponding Author by default.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Leader Card */}
                <div className="bg-white border border-primary/30 shadow-sm rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">CORRESPONDING AUTHOR</div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {team.leader?.fullName ? team.leader.fullName.charAt(0).toUpperCase() : 'L'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{team.leader?.fullName} <span className="text-xs font-normal text-gray-500 ml-1">(Leader)</span></h4>
                      <p className="text-sm text-gray-500">{team.leader?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{team.leader?.institute}</p>
                    </div>
                  </div>
                </div>

                {/* Members Cards */}
                {team.members?.filter(m => m.user?._id !== team.leader?._id && m.user !== team.leader?._id).map((member, idx) => (
                  <div key={member._id || idx} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl">
                        {member.user?.fullName ? member.user.fullName.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{member.user?.fullName} <span className="text-xs font-normal text-gray-500 ml-1">(Member)</span></h4>
                        <p className="text-sm text-gray-500">{member.user?.email}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {team.teamType === 'Solo' && (
                  <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-4 flex items-center justify-center text-gray-400 text-sm italic">
                    Solo Participation (No Co-Authors)
                  </div>
                )}
              </div>
            </div>
          )}

        </fieldset>

          {/* Step 4: Final Submit */}
          {activeStep === 4 && (
            <FinalSubmissionTab 
              team={team} 
              registration={registration} 
              isLeader={isLeader} 
              isLocked={isLocked} 
            />
          )}

          {/* Form Actions */}
          {isLeader && !isLocked && (
            <div className="flex justify-between pt-6 border-t border-gray-100 mt-8">
               <div>
                  {activeStep > 1 && <Button type="button" variant="outline" onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>}
               </div>
               <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleManualSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Force Save'}
                  </Button>
                  {activeStep < 4 && <Button type="button" onClick={() => setActiveStep(prev => prev + 1)}>Next</Button>}
               </div>
            </div>
          )}
      </form>
    </div>
  );
};
