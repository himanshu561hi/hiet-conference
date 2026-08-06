import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, User, FileText, CheckCircle2, ChevronRight,
  ChevronLeft, Plus, Trash2, UploadCloud, Loader2,
  Check, X, ShieldCheck, Mail, AlertCircle, Sparkles, Building2, MapPin
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ── Static Data Options ───────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Leader & Team', icon: Users },
  { id: 2, label: 'Academic / Org', icon: Building2 },
  { id: 3, label: 'Participation & Members', icon: User },
  { id: 4, label: 'Paper & File Upload', icon: FileText },
];

const COLLEGES_GZB = [
  'Hi-Tech Institute of Engineering & Technology (HIET), Ghaziabad',
  'Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad',
  'KIET Group of Institutions, Ghaziabad',
  'ABES Engineering College, Ghaziabad',
  'IMS Engineering College, Ghaziabad',
  'Raj Kumar Goel Institute of Technology (RKGIT), Ghaziabad',
  'JSS Academy of Technical Education, Noida',
  'Galgotias College of Engineering & Technology, Greater Noida',
  'SRM Institute of Science & Technology, NCR Campus',
  'Other'
];

const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Computer Science & AI / ML',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Jammu & Kashmir', 'Other State'
];

const DISTRICTS_MAP = {
  'Andhra Pradesh': [
    'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa',
    'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam',
    'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'Other'
  ],

  'Arunachal Pradesh': [
    'Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Lower Subansiri',
    'Upper Subansiri', 'West Siang', 'East Siang', 'Lower Dibang Valley',
    'Changlang', 'Tirap', 'Other'
  ],

  'Assam': [
    'Baksa', 'Barpeta', 'Bongaigaon', 'Cachar', 'Darrang',
    'Dhemaji', 'Dhubri', 'Dibrugarh', 'Goalpara', 'Golaghat',
    'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karimganj',
    'Lakhimpur', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
    'Sonitpur', 'Tinsukia', 'Other'
  ],

  'Bihar': [
    'Araria', 'Aurangabad', 'Begusarai', 'Bhagalpur', 'Bhojpur',
    'Darbhanga', 'Gaya', 'Katihar', 'Muzaffarpur', 'Nalanda',
    'Patna', 'Purnia', 'Rohtas', 'Samastipur', 'Saran',
    'Siwan', 'Vaishali', 'Other'
  ],

  'Chhattisgarh': [
    'Bilaspur', 'Durg', 'Janjgir-Champa', 'Korba', 'Raigarh',
    'Raipur', 'Rajnandgaon', 'Surguja', 'Other'
  ],

  'Goa': [
    'North Goa', 'South Goa', 'Other'
  ],

  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch',
    'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Junagadh', 'Kutch',
    'Mehsana', 'Rajkot', 'Surat', 'Vadodara', 'Other'
  ],

  'Haryana': [
    'Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurugram',
    'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal',
    'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal',
    'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat',
    'Yamunanagar', 'Other'
  ],

  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur',
    'Kullu', 'Mandi', 'Shimla', 'Sirmaur', 'Solan',
    'Una', 'Other'
  ],

  'Jharkhand': [
    'Bokaro', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
    'Giridih', 'Hazaribagh', 'Palamu', 'Ranchi',
    'West Singhbhum', 'Other'
  ],

  'Karnataka': [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural',
    'Bengaluru Urban', 'Bidar', 'Chikkaballapur', 'Chikkamagaluru',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Hassan',
    'Kalaburagi', 'Kodagu', 'Kolar', 'Mandya', 'Mysuru',
    'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada',
    'Vijayapura', 'Other'
  ],

  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
    'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram',
    'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram',
    'Thrissur', 'Wayanad', 'Other'
  ],

  'Madhya Pradesh': [
    'Bhopal', 'Gwalior', 'Indore', 'Jabalpur', 'Khandwa',
    'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Ujjain',
    'Other'
  ],

  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed',
    'Chandrapur', 'Dhule', 'Jalgaon', 'Kolhapur', 'Latur',
    'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
    'Nashik', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli',
    'Satara', 'Solapur', 'Thane', 'Wardha', 'Other'
  ],

  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East',
    'Imphal West', 'Senapati', 'Tamenglong', 'Thoubal',
    'Ukhrul', 'Other'
  ],

  'Meghalaya': [
    'East Khasi Hills', 'West Khasi Hills', 'Ri Bhoi',
    'West Garo Hills', 'South Garo Hills', 'Other'
  ],

  'Mizoram': [
    'Aizawl', 'Champhai', 'Kolasib', 'Lunglei',
    'Mamit', 'Saiha', 'Serchhip', 'Other'
  ],

  'Nagaland': [
    'Dimapur', 'Kohima', 'Mokokchung', 'Mon',
    'Phek', 'Tuensang', 'Wokha', 'Zunheboto', 'Other'
  ],

  'Odisha': [
    'Balasore', 'Bhadrak', 'Cuttack', 'Ganjam',
    'Jharsuguda', 'Khordha', 'Koraput', 'Mayurbhanj',
    'Puri', 'Sambalpur', 'Sundargarh', 'Other'
  ],

  'Punjab': [
    'Amritsar', 'Bathinda', 'Faridkot', 'Firozpur',
    'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Ludhiana',
    'Mansa', 'Mohali', 'Pathankot', 'Patiala',
    'Sangrur', 'Other'
  ],

  'Rajasthan': [
    'Ajmer', 'Alwar', 'Barmer', 'Bharatpur', 'Bhilwara',
    'Bikaner', 'Chittorgarh', 'Jaipur', 'Jaisalmer',
    'Jodhpur', 'Kota', 'Pali', 'Sikar', 'Udaipur',
    'Other'
  ],

  'Sikkim': [
    'East Sikkim', 'North Sikkim', 'South Sikkim',
    'West Sikkim', 'Other'
  ],

  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Erode', 'Kanchipuram', 'Madurai', 'Namakkal',
    'Salem', 'Thanjavur', 'Tiruchirappalli', 'Tirunelveli',
    'Tiruppur', 'Vellore', 'Other'
  ],

  'Telangana': [
    'Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam',
    'Mahabubnagar', 'Medak', 'Nalgonda', 'Nizamabad',
    'Rangareddy', 'Warangal', 'Other'
  ],

  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura',
    'Sepahijala', 'South Tripura', 'Unakoti',
    'West Tripura', 'Other'
  ],

  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Allahabad (Prayagraj)', 'Bareilly',
    'Ghaziabad', 'Gautam Buddha Nagar (Noida)', 'Gorakhpur',
    'Jhansi', 'Kanpur Nagar', 'Lucknow', 'Mathura',
    'Meerut', 'Moradabad', 'Muzaffarnagar', 'Prayagraj',
    'Saharanpur', 'Varanasi', 'Other'
  ],

  'Uttarakhand': [
    'Almora', 'Chamoli', 'Dehradun', 'Haridwar',
    'Nainital', 'Pauri Garhwal', 'Pithoragarh',
    'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar',
    'Uttarkashi', 'Other'
  ],

  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Darjeeling',
    'Hooghly', 'Howrah', 'Jalpaiguri', 'Kolkata',
    'Malda', 'Murshidabad', 'Nadia',
    'North 24 Parganas', 'South 24 Parganas',
    'Purba Medinipur', 'Paschim Medinipur', 'Other'
  ],

  'Delhi NCR': [
    'Central Delhi', 'East Delhi', 'New Delhi',
    'North Delhi', 'North East Delhi', 'North West Delhi',
    'Shahdara', 'South Delhi', 'South East Delhi',
    'South West Delhi', 'West Delhi',
    'Gurugram', 'Faridabad', 'Noida', 'Greater Noida',
    'Ghaziabad', 'Other'
  ],

  'Chandigarh': [
    'Chandigarh', 'Other'
  ],

  'Jammu & Kashmir': [
    'Anantnag', 'Baramulla', 'Budgam', 'Doda',
    'Jammu', 'Kathua', 'Kupwara', 'Pulwama',
    'Rajouri', 'Srinagar', 'Udhampur', 'Other'
  ],

  'Other State': [
    'Other'
  ]
};

