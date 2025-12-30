
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../services/database';
import { User, Enrollment, LabReport } from '../types';
import { DOCTORS } from '../constants';
import { 
  User as UserIcon, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  Clock, 
  CheckCircle, 
  XCircle,
  Activity,
  Download,
  Upload,
  Search,
  Users,
  Stethoscope,
  MapPin,
  MessageSquare,
  ClipboardList,
  Save,
  ChevronRight,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Video
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'reports' | 'notes'>('overview');
  const [appointments, setAppointments] = useState<Enrollment[]>([]);
  const [reports, setReports] = useState<LabReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ testName: '', file: null as File | null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = db.getEnrollments().filter(e => e.email === user.email);
    setAppointments(data);
    refreshReports();
  }, [user]);

  const refreshReports = () => {
    setReports(db.getReportsByUserId(user.id));
  };

  const getDoctorName = (id?: number) => {
    if (!id) return 'Medical Officer';
    return DOCTORS.find(d => d.id === id)?.name || 'Specialist';
  };

  // Filtered Data
  const filteredAppointments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return appointments;
    return appointments.filter(app => {
      const docName = getDoctorName(app.doctorId).toLowerCase();
      return (
        app.department.toLowerCase().includes(query) ||
        docName.includes(query) ||
        app.appointmentDate.includes(query) ||
        app.status.toLowerCase().includes(query)
      );
    });
  }, [appointments, searchQuery]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return reports;
    return reports.filter(report => (
      report.testName.toLowerCase().includes(query) ||
      report.date.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query)
    ));
  }, [reports, searchQuery]);

  const notedAppointments = useMemo(() => 
    filteredAppointments.filter(a => a.clinicalNotes || a.doctorDiagnosis),
  [filteredAppointments]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.testName) return;

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(uploadData.file);
      const newReport: LabReport = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        testName: uploadData.testName,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        fileUrl: base64,
        status: 'available'
      };
      await db.saveReport(newReport);
      refreshReports();
      setShowUploadModal(false);
      setUploadData({ testName: '', file: null });
    } catch (err) {
      alert('Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (report: LabReport) => {
    const link = document.createElement('a');
    link.href = report.fileUrl;
    link.download = `${report.testName.replace(/\s+/g, '_')}_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-apollo-grey flex">
      {/* Sidebar */}
      <div className="w-72 bg-apollo-navy text-white flex flex-col shrink-0">
        <div className="p-10 border-b border-white/10">
          <div className="w-14 h-14 bg-apollo-red rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-apollo-red/20 rotate-3">
            <UserIcon className="w-7 h-7 -rotate-3" />
          </div>
          <h2 className="font-black text-lg uppercase tracking-tighter leading-tight">{user.name}</h2>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Patient ID: {user.id.toUpperCase()}</p>
        </div>
        <nav className="flex-grow p-6 space-y-3">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Activity className="w-4 h-4" />
            <span>Health Pulse</span>
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'appointments' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Calendar className="w-4 h-4" />
            <span>Consultations</span>
          </button>
          <button onClick={() => setActiveTab('notes')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'notes' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <ClipboardList className="w-4 h-4" />
            <span>Doctor Notes</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <FileText className="w-4 h-4" />
            <span>Medical Records</span>
          </button>
        </nav>
        <div className="p-6">
          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-3 bg-white/5 border border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-apollo-red hover:bg-white hover:border-white transition-all">
            <LogOut className="w-4 h-4" />
            <span>Secure Exit</span>
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-12">
        <div className="space-y-12 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-apollo-red font-black uppercase text-[10px] tracking-[0.3em] mb-2 block">Patient Portal</span>
              <h1 className="text-4xl font-black text-apollo-blue uppercase tracking-tighter">
                {activeTab === 'overview' && 'Clinical Dashboard'}
                {activeTab === 'appointments' && 'Consultations'}
                {activeTab === 'notes' && 'Clinical Summaries'}
                {activeTab === 'reports' && 'Medical Records'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-apollo-blue focus:outline-none shadow-sm" />
              </div>
              <button onClick={() => onNavigate('/enroll')} className="bg-apollo-red text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-apollo-red/20 hover:scale-105 transition-all whitespace-nowrap">
                New Visit
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-black text-apollo-blue uppercase tracking-widest">Recent Activity</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {filteredAppointments.length > 0 ? filteredAppointments.slice(0, 4).map(app => (
                      <div key={app.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                        <div className="flex items-center space-x-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 ${app.consultationType === 'telemedicine' ? 'bg-red-50 text-apollo-red' : 'bg-apollo-grey text-apollo-blue'}`}>
                            {app.consultationType === 'telemedicine' ? <Video className="w-7 h-7" /> : <Stethoscope className="w-7 h-7" />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-apollo-blue uppercase tracking-tight">{app.department}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dr. {getDoctorName(app.doctorId)} • {app.consultationType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${app.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>{app.status}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center text-slate-300 font-black uppercase text-xs">No records found</div>
                    )}
                  </div>
                </div>

                <div className="bg-apollo-blue rounded-3xl shadow-xl p-10 text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                   <div className="relative z-10">
                      <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                         <Video className="w-8 h-8 text-apollo-red" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Tele-Health Hub</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs font-medium">Join confirmed video consultations or browse digital recordings of previous sessions.</p>
                      <button onClick={() => setActiveTab('appointments')} className="bg-white text-apollo-blue px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-apollo-red hover:text-white transition-all">Launch Tele-Portal</button>
                   </div>
                </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="grid gap-6">
               {filteredAppointments.length > 0 ? filteredAppointments.map(app => (
                 <div key={app.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center space-x-10">
                       <div className={`text-center p-5 rounded-2xl border transition-all ${app.consultationType === 'telemedicine' ? 'bg-red-50 border-red-100' : 'bg-apollo-grey border-slate-200'}`}>
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${app.consultationType === 'telemedicine' ? 'text-apollo-red' : 'text-slate-400'}`}>Time</p>
                          <p className={`text-sm font-black ${app.consultationType === 'telemedicine' ? 'text-apollo-red' : 'text-apollo-blue'}`}>{app.timeSlot || 'TBD'}</p>
                       </div>
                       <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tight">{app.department}</h3>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${app.consultationType === 'telemedicine' ? 'bg-apollo-red text-white border-red-800' : 'bg-slate-50 text-slate-400'}`}>{app.consultationType}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expert: Dr. {getDoctorName(app.doctorId)}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>{app.appointmentDate}</span>
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       {app.consultationType === 'telemedicine' && app.status === 'confirmed' && (
                         <button 
                           onClick={() => onNavigate(`/tele-consult/${app.id}`)}
                           className="bg-apollo-red text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-apollo-navy transition-all shadow-xl flex items-center space-x-2 animate-pulse"
                         >
                            <Video className="w-4 h-4" />
                            <span>Join Call</span>
                         </button>
                       )}
                       <button className="bg-apollo-grey text-apollo-blue px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-apollo-blue hover:text-white transition-all">Manage</button>
                    </div>
                 </div>
               )) : (
                 <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 text-slate-300 font-black uppercase tracking-widest">No Consultations scheduled</div>
               )}
            </div>
          )}

          {/* ... Other tabs (notes, reports) remain standard ... */}
          {activeTab === 'notes' && (
             <div className="space-y-6">
                {notedAppointments.length > 0 ? notedAppointments.map(app => (
                   <div key={app.id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h4 className="text-sm font-black text-apollo-blue uppercase">{app.department} Review</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dr. {getDoctorName(app.doctorId)} • {app.appointmentDate}</p>
                         </div>
                         <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100 flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3" />
                            <span>Signed</span>
                         </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Clinical Diagnosis</p>
                         <p className="text-sm font-black text-apollo-blue mb-4">{app.doctorDiagnosis || "Routine Screening"}</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Treatment Plan</p>
                         <p className="text-xs font-medium text-slate-600 leading-relaxed italic">{app.clinicalNotes}</p>
                      </div>
                   </div>
                )) : <div className="py-24 text-center text-slate-300 font-black uppercase tracking-widest">No clinical summaries available</div>}
             </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredReports.map(report => (
                 <div key={report.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <FileText className="w-8 h-8 text-apollo-blue mb-6" />
                    <h3 className="font-black text-apollo-blue uppercase tracking-tight text-xl mb-1">{report.testName}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-6">Released: {report.date}</p>
                    <button onClick={() => handleDownload(report)} className="w-full bg-apollo-grey text-apollo-blue py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-apollo-blue hover:text-white transition-all">Download PDF</button>
                 </div>
               ))}
               <div onClick={() => setShowUploadModal(true)} className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-300 hover:border-apollo-blue hover:text-apollo-blue transition-all cursor-pointer">
                  <Plus className="w-10 h-10 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Report</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-apollo-navy/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8">
            <h3 className="text-2xl font-black text-apollo-blue uppercase tracking-tighter mb-8">Record Upload</h3>
            <form onSubmit={handleUpload} className="space-y-6">
              <input type="text" required placeholder="Report Title" value={uploadData.testName} onChange={(e) => setUploadData({ ...uploadData, testName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-apollo-blue font-bold focus:outline-none" />
              <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer">
                  <input type="file" ref={fileInputRef} hidden onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} />
                  <FileText className="w-10 h-10 text-slate-200" />
                  <p className="text-xs font-black text-slate-400 uppercase mt-4">{uploadData.file ? uploadData.file.name : 'Select File'}</p>
              </div>
              <button type="submit" disabled={isUploading} className="w-full bg-apollo-blue text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">
                 {isUploading ? <Loader2 className="animate-spin mx-auto" /> : 'Secure Upload'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPanel: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [appointments, setAppointments] = useState<Enrollment[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'beds'>('appointments');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteForm, setNoteForm] = useState({ diagnosis: '', notes: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAppointments(db.getEnrollments());
  }, []);

  const handleStatusChange = async (id: string, status: Enrollment['status']) => {
    await db.updateEnrollmentStatus(id, status);
    setAppointments(db.getEnrollments());
  };

  const startEditingNotes = (app: Enrollment) => {
    setEditingNotesId(app.id);
    setNoteForm({
      diagnosis: app.doctorDiagnosis || '',
      notes: app.clinicalNotes || ''
    });
  };

  const handleSaveNotes = async () => {
    if (!editingNotesId) return;
    setIsSaving(true);
    await db.updateEnrollmentNotes(editingNotesId, noteForm.diagnosis, noteForm.notes);
    setAppointments(db.getEnrollments());
    setEditingNotesId(null);
    setIsSaving(false);
  };

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return appointments;
    return appointments.filter(app => (
      app.name.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.department.toLowerCase().includes(query) ||
      app.appointmentDate.includes(query)
    ));
  }, [appointments, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Admin Sidebar */}
      <div className="w-72 bg-apollo-blue text-white flex flex-col shrink-0">
        <div className="p-10 border-b border-white/10">
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Operations</h2>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'appointments' ? 'bg-apollo-red text-white shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Calendar className="w-4 h-4" />
            <span>Clinic Queue</span>
          </button>
          <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'patients' ? 'bg-apollo-red text-white shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Users className="w-4 h-4" />
            <span>CME Database</span>
          </button>
        </nav>
        <div className="p-6">
           <button onClick={onLogout} className="w-full text-center py-4 border-2 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-apollo-blue transition-all">Logout</button>
        </div>
      </div>

      <div className="flex-grow p-12 overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
           <header className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black text-apollo-blue uppercase tracking-tighter">Ops Command</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Hospital CMS v2.0</p>
              </div>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-apollo-blue transition-colors" />
                <input type="text" placeholder="Search Master Index..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-apollo-blue focus:outline-none w-72" />
              </div>
           </header>

           {activeTab === 'appointments' && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-xs font-black text-apollo-blue uppercase tracking-widest">Incoming Medical Requests</h3>
                 </div>
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                          <th className="px-10 py-6">Patient Identity</th>
                          <th className="px-10 py-6">Dept / Mode</th>
                          <th className="px-10 py-6 text-right">Medical Status</th>
                          <th className="px-10 py-6 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredAppointments.map(app => (
                          <React.Fragment key={app.id}>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-10 py-8">
                                  <div className="font-black text-apollo-blue uppercase text-sm tracking-tight">{app.name}</div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{app.email}</div>
                              </td>
                              <td className="px-10 py-8">
                                  <div className="inline-flex items-center space-x-2 bg-apollo-grey text-apollo-blue px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                                    {app.consultationType === 'telemedicine' ? <Video className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />}
                                    <span>{app.department} • {app.consultationType}</span>
                                  </div>
                              </td>
                              <td className="px-10 py-8 text-right">
                                 <button onClick={() => startEditingNotes(app)} className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${app.clinicalNotes ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400 hover:bg-apollo-blue hover:text-white'}`}>
                                    <ClipboardList className="w-3.5 h-3.5" />
                                    <span>{app.clinicalNotes ? 'View Notes' : 'Clinical Entry'}</span>
                                 </button>
                              </td>
                              <td className="px-10 py-8 text-right">
                                  <div className="flex justify-end space-x-3">
                                    <button onClick={() => handleStatusChange(app.id, 'confirmed')} className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"><CheckCircle className="w-5 h-5" /></button>
                                    <button onClick={() => handleStatusChange(app.id, 'cancelled')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><XCircle className="w-5 h-5" /></button>
                                  </div>
                              </td>
                            </tr>
                            {editingNotesId === app.id && (
                              <tr className="bg-slate-50/80">
                                <td colSpan={4} className="px-10 py-8">
                                  <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
                                     <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                           <label className="text-[10px] font-black uppercase text-slate-400">Clinical Diagnosis</label>
                                           <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-apollo-blue focus:outline-none" value={noteForm.diagnosis} onChange={(e) => setNoteForm({...noteForm, diagnosis: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                           <label className="text-[10px] font-black uppercase text-slate-400">Treatment Plan</label>
                                           <textarea rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-apollo-blue focus:outline-none" value={noteForm.notes} onChange={(e) => setNoteForm({...noteForm, notes: e.target.value})} />
                                        </div>
                                     </div>
                                     <div className="mt-8 flex justify-end space-x-4">
                                        <button onClick={() => setEditingNotesId(null)} className="px-8 py-3 rounded-xl text-[10px] font-black uppercase text-slate-400">Cancel</button>
                                        <button onClick={handleSaveNotes} disabled={isSaving} className="bg-apollo-blue text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center space-x-2">
                                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                          <span>Finalize Record</span>
                                        </button>
                                     </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};