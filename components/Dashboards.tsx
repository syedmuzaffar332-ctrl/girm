
import React, { useState, useEffect } from 'react';
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
  MessageSquare
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'reports'>('overview');
  const [appointments, setAppointments] = useState<Enrollment[]>([]);
  const [reports, setReports] = useState<LabReport[]>([]);

  useEffect(() => {
    const data = db.getEnrollments().filter(e => e.email === user.email);
    setAppointments(data);
    setReports(db.getReportsByUserId(user.id));
  }, [user]);

  const getDoctorName = (id?: number) => {
    if (!id) return 'Medical Officer';
    return DOCTORS.find(d => d.id === id)?.name || 'Specialist';
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
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <FileText className="w-4 h-4" />
            <span>Medical Records</span>
          </button>
          <div className="pt-8 border-t border-white/5 mt-8">
            <p className="px-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Support & Care</p>
            <button className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <MessageSquare className="w-4 h-4" />
              <span>Chat with Care</span>
            </button>
            <button className="w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </nav>
        <div className="p-6">
          <button onClick={onLogout} className="w-full flex items-center justify-center space-x-3 bg-white/5 border border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-apollo-red hover:bg-white hover:border-white transition-all">
            <LogOut className="w-4 h-4" />
            <span>Secure Exit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-12">
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-apollo-red font-black uppercase text-[10px] tracking-[0.3em] mb-2 block">Welcome Back</span>
                <h1 className="text-4xl font-black text-apollo-blue uppercase tracking-tighter">Clinical Dashboard</h1>
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => onNavigate('/enroll')} className="bg-apollo-red text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-apollo-red/20 hover:scale-105 transition-all">Book New Visit</button>
                 <button className="bg-white border border-slate-200 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Digital Pharmacy</button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-apollo-blue/5 text-apollo-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-apollo-blue group-hover:text-white transition-all">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Visits</h4>
                  <div className="text-5xl font-black text-apollo-blue tracking-tighter">{appointments.length}</div>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-apollo-red/5 text-apollo-red rounded-xl flex items-center justify-center mb-6 group-hover:bg-apollo-red group-hover:text-white transition-all">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Upcoming</h4>
                  <div className="text-5xl font-black text-apollo-red tracking-tighter">{appointments.filter(a => a.status === 'confirmed').length}</div>
               </div>
               <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reports Ready</h4>
                  <div className="text-5xl font-black text-green-600 tracking-tighter">{reports.filter(r => r.status === 'available').length}</div>
               </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xs font-black text-apollo-blue uppercase tracking-widest">Recent Activity</h3>
                  <button className="text-[9px] font-black uppercase text-apollo-red tracking-widest hover:underline">View History</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {appointments.length > 0 ? appointments.slice(0, 4).map(app => (
                    <div key={app.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-apollo-grey rounded-2xl flex items-center justify-center border border-slate-100">
                          <Stethoscope className="w-7 h-7 text-apollo-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-apollo-blue uppercase tracking-tight">{app.department}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dr. {getDoctorName(app.doctorId)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                          app.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 
                          app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>{app.status}</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent appointments</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-apollo-blue rounded-3xl shadow-xl p-10 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                 <div className="relative z-10">
                    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                       <MapPin className="w-8 h-8 text-apollo-red" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">GIRM Smart Care</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs font-medium">
                       Access 24/7 video consultations with our lead specialists from the comfort of your home.
                    </p>
                    <button className="bg-white text-apollo-blue px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-apollo-red hover:text-white transition-all shadow-2xl">
                       Launch Tele-Health
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-black text-apollo-blue uppercase tracking-tighter">My Consultations</h1>
              <button onClick={() => onNavigate('/enroll')} className="bg-apollo-blue text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-apollo-blue/20">Schedule New</button>
            </div>
            <div className="grid gap-6">
               {appointments.length > 0 ? appointments.map(app => (
                 <div key={app.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-10">
                       <div className="text-center p-5 bg-apollo-grey rounded-2xl border border-slate-200 group-hover:border-apollo-blue transition-all">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Slot</p>
                          <p className="text-sm font-black text-apollo-blue">{app.timeSlot || 'TBD'}</p>
                       </div>
                       <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-black text-apollo-blue uppercase tracking-tight">{app.department}</h3>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${app.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                              {app.status === 'confirmed' ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expert: Dr. {getDoctorName(app.doctorId)}</p>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1 text-slate-400">
                               <Calendar className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-slate-400">
                               <Clock className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-bold uppercase tracking-widest">In-Clinic</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <button className="bg-apollo-grey text-apollo-blue px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-apollo-blue hover:text-white transition-all">Reschedule</button>
                       <button className="p-3.5 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <XCircle className="w-6 h-6" />
                       </button>
                    </div>
                 </div>
               )) : (
                 <div className="py-24 text-center bg-white rounded-3xl border border-slate-100">
                    <Calendar className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter">No Appointments Scheduled</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Begin your healthcare journey by booking a specialist</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black text-apollo-blue uppercase tracking-tighter">Medical Records Vault</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {reports.length > 0 ? reports.map(report => (
                 <div key={report.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-2xl transition-all relative overflow-hidden">
                    {report.status === 'available' && <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full translate-x-1/2 -translate-y-1/2" />}
                    <div className="flex items-start justify-between mb-8">
                       <div className="w-14 h-14 bg-apollo-grey rounded-2xl flex items-center justify-center text-apollo-blue group-hover:bg-apollo-blue group-hover:text-white transition-all border border-slate-100">
                          <FileText className="w-7 h-7" />
                       </div>
                       {report.status === 'available' && (
                         <button className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                            <Download className="w-5 h-5" />
                         </button>
                       )}
                    </div>
                    <h3 className="font-black text-apollo-blue uppercase tracking-tight text-xl mb-1">{report.testName}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-6">Released: {report.date}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <span className={`text-[9px] font-black uppercase tracking-widest flex items-center space-x-2 ${report.status === 'available' ? 'text-green-600' : 'text-orange-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${report.status === 'available' ? 'bg-green-600' : 'bg-orange-500 animate-pulse'}`} />
                          <span>{report.status}</span>
                       </span>
                       <button className="text-[10px] font-black text-apollo-red uppercase tracking-widest hover:underline">Full Review</button>
                    </div>
                 </div>
               )) : (
                 <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-slate-100">
                    <FileText className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter">No Records Found</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Reports will appear here once finalized by our labs</p>
                 </div>
               )}
               <div className="bg-apollo-grey border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-slate-400 group hover:border-apollo-blue hover:text-apollo-blue transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest">Digitize Documents</p>
                  <p className="text-[9px] font-bold uppercase mt-2 opacity-60">Upload external records</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<DashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [appointments, setAppointments] = useState<Enrollment[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'beds'>('appointments');

  useEffect(() => {
    setAppointments(db.getEnrollments());
  }, []);

  const handleStatusChange = async (id: string, status: Enrollment['status']) => {
    await db.updateEnrollmentStatus(id, status);
    setAppointments(db.getEnrollments());
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Admin Sidebar */}
      <div className="w-72 bg-apollo-blue text-white flex flex-col shrink-0">
        <div className="p-10 border-b border-white/10">
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Command</h2>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-2">Operation Control</p>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'appointments' ? 'bg-apollo-red text-white shadow-xl shadow-apollo-red/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Calendar className="w-4 h-4" />
            <span>Clinic Queue</span>
          </button>
          <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'patients' ? 'bg-apollo-red text-white shadow-xl shadow-apollo-red/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Users className="w-4 h-4" />
            <span>CME Database</span>
          </button>
          <button onClick={() => setActiveTab('beds')} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'beds' ? 'bg-apollo-red text-white shadow-xl shadow-apollo-red/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
            <Activity className="w-4 h-4" />
            <span>Facility Telemetry</span>
          </button>
        </nav>
        <div className="p-6">
           <button onClick={onLogout} className="w-full text-center py-4 border-2 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-apollo-blue transition-all">System Logout</button>
        </div>
      </div>

      <div className="flex-grow p-12 overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
           <header className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black text-apollo-blue uppercase tracking-tighter">Operations Hub</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time hospital administration</p>
              </div>
              <div className="flex items-center space-x-6">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-apollo-blue transition-colors" />
                    <input type="text" placeholder="Search Master Index..." className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-apollo-blue focus:outline-none focus:border-apollo-blue transition-all shadow-sm w-72" />
                 </div>
                 <button className="bg-white border-2 border-slate-100 text-slate-400 p-3.5 rounded-2xl shadow-sm hover:text-apollo-blue hover:border-apollo-blue transition-all"><Settings className="w-5 h-5" /></button>
              </div>
           </header>

           {activeTab === 'appointments' && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-6 duration-700">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-apollo-blue uppercase tracking-widest">Incoming Requests</h3>
                    <div className="flex space-x-3">
                       <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-[9px] font-black uppercase">Pending: {appointments.filter(a => a.status === 'pending').length}</span>
                       <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-[9px] font-black uppercase">Active: {appointments.filter(a => a.status === 'confirmed').length}</span>
                    </div>
                 </div>
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                          <th className="px-10 py-6">Identity</th>
                          <th className="px-10 py-6">Department</th>
                          <th className="px-10 py-6">Timeline</th>
                          <th className="px-10 py-6">Clinical Status</th>
                          <th className="px-10 py-6 text-right">Verification</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {appointments.map(app => (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-10 py-8">
                                <div className="font-black text-apollo-blue uppercase text-sm tracking-tight">{app.name}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{app.email}</div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="inline-flex items-center space-x-2 bg-apollo-grey text-apollo-blue px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                                  <Stethoscope className="w-3 h-3" />
                                  <span>{app.department}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <div className="text-[10px] font-black text-apollo-blue uppercase tracking-tight">{app.timeSlot || 'WALK-IN'}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Slot requested</div>
                             </td>
                             <td className="px-10 py-8">
                                <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                                  app.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 
                                  app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'
                                }`}>{app.status}</span>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="flex justify-end space-x-3">
                                   <button 
                                     onClick={() => handleStatusChange(app.id, 'confirmed')} 
                                     className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                     title="Verify Appointment"
                                   >
                                     <CheckCircle className="w-5 h-5" />
                                   </button>
                                   <button 
                                     onClick={() => handleStatusChange(app.id, 'cancelled')} 
                                     className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                     title="Decline Request"
                                   >
                                     <XCircle className="w-5 h-5" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {appointments.length === 0 && (
                         <tr>
                            <td colSpan={5} className="px-10 py-24 text-center">
                               <div className="max-w-xs mx-auto">
                                  <Users className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                                  <h3 className="text-xl font-black text-slate-300 uppercase tracking-tighter">No Queue Activity</h3>
                                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">All requests have been processed successfully.</p>
                               </div>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