// ── Category & Sub-Category Hierarchy (T1 to T6) ─────────────────────────

const CATEGORY_DATA = {
  'T1 – Green Technology in Artificial Intelligence': [
    'AI for Climate Change Prediction',
    'Green AI and Energy-Efficient Algorithms',
    'Intelligent Environmental Monitoring',
    'Machine Learning in Renewable Energy Forecasting',
    'Smart Energy Management using AI',
    'AI in Waste Management Systems',
    'AI for Sustainable Agriculture',
    'AI-driven Smart Cities and Infrastructure'
  ],
  'T2 – Green Technology and Sustainability in Management': [
    'AI Integration with Green Supply Chain Management',
    'Circular Economy and Resource Management',
    'Carbon Footprint Reduction Techniques',
    'Sustainable Financial and Investment Practices',
    'AI for Sustainable Business Management',
    'ESG, Corporate Governance, & Sustainability Reporting',
    'Green Marketing and Consumer Behavior',
    'Eco-innovation and Entrepreneurship'
  ],
  'T3 – Green Technology in Computer Applications and IT': [
    'Green Computing Technologies',
    'IoT for Smart and Sustainable Environments',
    'Big Data Analytics for Sustainability',
    'Blockchain for Green and Sustainable Solutions',
    'Sustainable Software Engineering',
    'Cloud Computing Energy Optimization',
    'Cyber-Physical Systems for Smart Cities',
    'Smart Environmental Monitoring Applications'
  ],
  'T4 – Green Technology and Sustainability in Electrical / Electronics Engineering': [
    'Smart Grid Technologies',
    'Electric Vehicles and Charging Infrastructure',
    'Power Electronics for Renewable Energy',
    'Energy Optimization in Electrical Systems',
    'Energy-Efficient Electronic Devices',
    'Green Communication Systems',
    'Smart Sensors and Automation Systems',
    'Sustainable Embedded Systems Design'
  ],
  'T5 – Green Technology for Renewable and Sustainable Energy': [
    'Solar Energy Technologies',
    'Bioenergy and Biomass Utilization',
    'Hybrid Renewable Energy Systems',
    'Sustainable Power Generation Systems',
    'Wind Energy Conversion Systems',
    'Hydrogen and Fuel Cell Technologies',
    'Energy Storage and Battery Technologies',
    'Waste-to-Energy Technologies'
  ],
  'T6 – Green Technology in Mechanical Engineering': [
    'Sustainable Manufacturing Processes',
    'Thermal and Energy Systems Efficiency',
    'HVAC and Energy Conservation Systems',
    'Sustainable Product Design and Development',
    'Green Automotive Technologies',
    'Eco-friendly and Smart Materials',
    'Waste Heat Recovery Technologies',
    'Industrial Automation for Energy Efficiency'
  ]
};

