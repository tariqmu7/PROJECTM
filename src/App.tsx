import React, { useState, useRef } from 'react';
import {
  Save,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Activity,
  FileText,
  Camera,
  Image as ImageIcon,
  HardHat,
  Factory,
  Calendar,
  User,
  MapPin,
  Trash2,
  Plus,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  progress: number;
}

interface Achievement {
  id: string;
  description: string;
  date: string;
  impact: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState(1);
  const totalTabs = 4;

  const [formData, setFormData] = useState({
    projectName: '',
    projectManager: '',
    facilityLocation: '',
    reportPeriod: 'Q1-2026',
    overallStatus: 'Green',
    executiveSummary: '',
    hse: {
      lti: 0,
      trir: 0,
      spills: 0,
      daysWithoutIncident: 0,
    },
    financials: {
      budget: '',
      actual: '',
      forecast: '',
    },
    targets: '',
    qBottlenecks: '',
    qResourceAllocation: '',
    qEmergingRisks: '',
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', description: '', date: '', impact: '' }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Site Preparation & Grading', status: 'Completed', progress: 100 },
    { id: '2', name: 'Foundations & Structural Steel', status: 'In Progress', progress: 65 },
    { id: '3', name: 'Vessel Installation', status: 'Not Started', progress: 0 },
  ]);

  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file: File) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const addTask = () => {
    setTasks(prev => [...prev, { id: Date.now().toString(), name: '', status: 'Not Started', progress: 0 }]);
  };

  const updateTask = (id: string, field: keyof Task, value: any) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addAchievement = () => {
    setAchievements(prev => [...prev, { id: Date.now().toString(), description: '', date: '', impact: '' }]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAchievement = (id: string) => {
    if (achievements.length > 1) {
      setAchievements(prev => prev.filter(a => a.id !== id));
    }
  };

  const exportData = () => {
    const dataToExport = {
      ...formData,
      achievements,
      tasks,
      timestamp: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `Project_Report_${formData.projectName.replace(/\s+/g, '_')}_${formData.reportPeriod}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert("Report data exported as JSON for local database ingestion.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Green': return 'bg-emerald-500';
      case 'Amber': return 'bg-amber-500';
      case 'Red': return 'bg-red-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="bg-slate-100 text-slate-900 font-sans h-screen flex flex-col overflow-hidden">
      {/* Top Engineering/Corporate Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b-4 border-amber-500 shrink-0 relative z-20">
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
            <Factory className="text-amber-500 w-6 h-6" /> Genesis Energy Corp
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Strategic Project Reporting Portal</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <span className="block text-[10px] uppercase text-slate-400">Reporting Period</span>
            <span className="font-bold text-sm tracking-wide">{formData.reportPeriod || 'Reporting Period'}</span>
          </div>
          <div className="h-10 w-px bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-500">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold">{formData.projectManager || 'PM Account'}</p>
              <p className="text-[10px] text-slate-400 uppercase">Status: {formData.overallStatus}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 px-4 pt-2 shrink-0 shadow-sm print:hidden relative z-10">
        <div className="flex space-x-2 min-w-max mx-auto max-w-6xl justify-start sm:justify-center overflow-x-auto custom-scrollbar pb-0">
          {[
            { id: 1, name: 'Project Info & Summary', icon: FileText, number: '1' },
            { id: 2, name: 'HSE & Targets', icon: CheckCircle, number: '2' },
            { id: 3, name: 'Tasks & Financials', icon: TrendingUp, number: '3' },
            { id: 4, name: 'Analysis & Media', icon: Camera, number: '4' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-50/50 text-slate-900 border-amber-500'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeTab === tab.id ? 'bg-amber-500 text-slate-900' : 'bg-slate-200 text-slate-500'}`}>{tab.number}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto w-full custom-scrollbar print:overflow-visible print:h-auto pb-8">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Page 1: Project Info & Exec Summary */}
          <div className={`${activeTab === 1 ? 'block' : 'hidden'} print:block space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Section 1: Project Metadata */}
            <div className="bg-white border border-slate-200 shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   <FileText className="w-4 h-4 text-slate-400" />
                   1. Project Identity & Parameters
                 </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
                  <div className="relative">
                    <HardHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="e.g. CDU Debottlenecking Phase II"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Manager</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="projectManager"
                      value={formData.projectManager}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Facility / Site Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="facilityLocation"
                      value={formData.facilityLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. Houston Refinery Sector 4"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reporting Period</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      name="reportPeriod"
                      value={formData.reportPeriod}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white appearance-none transition-colors"
                    >
                      <option>Q1-2026</option>
                      <option>Q2-2026</option>
                      <option>Q3-2026</option>
                      <option>Q4-2026</option>
                      <option>Annual-2026</option>
                      <option>Q1-2027</option>
                      <option>Q2-2027</option>
                      <option>Q3-2027</option>
                      <option>Q4-2027</option>
                      <option>Annual-2027</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Executive Summary & RAG */}
            <div className="bg-white border border-slate-200 shadow-sm flex flex-col">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center">
                <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2 tracking-widest">
                  <Activity className="w-4 h-4 text-slate-400" />
                  2. Executive Summary
                </h2>
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Overall RAG</span>
                  <div className="flex gap-2">
                    {['Green', 'Amber', 'Red'].map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData(prev => ({ ...prev, overallStatus: color }))}
                        className={`w-5 h-5 border transition-all ${
                          formData.overallStatus === color 
                            ? 'border-slate-400 shadow-md scale-125 z-10' 
                            : 'border-slate-300 opacity-40 hover:opacity-100 hover:scale-110'
                        } ${getStatusColor(color)}`}
                        title={`${color} Status`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <textarea
                  name="executiveSummary"
                  value={formData.executiveSummary}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Provide a high-level overview of project health, critical milestones achieved, and major roadblocks..."
                  className="w-full border p-4 text-sm bg-slate-50 border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white resize-y transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Page 2: HSE & Performance */}
          <div className={`${activeTab === 2 ? 'block' : 'hidden'} print:block space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            {/* Section 3: HSE */}
            <div className="bg-white border border-slate-200 shadow-sm">
              <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
                 <h2 className="text-sm font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-emerald-600" />
                   3. HSE Performance
                 </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2 bg-white flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block">Days w/o Incident</label>
                  <input type="number" name="hse.daysWithoutIncident" value={formData.hse.daysWithoutIncident} onChange={handleInputChange} className="w-full p-2.5 text-lg border-b-2 border-slate-300 focus:border-slate-900 bg-slate-50 focus:bg-white focus:outline-none font-mono transition-colors text-slate-800" />
                </div>
                <div className="space-y-2 bg-white flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block">LTI <span className="lowercase text-[10px] font-normal">(Lost Time Injury)</span></label>
                  <input type="number" name="hse.lti" value={formData.hse.lti} onChange={handleInputChange} className="w-full p-2.5 text-lg border-b-2 border-slate-300 focus:border-red-500 bg-slate-50 focus:bg-white focus:outline-none font-mono transition-colors text-slate-800" />
                </div>
                <div className="space-y-2 bg-white flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block">TRIR</label>
                  <input type="number" step="0.01" name="hse.trir" value={formData.hse.trir} onChange={handleInputChange} className="w-full p-2.5 text-lg border-b-2 border-slate-300 focus:border-amber-500 bg-slate-50 focus:bg-white focus:outline-none font-mono transition-colors text-slate-800" />
                </div>
                <div className="space-y-2 bg-white flex flex-col">
                  <label className="text-[11px] font-bold text-slate-500 uppercase block">Environmental Spills</label>
                  <input type="number" name="hse.spills" value={formData.hse.spills} onChange={handleInputChange} className="w-full p-2.5 text-lg border-b-2 border-slate-300 focus:border-red-500 bg-slate-50 focus:bg-white focus:outline-none font-mono transition-colors text-slate-800" />
                </div>
              </div>
            </div>

            {/* Section 4: Targets & Achievements */}
            <div className="bg-white border border-slate-200 shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   <CheckCircle className="w-4 h-4 text-slate-400" />
                   4. Predefined Targets vs. Detailed Achievements
                 </h2>
              </div>
              <div className="p-6 space-y-8">
                <div className="space-y-2 lg:w-3/4">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quarter/Annual Target Objectives</label>
                  <textarea
                    name="targets"
                    value={formData.targets}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border p-3 text-sm bg-slate-50 border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-colors resize-y leading-relaxed"
                    placeholder="Define the primary targets expected to be hit during this period..."
                  />
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end border-b-2 border-slate-800 pb-2">
                      <label className="block text-sm font-bold text-slate-800 uppercase tracking-wider">Achievement Log</label>
                      <button onClick={addAchievement} className="text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1 uppercase bg-amber-400 hover:bg-amber-300 px-3 py-1.5 transition-colors shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Log Achievement
                      </button>
                   </div>
                   <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div key={achievement.id} className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-4 border border-slate-200 relative group">
                          <div className="w-8 shrink-0 flex items-center justify-center font-bold text-slate-300 text-sm py-2 bg-white border border-slate-200 aspect-square">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-4 w-full">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-1.5">
                                  <label className="text-[10px] uppercase font-bold text-slate-500">Achievement Description</label>
                                  <input type="text" value={achievement.description} onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)} className="w-full p-2.5 text-sm bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors" placeholder="E.g. Completed phase 2 hydrostatic testing successfully" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] uppercase font-bold text-slate-500">Date Achieved</label>
                                  <input type="date" value={achievement.date} onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)} className="w-full p-2.5 text-sm bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors font-mono text-slate-700" />
                                </div>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-500">Business/Project Impact</label>
                                <textarea value={achievement.impact} onChange={(e) => updateAchievement(achievement.id, 'impact', e.target.value)} rows={2} className="w-full p-2.5 text-sm bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors resize-y leading-relaxed" placeholder="How did this contribute to the overall project target?" />
                             </div>
                          </div>
                          <button onClick={() => removeAchievement(achievement.id)} disabled={achievements.length === 1} className={`absolute top-2 right-2 p-1.5 ${achievements.length > 1 ? 'text-slate-400 hover:text-red-500 bg-white shadow-sm border border-slate-200' : 'text-slate-200 cursor-not-allowed'} transition-colors`}>
                             <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 3: Tasks & Financials */}
          <div className={`${activeTab === 3 ? 'block' : 'hidden'} print:block space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            {/* Section 5: Task Status */}
            <div className="bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2 tracking-widest">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  5. Major Task / Milestone Status
                </h2>
                <button onClick={addTask} className="text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1 uppercase bg-amber-400 hover:bg-amber-300 px-3 py-1.5 transition-colors shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      <th className="py-3 px-6 font-bold w-5/12">Milestone / Task Name</th>
                      <th className="py-3 px-4 font-bold w-3/12">Status</th>
                      <th className="py-3 px-4 font-bold w-3/12">Progress (%)</th>
                      <th className="py-3 px-4 font-bold w-1/12 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50 text-sm transition-colors group">
                        <td className="py-3 px-6 border-l-2 border-transparent group-hover:border-amber-400">
                          <input type="text" value={task.name} onChange={(e) => updateTask(task.id, 'name', e.target.value)} className="w-full p-2 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-colors" placeholder="Task description" />
                        </td>
                        <td className="py-3 px-4">
                          <select value={task.status} onChange={(e) => updateTask(task.id, 'status', e.target.value)} className="w-full p-2 bg-transparent border border-transparent hover:border-slate-200 focus:border-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 transition-colors font-medium">
                            <option>Not Started</option>
                            <option>In Progress</option>
                            <option>Delayed</option>
                            <option>Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <input type="range" min="0" max="100" value={task.progress} onChange={(e) => updateTask(task.id, 'progress', parseInt(e.target.value))} className="w-full accent-slate-800 h-1.5 bg-slate-200 rounded-full cursor-pointer hover:accent-amber-500 transition-all" />
                            <span className="font-mono text-xs font-bold text-slate-600 w-8 text-right bg-slate-100 py-1 px-1">{task.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                           <button onClick={() => removeTask(task.id)} className="text-slate-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 inline-block" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 6: Financials */}
            <div className="bg-white border border-slate-200 shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   <DollarSign className="w-4 h-4 text-slate-400" />
                   6. Financial Overview
                 </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5"><DollarSign className="w-24 h-24" /></div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest relative z-10">Allocated Budget</label>
                    <div className="relative mt-2 z-10 flex items-center">
                      <span className="text-slate-400 font-bold mr-2 text-lg">$</span>
                      <input type="text" name="financials.budget" value={formData.financials.budget} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-slate-300 focus:border-slate-900 focus:outline-none font-mono text-xl text-slate-800 transition-colors p-1" placeholder="10,000,000" />
                    </div>
                 </div>
                 <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5"><Activity className="w-24 h-24" /></div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest relative z-10">Actual Spend</label>
                    <div className="relative mt-2 z-10 flex items-center">
                      <span className="text-amber-500 font-bold mr-2 text-lg">$</span>
                      <input type="text" name="financials.actual" value={formData.financials.actual} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none font-mono text-xl text-amber-700 transition-colors p-1" placeholder="4,500,000" />
                    </div>
                 </div>
                 <div className="space-y-1 bg-slate-50 p-4 border border-slate-200 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5"><TrendingUp className="w-24 h-24" /></div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest relative z-10">Forecast at Completion</label>
                    <div className="relative mt-2 z-10 flex items-center">
                      <span className="text-slate-400 font-bold mr-2 text-lg">$</span>
                      <input type="text" name="financials.forecast" value={formData.financials.forecast} onChange={handleInputChange} className="w-full bg-transparent border-b-2 border-slate-300 focus:border-slate-900 focus:outline-none font-mono text-xl text-slate-800 transition-colors p-1" placeholder="10,250,000" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Page 4: Analysis & Media */}
          <div className={`${activeTab === 4 ? 'block' : 'hidden'} print:block space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            
            {/* Section 7: Strategic Impact Analysis */}
            <div className="bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Decorative graphic */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 opacity-5 rounded-bl-full pointer-events-none"></div>
              
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 relative z-10">
                <h2 className="text-sm font-bold uppercase text-slate-700 tracking-widest flex items-center gap-2">
                   <Activity className="w-4 h-4 text-slate-400" />
                   7. Strategic Impact Analysis
                </h2>
                <p className="text-xs text-slate-500 mt-1">Please answer thoughtfully to help stakeholders understand operational realities.</p>
              </div>
              <div className="p-6 space-y-8 relative z-10">
                <div className="space-y-3">
                  <label className="block text-[13px] font-medium text-slate-700 leading-tight">
                    <span className="font-bold text-slate-500 mr-2">A.</span>
                    What were the primary operational bottlenecks encountered, and how did they impact the critical path?
                  </label>
                  <textarea
                    name="qBottlenecks"
                    value={formData.qBottlenecks}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border p-4 text-sm bg-slate-50 border-slate-300 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 resize-y transition-colors leading-relaxed placeholder:text-slate-400"
                    placeholder="Manager's critical assessment..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[13px] font-medium text-slate-700 leading-tight">
                    <span className="font-bold text-slate-500 mr-2">B.</span>
                    Detail resource allocation efficiency. Were there any shortages or supply chain disruptions?
                  </label>
                  <textarea
                    name="qResourceAllocation"
                    value={formData.qResourceAllocation}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border p-4 text-sm bg-slate-50 border-slate-300 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 resize-y transition-colors leading-relaxed placeholder:text-slate-400"
                    placeholder="e.g. Unavailability of specialized 316L stainless piping..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[13px] font-medium text-slate-700 leading-tight">
                    <span className="font-bold text-slate-500 mr-2">C.</span>
                    Are there any emerging risks? Explain mitigation strategies.
                  </label>
                  <textarea
                    name="qEmergingRisks"
                    value={formData.qEmergingRisks}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border p-4 text-sm bg-slate-50 border-slate-300 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-900 resize-y transition-colors leading-relaxed placeholder:text-slate-400"
                    placeholder="e.g. Upcoming monsoon season poses a risk to earthworks..."
                  />
                </div>
              </div>
            </div>

            {/* Section 8: Photo Evidence */}
            <div className="bg-white border border-slate-200 shadow-sm print:hidden"> {/* Hidden on print to save ink if needed, or allow it depending on requirements. Standard is often hide UI for images unless important. We leave title at least. */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   <Camera className="w-4 h-4 text-slate-400" />
                   8. Site Visual Evidence
                 </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="aspect-square bg-slate-100 flex flex-col items-center justify-center border border-slate-200 relative overflow-hidden group shadow-sm">
                      <img src={photo.url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removePhoto(idx)}
                        className="absolute inset-0 bg-slate-900/60 text-white font-bold text-xs hidden group-hover:flex items-center justify-center transition-all cursor-pointer"
                      >
                        REMOVE PHOTO
                      </button>
                    </div>
                  ))}
                  <div 
                    className="aspect-square bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden cursor-pointer hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600 text-slate-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center p-2 flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-slate-500" /></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add Photo</span>
                    </div>
                  </div>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
                <p className="text-[11px] text-slate-500 italic p-3 bg-slate-50 border border-slate-100 inline-block">Attach site condition photos, incident visual data, or achievement proof. Approved formats: JPG, PNG, WEBP.</p>
              </div>
            </div>
              
            {/* Action Bar (Only visible on last tab or print hidden) */}
            <div className="bg-slate-100 p-6 flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-300 print:hidden mt-8 shadow-inner">
              <button 
                onClick={exportData}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                <Download className="w-4 h-4" /> Export JSON
              </button>
              <button 
                onClick={() => window.print()}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <Save className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer / Pagination Controls Print Hidden */}
      <footer className="bg-white border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-center shrink-0 print:hidden z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex w-full sm:w-auto h-16">
            <button 
               onClick={() => setActiveTab(prev => Math.max(1, prev - 1))}
               disabled={activeTab === 1}
               className={`flex-1 sm:flex-none px-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors border-r border-slate-200 ${activeTab === 1 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
            >
               <ChevronLeft className="w-4 h-4" /> PREV
            </button>
            <div className="px-8 flex items-center justify-center bg-slate-50 text-xs font-bold text-slate-500 tracking-widest border-r border-slate-200 h-full">
               <span className="text-slate-800 mr-1">{activeTab}</span> / {totalTabs}
            </div>
            <button 
               onClick={() => setActiveTab(prev => Math.min(totalTabs, prev + 1))}
               disabled={activeTab === totalTabs}
               className={`flex-1 sm:flex-none px-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors border-r border-slate-200 ${activeTab === totalTabs ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800'}`}
            >
               NEXT <ChevronRight className="w-4 h-4" />
            </button>
         </div>
         <div className="hidden md:flex gap-6 pr-6 items-center flex-1 justify-end h-16">
            <div className="text-[10px] text-slate-400 font-mono">ISO 9001:2015 COMPLIANT</div>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="text-[10px] text-slate-400 font-mono">STATUS: <span className="text-emerald-500 font-bold ml-1 flex items-center gap-1 inline-flex"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> ONLINE</span></div>
         </div>
      </footer>

      {/* Print-only CSS helpers */}
      <style>{`
        @media print {
          body, html { background: white; height: auto !important; overflow: visible !important; }
          .bg-slate-100 { background: white !important; height: auto !important; overflow: visible !important; }
          main { margin-top: 0; padding: 0 !important; max-width: 100% !important; display: block; overflow: visible !important; height: auto !important;}
          .shadow-sm, .shadow-md, .shadow-lg, .shadow-inner { box-shadow: none !important; }
          select { appearance: none; -webkit-appearance: none; background: transparent; }
          input, textarea, select { border: 1px solid #e2e8f0; resize: none; background: transparent !important; color: #000 !important; }
          .bg-slate-800, .bg-slate-900, .bg-slate-950, .bg-slate-800\\/80 { background: white !important; color: black !important; border: 1px solid #cbd5e1 !important;}
          .text-white, .text-slate-300, .text-slate-400, .text-amber-100, .text-amber-100\\/90 { color: black !important; }
          .text-amber-400, .text-amber-500 { color: #000 !important; font-weight: bold; }
          header { position: relative; border-bottom: 2px solid #000; padding: 0 !important; margin-bottom: 20px;}
          .print\\:block { display: block !important; }
          .print\\:hidden { display: none !important; }
          .min-w-max { min-width: 100% !important; }
          
          /* Add page breaks between main sections */
          main > div > div { page-break-after: always; padding-top: 20px; border: none !important;}
          main > div > div:last-child { page-break-after: avoid; }
          
          /* Prevent breaks inside components */
          .bg-white { break-inside: avoid; margin-bottom: 20px; border: none !important; }
        }
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