// Helper Input Component
const InputField = ({ label, type = 'text', value, onChange, placeholder, required, disabled }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1">
      {label} {required && <span className="text-emerald-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
        disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200' : 'border-slate-300'
      }`}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, required, disabled }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1">
      {label} {required && <span className="text-emerald-600">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition ${
        disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200' : 'border-slate-300'
      }`}
    >
      <option value="">Select Option...</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // ── Step 1 State ────────────────────────────────────────────────────────
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderMobile, setLeaderMobile] = useState('');

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // ── Step 2 State (Academic / Org) ───────────────────────────────────────
  const [isStudent, setIsStudent] = useState(true);

  // Student details
  const [collegeSelect, setCollegeSelect] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [branchSelect, setBranchSelect] = useState('');
  const [customBranch, setCustomBranch] = useState('');
  const [yearSelect, setYearSelect] = useState('');
  const [customYear, setCustomYear] = useState('');

  // Non-Student details
  const [organizationName, setOrganizationName] = useState('');
  const [stateSelect, setStateSelect] = useState('Uttar Pradesh');
  const [districtSelect, setDistrictSelect] = useState('Ghaziabad');
  const [customDistrict, setCustomDistrict] = useState('');

  // ── Step 3 State (Participation & Members) ──────────────────────────────
  const [participationType, setParticipationType] = useState('Team'); // 'Individual' or 'Team'
  const [members, setMembers] = useState([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '', email: '', mobile: '', college: 'HIET Ghaziabad', year: '3rd Year', branch: 'CSE'
  });

  // ── Step 4 State (Paper Details & File Upload) ──────────────────────────
  const [paperTitle, setPaperTitle] = useState('');
  const [uniqueness, setUniqueness] = useState('');
  const [paperCategory, setPaperCategory] = useState('T1 – Green Technology in Artificial Intelligence');
  const [paperSubCategory, setPaperSubCategory] = useState('');
  const [paperFile, setPaperFile] = useState(null);

  // ── OTP Handlers ────────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (!leaderEmail || !/\S+@\S+\.\S+/.test(leaderEmail)) {
      toast.error('Please enter a valid email address first.');
      return;
    }
    try {
      setSendingOtp(true);
      await api.post('/v1/public/send-otp', { email: leaderEmail });
      setOtpSent(true);
      toast.success('Alphanumeric verification code sent to your email! Please check inbox and spam folder.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length < 4) {
      toast.error('Please enter the OTP sent to your email.');
      return;
    }
    try {
      setVerifyingOtp(true);
      await api.post('/v1/public/verify-otp', { email: leaderEmail, otp: otpInput });
      setEmailVerified(true);
      toast.success('Email verified successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ── Team Member Handlers ────────────────────────────────────────────────

  const handleAddMember = () => {
    if (members.length >= 2) {
      toast.error('Maximum 2 team members allowed excluding the leader.');
      return;
    }
    if (!memberForm.name || !memberForm.email || !memberForm.mobile) {
      toast.error('Member Name, Email, and Mobile are required.');
      return;
    }
    setMembers([...members, { ...memberForm, id: Date.now() }]);
    setMemberForm({ name: '', email: '', mobile: '', college: 'HIET Ghaziabad', year: '3rd Year', branch: 'CSE' });
    setShowMemberModal(false);
    toast.success('Team member added!');
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success('Member removed.');
  };

  // ── Step Navigation & Validation ───────────────────────────────────────

  const validateStep1 = () => {
    if (!teamName.trim()) { toast.error('Team Name is required.'); return false; }
    if (!leaderName.trim()) { toast.error('Leader Name is required.'); return false; }
    if (!leaderEmail.trim()) { toast.error('Leader Email is required.'); return false; }
    if (!emailVerified) { toast.error('Please verify Leader Email using OTP before proceeding.'); return false; }
    if (!leaderMobile.trim() || leaderMobile.length < 10) { toast.error('Valid 10-digit Leader Mobile number is required.'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (isStudent) {
      const finalCollege = collegeSelect === 'Other' ? customCollege : collegeSelect;
      const finalBranch = branchSelect === 'Other' ? customBranch : branchSelect;
      const finalYear = yearSelect === 'Other' ? customYear : yearSelect;
      if (!finalCollege.trim()) { toast.error('College Name is required.'); return false; }
      if (!finalBranch.trim()) { toast.error('Branch is required.'); return false; }
      if (!finalYear.trim()) { toast.error('Year is required.'); return false; }
    } else {
      if (!organizationName.trim()) { toast.error('Organization Name is required.'); return false; }
      if (!stateSelect.trim()) { toast.error('State is required.'); return false; }
      const finalDistrict = districtSelect === 'Other' ? customDistrict : districtSelect;
      if (!finalDistrict.trim()) { toast.error('District is required.'); return false; }
    }
    return true;
  };

  const validateStep3 = () => {
    if (participationType === 'Team' && members.length === 0) {
      toast.error('Please add at least 1 team member or select "Individual" participation.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // ── Final Registration Submit ───────────────────────────────────────────

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!paperTitle.trim()) { toast.error('Paper Title is required.'); return; }
    if (!uniqueness.trim()) { toast.error('Paper Uniqueness description is required.'); return; }
    if (!paperCategory) { toast.error('Category selection is required.'); return; }
    if (!paperSubCategory) { toast.error('Sub-Category selection is required.'); return; }
    if (!paperFile) { toast.error('Please upload your Research Paper PDF (Max 25MB).'); return; }

    // Check PDF size < 25MB
    if (paperFile.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds 25 MB. Please upload a smaller PDF.');
      return;
    }

    try {
      setIsSubmitting(true);

      const finalCollege = isStudent
        ? (collegeSelect === 'Other' ? customCollege : collegeSelect)
        : organizationName;
      const finalBranch = isStudent ? (branchSelect === 'Other' ? customBranch : branchSelect) : 'N/A';
      const finalYear = isStudent ? (yearSelect === 'Other' ? customYear : yearSelect) : 'N/A';
      const finalDistrict = districtSelect === 'Other' ? customDistrict : districtSelect;

      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('institute', finalCollege);
      formData.append('conferenceTrack', paperCategory);
      formData.append('participationType', participationType);
      formData.append('isStudent', String(isStudent));

      formData.append('collegeName', finalCollege);
      formData.append('branch', finalBranch);
      formData.append('year', finalYear);
      formData.append('organizationName', organizationName);
      formData.append('state', stateSelect);
      formData.append('district', finalDistrict);

      formData.append('leaderName', leaderName);
      formData.append('leaderEmail', leaderEmail);
      formData.append('leaderMobile', leaderMobile);

      formData.append('members', JSON.stringify(members));

      formData.append('paperTitle', paperTitle);
      formData.append('paperAbstract', uniqueness);
      formData.append('uniqueness', uniqueness);
      formData.append('paperCategory', paperCategory);
      formData.append('paperSubCategory', paperSubCategory);
      formData.append('presentationPreference', 'Oral');
      formData.append('keywords', JSON.stringify([paperSubCategory]));

      formData.append('paper', paperFile);

      const res = await api.post('/v1/public/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const responseData = res.data.data;
      if (responseData?.user) {
        login(responseData.user);
      }

      setSuccessData(responseData);
      toast.success('Registration completed successfully! 🎉');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen Render ───────────────────────────────────────────────

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              Registration Confirmed
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Welcome to NEXUS 2026! 🎉</h1>
            <p className="text-xs text-slate-600 mt-1">Your team <strong>{successData.team?.teamName}</strong> has been registered.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 font-mono text-xs text-slate-700">
            <p className="font-sans font-bold text-emerald-700 text-sm mb-1">🔑 Account Credentials (Emailed)</p>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Registration ID:</span>
              <span className="text-slate-900 font-bold">{successData.team?.teamId || 'NEXUS-2026-REG'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Login Email:</span>
              <span className="text-slate-900">{successData.loginEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Password:</span>
              <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-300 shadow-sm">
                {successData.loginPassword}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Confirmation emails have been dispatched to <strong>{successData.loginEmail}</strong> with access instructions.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" /> Go to Team Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // Sub-categories list for currently selected category
  const availableSubCategories = CATEGORY_DATA[paperCategory] || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Title Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Free Registration — NEXUS 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Event Registration Portal</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Fill out the details below to submit your research paper for NEXUS 2026 International Conference.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 border-b border-slate-200 pb-6">
          {STEPS.map(s => {
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center text-center space-y-1.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${isDone
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20 shadow-lg'
                  : isCurrent
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500'
                    : 'bg-white border border-slate-200 text-slate-400'
                  }`}>
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.id}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold ${isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Step Form Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">

          {/* ── STEP 1: LEADER & TEAM INFO ──────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users className="w-5 h-5 text-emerald-600" /> Step 1: Team & Leader Details
              </h2>

              <InputField
                label="Team Name"
                required
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="e.g. Green AI Innovators"
              />

              <InputField
                label="Leader Full Name"
                required
                value={leaderName}
                onChange={e => setLeaderName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
              />

              {/* Leader Email with OTP Verification */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Leader Email Address <span className="text-emerald-600">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={leaderEmail}
                    disabled={emailVerified}
                    onChange={e => setLeaderEmail(e.target.value)}
                    placeholder="leader@college.edu"
                    className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition ${emailVerified ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 focus:border-emerald-600'
                      }`}
                  />
                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp || !leaderEmail}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-600/20"
                    >
                      {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                  {emailVerified && (
                    <span className="px-3 py-2.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                {/* OTP Input box if OTP sent and not verified yet */}
                {otpSent && !emailVerified && (
                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-3 mt-2">
                    <p className="text-xs text-slate-700">Enter the 6-character alphanumeric code sent to <strong>{leaderEmail}</strong>:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value.toUpperCase())}
                        placeholder="6-Char Code (e.g. NX8B4M)"
                        className="flex-1 px-4 py-2 bg-white border border-slate-300 text-center font-mono uppercase tracking-widest text-sm text-slate-900 rounded-xl focus:border-emerald-600 outline-none shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyingOtp}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-md"
                      >
                        {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <InputField
                label="Leader Mobile Number"
                required
                type="tel"
                value={leaderMobile}
                onChange={e => setLeaderMobile(e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>
          )}

          {/* ── STEP 2: ACADEMIC / PROFESSIONAL DETAILS ─────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-emerald-600" /> Step 2: Academic & Institutional Details
              </h2>

              {/* Are you a student checkbox */}
              <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-slate-300 transition">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={e => setIsStudent(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900">Are you a Student?</span>
                  <p className="text-[11px] text-slate-500">Check this box if you are currently enrolled in a college/university.</p>
                </div>
              </label>

              {/* If Student is TRUE */}
              {isStudent ? (
                <div className="space-y-4 pt-2">
                  <SelectField
                    label="College / Institute Name"
                    required
                    value={collegeSelect}
                    onChange={e => setCollegeSelect(e.target.value)}
                    options={COLLEGES_GZB}
                  />
                  {collegeSelect === 'Other' && (
                    <InputField
                      label="Type Your College Name"
                      required
                      value={customCollege}
                      onChange={e => setCustomCollege(e.target.value)}
                      placeholder="Enter full college name"
                    />
                  )}

                  <SelectField
                    label="Branch / Stream"
                    required
                    value={branchSelect}
                    onChange={e => setBranchSelect(e.target.value)}
                    options={BRANCHES}
                  />
                  {branchSelect === 'Other' && (
                    <InputField
                      label="Type Your Branch Name"
                      required
                      value={customBranch}
                      onChange={e => setCustomBranch(e.target.value)}
                      placeholder="e.g. Chemical Engineering"
                    />
                  )}

                  <SelectField
                    label="Year of Study"
                    required
                    value={yearSelect}
                    onChange={e => setYearSelect(e.target.value)}
                    options={YEARS}
                  />
                  {yearSelect === 'Other' && (
                    <InputField
                      label="Type Your Year"
                      required
                      value={customYear}
                      onChange={e => setCustomYear(e.target.value)}
                      placeholder="e.g. M.Tech 1st Year"
                    />
                  )}
                </div>
              ) : (
                /* If Student is FALSE (Professional / Faculty / Independent) */
                <div className="space-y-4 pt-2">
                  <InputField
                    label="Organization / Company / Institution Name"
                    required
                    value={organizationName}
                    onChange={e => setOrganizationName(e.target.value)}
                    placeholder="Enter full organization name"
                  />

                  <SelectField
                    label="Select State"
                    required
                    value={stateSelect}
                    onChange={e => {
                      setStateSelect(e.target.value);
                      setDistrictSelect(DISTRICTS_MAP[e.target.value]?.[0] || 'Other');
                    }}
                    options={INDIAN_STATES}
                  />

                  <SelectField
                    label="Select District"
                    required
                    value={districtSelect}
                    onChange={e => setDistrictSelect(e.target.value)}
                    options={DISTRICTS_MAP[stateSelect] || ['Other']}
                  />

                  {districtSelect === 'Other' && (
                    <InputField
                      label="Type Your District Name"
                      required
                      value={customDistrict}
                      onChange={e => setCustomDistrict(e.target.value)}
                      placeholder="Enter district name"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: PARTICIPATION TYPE & MEMBERS ────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users className="w-5 h-5 text-emerald-600" /> Step 3: Participation Type & Team Members
              </h2>

              {/* Participation Option: Individual vs Team */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setParticipationType('Individual');
                    setMembers([]);
                  }}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${participationType === 'Individual'
                    ? 'bg-emerald-50 border-2 border-emerald-500 text-slate-900 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  <User className={`w-6 h-6 mb-2 ${participationType === 'Individual' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <p className="font-bold text-sm">Individual Participant</p>
                  <p className="text-[11px] text-slate-500 mt-1">Register solo (Leader only, no team members).</p>
                </button>

                <button
                  type="button"
                  onClick={() => setParticipationType('Team')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${participationType === 'Team'
                    ? 'bg-emerald-50 border-2 border-emerald-500 text-slate-900 shadow-md'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                  <Users className={`w-6 h-6 mb-2 ${participationType === 'Team' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <p className="font-bold text-sm">Team Participation</p>
                  <p className="text-[11px] text-slate-500 mt-1">Add up to 2 team members (excluding Leader).</p>
                </button>
              </div>

              {/* If Team selected */}
              {participationType === 'Team' && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Team Members List</h3>
                      <p className="text-[11px] text-slate-500">Only 2 members allowed excluding leader (Max 3 total size).</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowMemberModal(true)}
                      disabled={members.length >= 2}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Plus className="w-4 h-4" /> Add Team Member ({members.length}/2)
                    </button>
                  </div>

                  {/* Members Cards */}
                  {members.length === 0 ? (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
                      No additional members added yet. Click "+ Add Team Member" to add up to 2 peers.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {members.map((m, idx) => (
                        <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono uppercase border border-emerald-200">Member #{idx + 1}</span>
                            <p className="font-bold text-slate-900 text-xs mt-1">{m.name}</p>
                            <p className="text-[11px] text-slate-600">{m.email} | {m.mobile}</p>
                            <p className="text-[10px] text-slate-500">{m.college} • {m.branch} ({m.year})</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(m.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: PAPER DETAILS & FILE UPLOAD ───────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-emerald-600" /> Step 4: Research Paper Details & Upload
              </h2>

              <InputField
                label="Title of the Paper"
                required
                value={paperTitle}
                onChange={e => setPaperTitle(e.target.value)}
                placeholder="e.g. AI-driven Smart Microgrid Energy Optimization"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uniqueness of Your Paper <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={uniqueness}
                  onChange={e => setUniqueness(e.target.value)}
                  placeholder="Describe what makes your research methodology or approach unique..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              {/* Category Select */}
              <SelectField
                label="Conference Track Category"
                required
                value={paperCategory}
                onChange={e => {
                  setPaperCategory(e.target.value);
                  setPaperSubCategory(CATEGORY_DATA[e.target.value]?.[0] || '');
                }}
                options={Object.keys(CATEGORY_DATA)}
              />

              {/* Sub-Category Select (Filtered by Category) */}
              <SelectField
                label="Sub-Category Domain"
                required
                value={paperSubCategory}
                onChange={e => setPaperSubCategory(e.target.value)}
                options={availableSubCategories}
              />

              {/* File Upload Option with PDF Only & Max 25 MB */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Paper File (PDF Only, Max 25 MB) <span className="text-emerald-600">*</span>
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center ${paperFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-emerald-500/60 hover:bg-slate-100/50'
                    }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type !== 'application/pdf') {
                          toast.error('Only PDF format files are allowed.');
                          return;
                        }
                        if (file.size > 25 * 1024 * 1024) {
                          toast.error('File size exceeds 25 MB limit.');
                          return;
                        }
                        setPaperFile(file);
                        toast.success(`Selected file: ${file.name}`);
                      }
                    }}
                    className="hidden"
                  />

                  <UploadCloud className={`w-10 h-10 mb-2 ${paperFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {paperFile ? (
                    <div>
                      <p className="text-xs font-bold text-slate-900">{paperFile.name}</p>
                      <p className="text-[10px] text-emerald-700 font-mono mt-0.5">
                        {(paperFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Ready
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to Select or Drag PDF File Here</p>
                      <p className="text-[10px] text-slate-500 mt-1">Accepts PDF files only up to 25 MB maximum size.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ── Form Navigation Buttons ────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center gap-1"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition shadow-xl shadow-emerald-600/20 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Submit Final Registration
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── Add Member Modal ────────────────────────────────────────────────── */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" /> Add Team Member Details
              </h3>
              <button onClick={() => setShowMemberModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <InputField
                label="Member Name"
                required
                value={memberForm.name}
                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="Full Name"
              />

              <InputField
                label="Member Email"
                required
                type="email"
                value={memberForm.email}
                onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                placeholder="member@college.edu"
              />

              <InputField
                label="Member Mobile"
                required
                type="tel"
                value={memberForm.mobile}
                onChange={e => setMemberForm({ ...memberForm, mobile: e.target.value })}
                placeholder="10-digit mobile number"
              />

              <InputField
                label="Member College"
                value={memberForm.college}
                onChange={e => setMemberForm({ ...memberForm, college: e.target.value })}
                placeholder="College Name"
              />

              <SelectField
                label="Member Branch"
                value={memberForm.branch}
                onChange={e => setMemberForm({ ...memberForm, branch: e.target.value })}
                options={BRANCHES}
              />

              <SelectField
                label="Member Year"
                value={memberForm.year}
                onChange={e => setMemberForm({ ...memberForm, year: e.target.value })}
                options={YEARS}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowMemberModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMember}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
