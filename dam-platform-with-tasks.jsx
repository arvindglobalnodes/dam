import React, { useState, useEffect } from 'react';

// ============================================
// ICONS
// ============================================
const Icons = {
  Building: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  Folder: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  GitBranch: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>,
  Rocket: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Circle: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>,
  Save: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Image: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Video: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Database: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Server: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  Zap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Type: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  AlignLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>,
  List: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Grip: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  ClipboardList: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6M9 16h6"/></svg>,
  CheckCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Play: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Target: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  RotateCcw: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  ExternalLink: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ============================================
// GLOBAL STYLES
// ============================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: #0B0D11; color: #fff; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .fade-in { animation: fadeIn 0.3s ease-out; }
  .slide-in { animation: slideIn 0.3s ease-out; }
  input:focus, textarea:focus, select:focus { outline: none; border-color: rgba(59,130,246,0.5) !important; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
`;

// ============================================
// STYLE OBJECTS
// ============================================
const btn = {
  primary: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#3B82F6', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' },
  secondary: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'10px 16px', background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', fontSize:'14px', fontWeight:'500', cursor:'pointer' },
  ghost: { display:'inline-flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'transparent', color:'rgba(255,255,255,0.6)', border:'none', borderRadius:'8px', fontSize:'13px', cursor:'pointer' },
  success: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'10px 20px', background:'#10B981', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:'600', cursor:'pointer' },
  danger: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'8px 16px', background:'rgba(239,68,68,0.1)', color:'#EF4444', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', fontSize:'13px', cursor:'pointer' },
};
const input = { width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', color:'#fff', fontSize:'14px' };
const label = { display:'block', fontSize:'13px', fontWeight:'500', color:'rgba(255,255,255,0.7)', marginBottom:'8px' };
const card = { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px' };

// Component types for forms
const componentTypes = [
  { type: 'text', label: 'Text Input', icon: Icons.Type },
  { type: 'textarea', label: 'Text Area', icon: Icons.AlignLeft },
  { type: 'checklist', label: 'Checklist', icon: Icons.List },
  { type: 'file', label: 'File Upload', icon: Icons.Upload },
  { type: 'image', label: 'Image Upload', icon: Icons.Image },
  { type: 'select', label: 'Dropdown', icon: Icons.ChevronDown },
  { type: 'user', label: 'User Picker', icon: Icons.User },
  { type: 'date', label: 'Date Picker', icon: Icons.Calendar },
];

const stateColors = ['#6B7280', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'];

// ============================================
// MAIN APP COMPONENT
// ============================================
const DAMPlatform = () => {
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [tenantData, setTenantData] = useState({ name: '', domain: '', primaryColor: '#3B82F6', logo: null });
  
  const [assetTypes, setAssetTypes] = useState([
    { id: '1', name: 'Campaign Image', icon: 'image', fields: 8 },
    { id: '2', name: 'Product Photo', icon: 'image', fields: 12 },
    { id: '3', name: 'Brand Video', icon: 'video', fields: 6 },
  ]);
  
  const [workflows, setWorkflows] = useState([{
    id: '1', 
    name: 'Design Review Workflow',
    states: [
      { id: 'draft', name: 'Draft', type: 'initial', color: '#6B7280', order: 0 },
      { id: 'in_progress', name: 'In Progress', type: 'intermediate', color: '#3B82F6', order: 1 },
      { id: 'review', name: 'Review', type: 'intermediate', color: '#F59E0B', order: 2 },
      { id: 'approved', name: 'Approved', type: 'terminal', color: '#10B981', order: 3 },
      { id: 'rejected', name: 'Rejected', type: 'terminal', color: '#EF4444', order: 3 },
    ],
    actions: [
      { 
        id: 'a1', name: 'Start Work', fromState: 'draft', toState: 'in_progress', 
        buttonColor: '#3B82F6', components: [], hasTasks: true, 
        tasks: [
          { id: 't1', name: 'Setup Project', description: 'Create folder structure', components: [{ id: 'tc1', type: 'checklist', label: 'Setup Steps', required: true, items: ['Create folders', 'Import assets'] }], onComplete: 'continue', onCompleteTarget: null },
          { id: 't2', name: 'Review Brief', description: 'Read requirements', components: [{ id: 'tc2', type: 'textarea', label: 'Notes', required: false }], onComplete: 'continue', onCompleteTarget: null }
        ]
      },
      { id: 'a2', name: 'Submit for Review', fromState: 'in_progress', toState: 'review', buttonColor: '#F59E0B', components: [{ id: 'c1', type: 'file', label: 'Design Files', required: true }], hasTasks: false, tasks: [] },
      { id: 'a3', name: 'Approve', fromState: 'review', toState: 'approved', buttonColor: '#10B981', components: [{ id: 'c2', type: 'checklist', label: 'Checklist', required: true, items: ['Logo OK', 'Colors OK'] }], hasTasks: false, tasks: [] },
      { id: 'a4', name: 'Reject', fromState: 'review', toState: 'rejected', buttonColor: '#EF4444', components: [{ id: 'c3', type: 'textarea', label: 'Reason', required: true }], hasTasks: false, tasks: [] },
      { 
        id: 'a5', name: 'Request Changes', fromState: 'review', toState: 'in_progress', 
        buttonColor: '#8B5CF6', components: [{ id: 'c5', type: 'textarea', label: 'Changes', required: true }], 
        hasTasks: true, 
        tasks: [{ id: 't3', name: 'Review Feedback', description: 'Check all feedback', components: [{ id: 'tc3', type: 'checklist', label: 'Items', required: true, items: ['Read comments', 'Identify changes'] }], onComplete: 'continue', onCompleteTarget: null }]
      },
      { id: 'a6', name: 'Quick Approve', fromState: 'draft', toState: 'approved', buttonColor: '#10B981', components: [], hasTasks: false, tasks: [] },
    ],
    assetTypes: ['Campaign Image', 'Product Photo']
  }]);

  const handleSaveWorkflow = (workflow) => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w => w.id === workflow.id ? workflow : w));
    } else {
      setWorkflows([...workflows, { ...workflow, id: `wf_${Date.now()}` }]);
    }
    setShowWorkflowBuilder(false);
    setEditingWorkflow(null);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: '100vh', background: '#0B0D11' }}>
        {/* Background gradients */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
          {tenantData.primaryColor && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${tenantData.primaryColor}15 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(80px)' }} />}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {showPreview ? (
            <WorkflowPreview 
              workflow={editingWorkflow} 
              onClose={() => setShowPreview(false)} 
            />
          ) : showWorkflowBuilder ? (
            <WorkflowBuilder 
              workflow={editingWorkflow} 
              onClose={() => { setShowWorkflowBuilder(false); setEditingWorkflow(null); }}
              onSave={handleSaveWorkflow}
              onPreview={() => setShowPreview(true)}
            />
          ) : (
            <TenantOnboarding 
              tenantData={tenantData} 
              setTenantData={setTenantData}
              assetTypes={assetTypes} 
              setAssetTypes={setAssetTypes}
              workflows={workflows}
              onEditWorkflow={(w) => { setEditingWorkflow(w); setShowWorkflowBuilder(true); }}
              onCreateWorkflow={() => { setEditingWorkflow(null); setShowWorkflowBuilder(true); }}
            />
          )}
        </div>
      </div>
    </>
  );
};

// ============================================
// TENANT ONBOARDING (Create Brand Wizard)
// ============================================
const TenantOnboarding = ({ tenantData, setTenantData, assetTypes, setAssetTypes, workflows, onEditWorkflow, onCreateWorkflow }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState('idle');
  const [deploymentProgress, setDeploymentProgress] = useState([]);

  const steps = [
    { id: 'tenant', label: 'Create Brand', icon: Icons.Building, desc: 'Basic info' },
    { id: 'assets', label: 'Asset Types', icon: Icons.Folder, desc: 'Categories' },
    { id: 'workflows', label: 'Workflows', icon: Icons.GitBranch, desc: 'Approval flows' },
    { id: 'deploy', label: 'Deploy', icon: Icons.Rocket, desc: 'Launch' },
  ];

  const deploySteps = [
    { id: 'tenant', label: 'Creating tenant record', icon: Icons.Building },
    { id: 'db', label: 'Provisioning database', icon: Icons.Database },
    { id: 's3', label: 'Setting up storage', icon: Icons.Server },
    { id: 'app', label: 'Deploying application', icon: Icons.Rocket },
    { id: 'dns', label: 'Configuring DNS & SSL', icon: Icons.Globe },
  ];

  const handleDeploy = () => {
    setDeploymentStatus('deploying');
    setDeploymentProgress([]);
    deploySteps.forEach((step, i) => {
      setTimeout(() => {
        setDeploymentProgress(prev => [...prev, step.id]);
        if (i === deploySteps.length - 1) setTimeout(() => setDeploymentStatus('complete'), 500);
      }, (i + 1) * 700);
    });
  };

  const addAssetType = () => {
    setAssetTypes([...assetTypes, { id: `at_${Date.now()}`, name: 'New Asset Type', icon: 'image', fields: 0 }]);
  };

  return (
    <div style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="fade-in">
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>Create New Brand Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Set up a fully isolated DAM environment for your client</p>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isComplete = i < currentStep;
            return (
              <React.Fragment key={step.id}>
                <button 
                  onClick={() => i <= currentStep && setCurrentStep(i)} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', 
                    background: isActive ? 'rgba(255,255,255,0.08)' : isComplete ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', 
                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.15)' : isComplete ? 'rgba(16,185,129,0.2)' : 'transparent'}`, 
                    borderRadius: '12px', 
                    cursor: i <= currentStep ? 'pointer' : 'default', 
                    opacity: i > currentStep ? 0.4 : 1 
                  }}
                >
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    background: isComplete ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', 
                    color: isComplete ? '#10B981' : isActive ? '#fff' : 'rgba(255,255,255,0.4)' 
                  }}>
                    {isComplete ? <Icons.Check /> : <Icon />}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: isComplete ? '#10B981' : isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>{step.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{step.desc}</div>
                  </div>
                </button>
                {i < steps.length - 1 && <div style={{ color: 'rgba(255,255,255,0.2)', alignSelf: 'center' }}><Icons.ChevronRight /></div>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Content Card */}
        <div style={{ ...card, padding: '32px' }} className="fade-in">
          
          {/* Step 0: Brand Info */}
          {currentStep === 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Brand Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={label}>Company Name *</label>
                  <input 
                    type="text" 
                    value={tenantData.name} 
                    onChange={(e) => setTenantData({...tenantData, name: e.target.value})} 
                    placeholder="e.g., Coca-Cola" 
                    style={input} 
                  />
                </div>
                <div>
                  <label style={label}>Portal Domain *</label>
                  <div style={{ display: 'flex' }}>
                    <input 
                      type="text" 
                      value={tenantData.domain} 
                      onChange={(e) => setTenantData({...tenantData, domain: e.target.value})} 
                      placeholder="subdomain" 
                      style={{ ...input, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }} 
                    />
                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>.dam.com</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={label}>Brand Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="color" 
                      value={tenantData.primaryColor} 
                      onChange={(e) => setTenantData({...tenantData, primaryColor: e.target.value})} 
                      style={{ width: '48px', height: '48px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent', padding: 0 }} 
                    />
                    <input 
                      type="text" 
                      value={tenantData.primaryColor} 
                      onChange={(e) => setTenantData({...tenantData, primaryColor: e.target.value})} 
                      style={{ ...input, flex: 1, fontFamily: 'monospace' }} 
                    />
                  </div>
                </div>
                <div>
                  <label style={label}>Logo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: `${tenantData.primaryColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}><Icons.Upload /></div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Upload logo</span>
                  </div>
                </div>
              </div>
              {/* Preview */}
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Portal Preview</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: tenantData.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#fff', boxShadow: `0 8px 24px ${tenantData.primaryColor}40` }}>
                    {tenantData.name ? tenantData.name[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{tenantData.name || 'Company Name'}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>https://{tenantData.domain || 'subdomain'}.dam.com</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Asset Types */}
          {currentStep === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Define Asset Types</h2>
                <button onClick={addAssetType} style={btn.secondary}><Icons.Plus /> Add Asset Type</button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>Each asset type has its own metadata schema and workflow.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assetTypes.map((type) => (
                  <div key={type.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                        {type.icon === 'video' ? <Icons.Video /> : <Icons.Image />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>{type.name}</div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{type.fields} custom fields</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ ...btn.ghost, padding: '8px' }}><Icons.Edit /></button>
                      <button style={{ ...btn.ghost, padding: '8px', color: '#EF4444' }}><Icons.Trash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Workflows */}
          {currentStep === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Configure Workflows</h2>
                <button onClick={onCreateWorkflow} style={btn.secondary}><Icons.Plus /> Create Workflow</button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>Define states, actions, tasks, and UI components for each workflow.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {workflows.map((workflow) => {
                  const totalTasks = workflow.actions?.reduce((s, a) => s + (a.tasks?.length || 0), 0) || 0;
                  return (
                    <div key={workflow.id} style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}><Icons.GitBranch /></div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '17px', marginBottom: '4px' }}>{workflow.name}</div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                              {workflow.states?.length || 0} states • {workflow.actions?.length || 0} actions
                              {totalTasks > 0 && <span style={{ color: '#EC4899' }}> • {totalTasks} tasks</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => onEditWorkflow(workflow)} style={btn.secondary}><Icons.Edit /> Edit</button>
                      </div>
                      {/* States Visual */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {workflow.states?.map((state, i) => (
                          <React.Fragment key={state.id}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: state.color, boxShadow: `0 0 6px ${state.color}60` }} />
                              <span style={{ fontSize: '13px' }}>{state.name}</span>
                            </div>
                            {i < workflow.states.length - 1 && <Icons.ArrowRight />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <button onClick={onCreateWorkflow} style={{ padding: '28px', background: 'transparent', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '14px', color: 'rgba(255,255,255,0.4)', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                  <Icons.Plus /> Create New Workflow
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Deploy */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Deploy Your Portal</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px' }}>Launch {tenantData.name || 'your'} DAM portal to production.</p>
              
              {deploymentStatus === 'idle' && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '20px', background: `linear-gradient(135deg, ${tenantData.primaryColor}40, rgba(139,92,246,0.2))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icons.Rocket />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Ready to Launch</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Your portal will be live at https://{tenantData.domain || 'subdomain'}.dam.com</p>
                  <button onClick={handleDeploy} style={{ ...btn.primary, background: tenantData.primaryColor, padding: '14px 32px', fontSize: '16px' }}>
                    <Icons.Rocket /> Deploy Now
                  </button>
                </div>
              )}

              {deploymentStatus === 'deploying' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {deploySteps.map((step) => {
                    const Icon = step.icon;
                    const isComplete = deploymentProgress.includes(step.id);
                    const isActive = !isComplete && deploymentProgress.length === deploySteps.findIndex(s => s.id === step.id);
                    return (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: isComplete ? 'rgba(16,185,129,0.1)' : isActive ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: `1px solid ${isComplete ? 'rgba(16,185,129,0.2)' : isActive ? 'rgba(59,130,246,0.2)' : 'transparent'}` }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isComplete ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isComplete ? '#10B981' : isActive ? '#3B82F6' : 'rgba(255,255,255,0.4)' }}>
                          {isComplete ? <Icons.Check /> : <Icon />}
                        </div>
                        <span style={{ fontWeight: '500', color: isComplete ? '#10B981' : isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {deploymentStatus === 'complete' && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '20px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                    <Icons.CheckCircle />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#10B981' }}>Portal Deployed!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Your DAM portal is now live</p>
                  <a href={`https://${tenantData.domain || 'demo'}.dam.com`} target="_blank" rel="noopener noreferrer" style={{ ...btn.success, textDecoration: 'none', display: 'inline-flex' }}>
                    <Icons.ExternalLink /> Visit Portal
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} style={{ ...btn.secondary, opacity: currentStep === 0 ? 0.3 : 1 }}>
            <Icons.ChevronLeft /> Back
          </button>
          {currentStep < 3 && (
            <button onClick={() => setCurrentStep(currentStep + 1)} style={btn.primary}>
              Next <Icons.ChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// WORKFLOW BUILDER (with Tasks)
// ============================================
const WorkflowBuilder = ({ workflow, onClose, onSave, onPreview }) => {
  const [activeTab, setActiveTab] = useState('states');
  const [workflowName, setWorkflowName] = useState(workflow?.name || 'New Workflow');
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [statePositions, setStatePositions] = useState({});
  
  const [states, setStates] = useState(workflow?.states || [
    { id: 'draft', name: 'Draft', type: 'initial', color: '#6B7280', order: 0 },
    { id: 'in_progress', name: 'In Progress', type: 'intermediate', color: '#3B82F6', order: 1 },
    { id: 'review', name: 'Review', type: 'intermediate', color: '#F59E0B', order: 2 },
    { id: 'approved', name: 'Approved', type: 'terminal', color: '#10B981', order: 3 },
    { id: 'rejected', name: 'Rejected', type: 'terminal', color: '#EF4444', order: 3 },
  ]);
  const [actions, setActions] = useState(workflow?.actions || []);

  const selectedState = states.find(s => s.id === selectedStateId);
  const selectedAction = actions.find(a => a.id === selectedActionId);
  const selectedTask = selectedAction?.tasks?.find(t => t.id === selectedTaskId);

  // Calculate state positions for visual canvas
  useEffect(() => {
    const pos = {};
    const sorted = [...states].sort((a, b) => a.order - b.order);
    const cx = 400;
    let y = 60;
    sorted.forEach((s, i) => {
      if (s.type === 'terminal') {
        const terms = sorted.filter(st => st.type === 'terminal');
        const idx = terms.findIndex(st => st.id === s.id);
        pos[s.id] = { x: cx - 100 + idx * 200, y };
      } else {
        pos[s.id] = { x: cx, y };
        if (sorted[i + 1] && sorted[i + 1].type !== 'terminal') y += 150;
        else if (sorted[i + 1]) y += 170;
      }
    });
    setStatePositions(pos);
  }, [states]);

  // State CRUD
  const addState = () => { 
    const s = { id: `s_${Date.now()}`, name: 'New State', type: 'intermediate', color: '#8B5CF6', order: Math.max(...states.map(x => x.order), -1) }; 
    setStates([...states, s]); 
    setSelectedStateId(s.id); 
  };
  const updateState = (id, u) => setStates(states.map(s => s.id === id ? { ...s, ...u } : s));
  const deleteState = (id) => { 
    setStates(states.filter(s => s.id !== id)); 
    setActions(actions.filter(a => a.fromState !== id && a.toState !== id)); 
    if (selectedStateId === id) setSelectedStateId(null); 
  };

  // Action CRUD
  const addAction = (from) => { 
    const a = { id: `a_${Date.now()}`, name: 'New Action', fromState: from || states[0]?.id, toState: states.find(s => s.id !== from)?.id || from, buttonColor: '#3B82F6', components: [], hasTasks: false, tasks: [] }; 
    setActions([...actions, a]); 
    setSelectedActionId(a.id); 
    setSelectedTaskId(null); 
    setActiveTab('actions'); 
  };
  const updateAction = (id, u) => setActions(actions.map(a => a.id === id ? { ...a, ...u } : a));
  const deleteAction = (id) => { 
    setActions(actions.filter(a => a.id !== id)); 
    if (selectedActionId === id) { setSelectedActionId(null); setSelectedTaskId(null); } 
  };

  // Component CRUD (for actions)
  const addComp = (aid, type) => { 
    const c = { id: `c_${Date.now()}`, type, label: componentTypes.find(x => x.type === type)?.label || 'Field', required: false, items: type === 'checklist' ? ['Item 1'] : undefined }; 
    setActions(actions.map(a => a.id === aid ? { ...a, components: [...a.components, c] } : a)); 
  };
  const updateComp = (aid, cid, u) => setActions(actions.map(a => a.id === aid ? { ...a, components: a.components.map(c => c.id === cid ? { ...c, ...u } : c) } : a));
  const deleteComp = (aid, cid) => setActions(actions.map(a => a.id === aid ? { ...a, components: a.components.filter(c => c.id !== cid) } : a));

  // Task CRUD
  const addTask = (aid) => { 
    const t = { id: `t_${Date.now()}`, name: 'New Task', description: '', components: [], onComplete: 'continue', onCompleteTarget: null }; 
    setActions(actions.map(a => a.id === aid ? { ...a, tasks: [...(a.tasks || []), t] } : a)); 
    setSelectedTaskId(t.id); 
  };
  const updateTask = (aid, tid, u) => setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, ...u } : t) } : a));
  const deleteTask = (aid, tid) => { 
    setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.filter(t => t.id !== tid) } : a)); 
    if (selectedTaskId === tid) setSelectedTaskId(null); 
  };

  // Task Component CRUD
  const addTaskComp = (aid, tid, type) => { 
    const c = { id: `tc_${Date.now()}`, type, label: componentTypes.find(x => x.type === type)?.label || 'Field', required: false, items: type === 'checklist' ? ['Item 1'] : undefined }; 
    setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, components: [...t.components, c] } : t) } : a)); 
  };
  const updateTaskComp = (aid, tid, cid, u) => setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, components: t.components.map(c => c.id === cid ? { ...c, ...u } : c) } : t) } : a));
  const deleteTaskComp = (aid, tid, cid) => setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, components: t.components.filter(c => c.id !== cid) } : t) } : a));

  const getConnType = (from, to) => { 
    if (!from || !to) return 'forward'; 
    if (to.order < from.order) return 'backward'; 
    if (to.order - from.order > 1) return 'skip'; 
    if (to.type === 'terminal') return 'terminal'; 
    return 'forward'; 
  };

  const handleSave = () => {
    onSave({ id: workflow?.id, name: workflowName, states, actions, assetTypes: workflow?.assetTypes || [] });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onClose} style={btn.ghost}><Icons.ChevronLeft /></button>
          <div>
            <input type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} style={{ background: 'transparent', border: 'none', fontSize: '18px', fontWeight: '600', color: '#fff', width: '300px' }} />
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{states.length} states • {actions.length} actions • {actions.reduce((s, a) => s + (a.tasks?.length || 0), 0)} tasks</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onPreview} style={btn.secondary}><Icons.Play /> Preview</button>
          <button style={btn.success} onClick={handleSave}><Icons.Save /> Save</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Left Panel - States/Actions List */}
        <div style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {[{ id: 'states', label: 'States', icon: Icons.Circle }, { id: 'actions', label: 'Actions', icon: Icons.Zap }].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedTaskId(null); }} style={{ flex: 1, padding: '12px', background: activeTab === tab.id ? 'rgba(255,255,255,0.04)' : 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #3B82F6' : '2px solid transparent', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><tab.icon /> {tab.label}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
            {activeTab === 'states' && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>States</span>
                  <button onClick={addState} style={{ ...btn.ghost, padding: '4px 8px', fontSize: '11px' }}><Icons.Plus /></button>
                </div>
                {[...states].sort((a, b) => a.order - b.order).map(s => (
                  <div key={s.id} onClick={() => { setSelectedStateId(s.id); setSelectedActionId(null); setSelectedTaskId(null); }} style={{ padding: '12px', marginBottom: '6px', background: selectedStateId === s.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedStateId === s.id ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                      <div><div style={{ fontWeight: '500', fontSize: '13px' }}>{s.name}</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{s.type}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'actions' && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Actions</span>
                  <button onClick={() => addAction(states[0]?.id)} style={{ ...btn.ghost, padding: '4px 8px', fontSize: '11px' }}><Icons.Plus /></button>
                </div>
                {actions.map(a => {
                  const from = states.find(s => s.id === a.fromState);
                  const to = states.find(s => s.id === a.toState);
                  const ct = getConnType(from, to);
                  return (
                    <div key={a.id} onClick={() => { setSelectedActionId(a.id); setSelectedStateId(null); setSelectedTaskId(null); }} style={{ padding: '12px', marginBottom: '6px', background: selectedActionId === a.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedActionId === a.id ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: a.buttonColor }} />
                        <span style={{ fontWeight: '500', fontSize: '13px', flex: 1 }}>{a.name}</span>
                        {a.tasks?.length > 0 && <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(236,72,153,0.2)', color: '#EC4899', borderRadius: '4px' }}>{a.tasks.length} tasks</span>}
                        {ct === 'skip' && <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(236,72,153,0.2)', color: '#EC4899', borderRadius: '4px' }}>SKIP</span>}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}><span style={{ color: from?.color }}>{from?.name}</span> → <span style={{ color: to?.color }}>{to?.name}</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Canvas - Visual Workflow */}
        <div style={{ flex: 1, position: 'relative', background: 'rgba(0,0,0,0.2)', overflow: 'auto' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arr-b" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" /></marker>
              <marker id="arr-p" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" /></marker>
              <marker id="arr-pk" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EC4899" /></marker>
              <marker id="arr-g" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#10B981" /></marker>
              <marker id="arr-r" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" /></marker>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="c" /><feMerge><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {actions.map(a => {
              const fp = statePositions[a.fromState], tp = statePositions[a.toState];
              const fs = states.find(s => s.id === a.fromState), ts = states.find(s => s.id === a.toState);
              if (!fp || !tp || !fs || !ts) return null;
              const ct = getConnType(fs, ts);
              const nw = 150, nh = 60;
              let d, sc = '#3B82F6', me = 'url(#arr-b)', sw = 2, f = '';
              if (ct === 'backward') { d = `M ${fp.x - nw / 2} ${fp.y + nh / 2} C ${fp.x - 120} ${fp.y + nh / 2}, ${tp.x - 120} ${tp.y + nh / 2}, ${tp.x - nw / 2} ${tp.y + nh / 2}`; sc = '#8B5CF6'; me = 'url(#arr-p)'; }
              else if (ct === 'skip') { d = `M ${fp.x + nw / 2} ${fp.y + nh / 2} C ${fp.x + 160} ${fp.y + nh / 2}, ${tp.x + 160} ${tp.y + nh / 2}, ${tp.x + nw / 2} ${tp.y + nh / 2}`; sc = '#EC4899'; me = 'url(#arr-pk)'; sw = 3; f = 'url(#glow)'; }
              else if (ct === 'terminal') { const ox = tp.x < fp.x ? -30 : 30; d = `M ${fp.x + ox} ${fp.y + nh - 5} Q ${fp.x + ox} ${(fp.y + tp.y + nh) / 2}, ${tp.x} ${tp.y + 5}`; sc = ts.color; me = ts.color === '#10B981' ? 'url(#arr-g)' : 'url(#arr-r)'; }
              else { d = `M ${fp.x} ${fp.y + nh - 5} L ${tp.x} ${tp.y + 5}`; }
              return (
                <g key={a.id}>
                  <path d={d} fill="none" stroke={sc} strokeWidth={sw} strokeOpacity={0.7} markerEnd={me} filter={f} />
                  {(ct === 'skip' || ct === 'backward') && <text x={ct === 'backward' ? fp.x - 90 : fp.x + 110} y={(fp.y + tp.y + nh) / 2} fill={sc} fontSize="10" fontWeight="500" textAnchor="middle">{a.name}</text>}
                  {a.tasks?.length > 0 && <><circle cx={ct === 'backward' ? fp.x - 70 : ct === 'skip' ? fp.x + 90 : fp.x + 20} cy={(fp.y + tp.y + nh) / 2 + (ct !== 'forward' ? 12 : -12)} r="8" fill="#EC4899" /><text x={ct === 'backward' ? fp.x - 70 : ct === 'skip' ? fp.x + 90 : fp.x + 20} y={(fp.y + tp.y + nh) / 2 + (ct !== 'forward' ? 16 : -8)} fill="#fff" fontSize="9" fontWeight="600" textAnchor="middle">{a.tasks.length}</text></>}
                </g>
              );
            })}
          </svg>
          <div style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
            {Object.keys(statePositions).length > 0 && states.map(s => {
              const p = statePositions[s.id];
              if (!p) return null;
              const sa = actions.filter(a => a.fromState === s.id);
              const tt = sa.reduce((x, a) => x + (a.tasks?.length || 0), 0);
              return (
                <div key={s.id} onClick={() => { setSelectedStateId(s.id); setSelectedActionId(null); setSelectedTaskId(null); }} style={{ position: 'absolute', left: p.x - 75, top: p.y, width: '150px', padding: '14px 16px', background: selectedStateId === s.id ? `${s.color}20` : 'rgba(20,20,25,0.9)', border: `2px solid ${selectedStateId === s.id ? s.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', cursor: 'pointer', textAlign: 'center', boxShadow: selectedStateId === s.id ? `0 0 20px ${s.color}40` : '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} /><span style={{ fontWeight: '600', fontSize: '14px' }}>{s.name}</span></div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{s.type === 'initial' ? '● Start' : s.type === 'terminal' ? '● End' : `${sa.length} actions`}{tt > 0 && <span style={{ color: '#EC4899' }}> • {tt} tasks</span>}</div>
                  {s.type !== 'terminal' && <button onClick={(e) => { e.stopPropagation(); addAction(s.id); }} style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '22px', height: '22px', borderRadius: '50%', background: '#3B82F6', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>+</button>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Config */}
        <div style={{ width: '380px', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
          {/* State Config */}
          {selectedState && !selectedAction && (
            <div className="slide-in">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedState.color }} /><span style={{ fontWeight: '600' }}>State Config</span></div>
                {selectedState.type !== 'initial' && <button onClick={() => deleteState(selectedState.id)} style={btn.danger}><Icons.Trash /></button>}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}><label style={label}>Name</label><input type="text" value={selectedState.name} onChange={(e) => updateState(selectedState.id, { name: e.target.value })} style={input} /></div>
                <div style={{ marginBottom: '16px' }}><label style={label}>Type</label><select value={selectedState.type} onChange={(e) => updateState(selectedState.id, { type: e.target.value })} style={input}><option value="initial">Initial</option><option value="intermediate">Intermediate</option><option value="terminal">Terminal</option></select></div>
                <div style={{ marginBottom: '16px' }}><label style={label}>Order</label><input type="number" value={selectedState.order} onChange={(e) => updateState(selectedState.id, { order: parseInt(e.target.value) || 0 })} style={input} min="0" /></div>
                <div><label style={label}>Color</label><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{stateColors.map(c => <button key={c} onClick={() => updateState(selectedState.id, { color: c })} style={{ width: '28px', height: '28px', borderRadius: '6px', background: c, border: selectedState.color === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer' }} />)}</div></div>
              </div>
            </div>
          )}

          {/* Action Config */}
          {selectedAction && !selectedTask && (
            <div className="slide-in">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: selectedAction.buttonColor }} /><span style={{ fontWeight: '600' }}>Action Config</span></div>
                <button onClick={() => deleteAction(selectedAction.id)} style={btn.danger}><Icons.Trash /></button>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}><label style={label}>Button Label</label><input type="text" value={selectedAction.name} onChange={(e) => updateAction(selectedAction.id, { name: e.target.value })} style={input} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div><label style={label}>From</label><select value={selectedAction.fromState} onChange={(e) => updateAction(selectedAction.id, { fromState: e.target.value })} style={input}>{states.filter(s => s.type !== 'terminal').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                  <div><label style={label}>To</label><select value={selectedAction.toState} onChange={(e) => updateAction(selectedAction.id, { toState: e.target.value })} style={input}>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                </div>
                <div style={{ marginBottom: '16px' }}><label style={label}>Color</label><input type="color" value={selectedAction.buttonColor} onChange={(e) => updateAction(selectedAction.id, { buttonColor: e.target.value })} style={{ ...input, padding: '4px', height: '40px', cursor: 'pointer' }} /></div>

                {/* Form Components */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ ...label, marginBottom: '12px' }}>Form Components</label>
                  <ComponentList comps={selectedAction.components} onUpdate={(cid, u) => updateComp(selectedAction.id, cid, u)} onDelete={(cid) => deleteComp(selectedAction.id, cid)} onAdd={(t) => addComp(selectedAction.id, t)} />
                </div>

                {/* Tasks Section */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div><label style={{ ...label, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.ClipboardList /> Tasks</label><p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Popup during transition</p></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1 }}><input type="checkbox" checked={selectedAction.hasTasks} onChange={(e) => updateAction(selectedAction.id, { hasTasks: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#EC4899' }} /><span style={{ fontSize: '13px', fontWeight: '500' }}>Has tasks</span></label>
                  </div>
                  {selectedAction.hasTasks && (
                    <>
                      {(selectedAction.tasks || []).map((t, i) => (
                        <div key={t.id} onClick={() => setSelectedTaskId(t.id)} style={{ padding: '12px', marginBottom: '8px', background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '10px', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899', fontSize: '12px', fontWeight: '600' }}>{i + 1}</div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: '500', fontSize: '13px' }}>{t.name}</div><div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{t.components.length} fields • {t.onComplete === 'continue' ? 'Continue' : 'Jump'}</div></div>
                            <Icons.ChevronRight />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addTask(selectedAction.id)} style={{ ...btn.secondary, width: '100%', justifyContent: 'center', background: 'rgba(236,72,153,0.1)', borderColor: 'rgba(236,72,153,0.3)', color: '#EC4899' }}><Icons.Plus /> Add Task</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Task Config */}
          {selectedAction && selectedTask && (
            <div className="slide-in">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(236,72,153,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><button onClick={() => setSelectedTaskId(null)} style={{ ...btn.ghost, padding: '4px' }}><Icons.ChevronLeft /></button><Icons.ClipboardList /><span style={{ fontWeight: '600' }}>Task Config</span></div>
                <button onClick={() => deleteTask(selectedAction.id, selectedTask.id)} style={btn.danger}><Icons.Trash /></button>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}><label style={label}>Task Name</label><input type="text" value={selectedTask.name} onChange={(e) => updateTask(selectedAction.id, selectedTask.id, { name: e.target.value })} style={input} /></div>
                <div style={{ marginBottom: '16px' }}><label style={label}>Description</label><textarea value={selectedTask.description} onChange={(e) => updateTask(selectedAction.id, selectedTask.id, { description: e.target.value })} style={{ ...input, minHeight: '80px', resize: 'vertical' }} placeholder="Describe what needs to be done..." /></div>
                
                {/* Task Form Components */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ ...label, marginBottom: '12px' }}>Task Form</label>
                  <ComponentList comps={selectedTask.components} onUpdate={(cid, u) => updateTaskComp(selectedAction.id, selectedTask.id, cid, u)} onDelete={(cid) => deleteTaskComp(selectedAction.id, selectedTask.id, cid)} onAdd={(t) => addTaskComp(selectedAction.id, selectedTask.id, t)} />
                </div>
                
                {/* After Completion */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ ...label, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Target /> After Completion</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: selectedTask.onComplete === 'continue' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedTask.onComplete === 'continue' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer' }}><input type="radio" name="oc" checked={selectedTask.onComplete === 'continue'} onChange={() => updateTask(selectedAction.id, selectedTask.id, { onComplete: 'continue', onCompleteTarget: null })} /><div><div style={{ fontWeight: '500', fontSize: '13px' }}>Continue</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Next task or state</div></div></label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: selectedTask.onComplete === 'goto_state' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedTask.onComplete === 'goto_state' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer' }}><input type="radio" name="oc" checked={selectedTask.onComplete === 'goto_state'} onChange={() => updateTask(selectedAction.id, selectedTask.id, { onComplete: 'goto_state' })} /><div style={{ flex: 1 }}><div style={{ fontWeight: '500', fontSize: '13px' }}>Go to State</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Jump to specific state</div></div></label>
                    {selectedTask.onComplete === 'goto_state' && <select value={selectedTask.onCompleteTarget || ''} onChange={(e) => updateTask(selectedAction.id, selectedTask.id, { onCompleteTarget: e.target.value })} style={{ ...input, marginLeft: '32px' }}><option value="">Select...</option>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: selectedTask.onComplete === 'goto_action' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedTask.onComplete === 'goto_action' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', cursor: 'pointer' }}><input type="radio" name="oc" checked={selectedTask.onComplete === 'goto_action'} onChange={() => updateTask(selectedAction.id, selectedTask.id, { onComplete: 'goto_action' })} /><div style={{ flex: 1 }}><div style={{ fontWeight: '500', fontSize: '13px' }}>Trigger Action</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Execute another action</div></div></label>
                    {selectedTask.onComplete === 'goto_action' && <select value={selectedTask.onCompleteTarget || ''} onChange={(e) => updateTask(selectedAction.id, selectedTask.id, { onCompleteTarget: e.target.value })} style={{ ...input, marginLeft: '32px' }}><option value="">Select...</option>{actions.filter(a => a.id !== selectedAction.id).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedState && !selectedAction && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px', textAlign: 'center' }}>Select a state or action</div>}
        </div>
      </div>
    </div>
  );
};
// ============================================
const ComponentList = ({ comps, onUpdate, onDelete, onAdd }) => (
  <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
      {comps.map(c => {
        const ct = componentTypes.find(x => x.type === c.type);
        const Ic = ct?.icon || Icons.Type;
        return (
          <div key={c.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icons.Grip />
              <Ic />
              <input type="text" value={c.label} onChange={(e) => onUpdate(c.id, { label: e.target.value })} style={{ ...input, flex: 1, padding: '6px 10px', fontSize: '12px' }} />
              <button onClick={() => onDelete(c.id)} style={{ ...btn.ghost, padding: '4px', color: '#EF4444' }}><Icons.X /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select value={c.type} onChange={(e) => onUpdate(c.id, { type: e.target.value })} style={{ ...input, flex: 1, padding: '6px', fontSize: '11px' }}>
                {componentTypes.map(x => <option key={x.type} value={x.type}>{x.label}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={c.required} onChange={(e) => onUpdate(c.id, { required: e.target.checked })} />Req
              </label>
            </div>
            {c.type === 'checklist' && (
              <input type="text" value={c.items?.join(', ')} onChange={(e) => onUpdate(c.id, { items: e.target.value.split(',').map(s => s.trim()) })} style={{ ...input, marginTop: '8px', padding: '6px', fontSize: '11px' }} placeholder="Item1, Item2" />
            )}
          </div>
        );
      })}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
      {componentTypes.map(x => {
        const Ic = x.icon;
        return (
          <button key={x.type} onClick={() => onAdd(x.type)} style={{ padding: '8px 4px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>
            <Ic />{x.label.split(' ')[0]}
          </button>
        );
      })}
    </div>
  </>
);

// ============================================
// WORKFLOW PREVIEW (with Task Execution)
// ============================================
const WorkflowPreview = ({ workflow, onClose }) => {
  const [currentState, setCurrentState] = useState(workflow?.states?.find(s => s.type === 'initial')?.id);
  const [showForm, setShowForm] = useState(null);
  const [showTask, setShowTask] = useState(null);
  const [taskIdx, setTaskIdx] = useState(0);
  const [log, setLog] = useState([{ type: 'start', msg: 'Workflow started', state: workflow?.states?.find(s => s.type === 'initial')?.name }]);

  const curr = workflow?.states?.find(s => s.id === currentState);
  const avail = workflow?.actions?.filter(a => a.fromState === currentState) || [];

  const doAction = (a) => {
    setShowForm(null);
    if (a.hasTasks && a.tasks?.length > 0) {
      setShowTask(a);
      setTaskIdx(0);
      setLog(p => [...p, { type: 'action', msg: `"${a.name}" started`, tasks: a.tasks.length }]);
    } else {
      finish(a);
    }
  };

  const finishTask = (t) => {
    setLog(p => [...p, { type: 'task', msg: `Task "${t.name}" done` }]);
    const a = showTask;
    if (taskIdx < a.tasks.length - 1) {
      setTaskIdx(taskIdx + 1);
    } else {
      setShowTask(null);
      if (t.onComplete === 'goto_state' && t.onCompleteTarget) {
        const ts = workflow.states.find(s => s.id === t.onCompleteTarget);
        setCurrentState(t.onCompleteTarget);
        setLog(p => [...p, { type: 'transition', msg: `Jumped to "${ts?.name}"`, state: ts?.name }]);
      } else if (t.onComplete === 'goto_action' && t.onCompleteTarget) {
        const ta = workflow.actions.find(x => x.id === t.onCompleteTarget);
        if (ta) { 
          if (ta.components?.length) setShowForm(ta); 
          else doAction(ta); 
        }
      } else {
        finish(a);
      }
    }
  };

  const finish = (a) => {
    const ts = workflow.states.find(s => s.id === a.toState);
    setCurrentState(a.toState);
    setLog(p => [...p, { type: 'transition', msg: `→ "${ts?.name}"`, state: ts?.name }]);
  };

  const reset = () => {
    const init = workflow?.states?.find(s => s.type === 'initial');
    setCurrentState(init?.id);
    setLog([{ type: 'start', msg: 'Workflow reset', state: init?.name }]);
    setShowForm(null);
    setShowTask(null);
    setTaskIdx(0);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onClose} style={btn.ghost}><Icons.ChevronLeft /></button>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>Preview: {workflow?.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Test workflow with tasks</div>
          </div>
        </div>
        <button onClick={reset} style={btn.secondary}><Icons.RotateCcw /> Reset</button>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* Main Preview Area */}
        <div style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Current State</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 32px', background: `${curr?.color}20`, border: `2px solid ${curr?.color}`, borderRadius: '16px', boxShadow: `0 0 30px ${curr?.color}30` }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: curr?.color, boxShadow: `0 0 12px ${curr?.color}` }} />
              <span style={{ fontSize: '24px', fontWeight: '700' }}>{curr?.name}</span>
            </div>
          </div>
          
          {curr?.type !== 'terminal' ? (
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Actions</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {avail.map(a => (
                  <button 
                    key={a.id} 
                    onClick={() => a.components?.length ? setShowForm(a) : doAction(a)} 
                    style={{ padding: '14px 24px', background: a.buttonColor, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 12px ${a.buttonColor}40` }}
                  >
                    {a.name}
                    {a.hasTasks && a.tasks?.length > 0 && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{a.tasks.length} tasks</span>}
                    <Icons.ArrowRight />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px', background: 'rgba(16,185,129,0.1)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
              <Icons.CheckCircle />
              <div style={{ fontSize: '18px', fontWeight: '600', marginTop: '8px', color: '#10B981' }}>Workflow Complete!</div>
            </div>
          )}
        </div>
        
        {/* Execution Log */}
        <div style={{ width: '320px', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '20px', overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Log</div>
          {log.map((l, i) => (
            <div key={i} style={{ padding: '10px 12px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `3px solid ${l.type === 'task' ? '#EC4899' : l.type === 'transition' ? '#10B981' : l.type === 'action' ? '#F59E0B' : '#3B82F6'}` }}>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>{l.msg}</div>
              {l.state && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>State: {l.state}</div>}
              {l.tasks && <div style={{ fontSize: '10px', color: '#EC4899', marginTop: '2px' }}>{l.tasks} tasks</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Action Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '480px', background: '#1a1a1f', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>{showForm.name}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Complete form to proceed</div>
            </div>
            <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {showForm.components.map(c => (
                <div key={c.id} style={{ marginBottom: '16px' }}>
                  <label style={label}>{c.label} {c.required && <span style={{ color: '#EF4444' }}>*</span>}</label>
                  {c.type === 'textarea' ? (
                    <textarea style={{ ...input, minHeight: '80px' }} placeholder={`Enter ${c.label.toLowerCase()}...`} />
                  ) : c.type === 'checklist' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {c.items?.map((it, i) => <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /><span style={{ fontSize: '13px' }}>{it}</span></label>)}
                    </div>
                  ) : c.type === 'file' || c.type === 'image' ? (
                    <div style={{ padding: '20px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '10px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      <Icons.Upload /><div style={{ marginTop: '8px', fontSize: '13px' }}>Upload {c.type}</div>
                    </div>
                  ) : (
                    <input type="text" style={input} placeholder={`Enter ${c.label.toLowerCase()}...`} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowForm(null)} style={btn.secondary}>Cancel</button>
              <button onClick={() => doAction(showForm)} style={{ ...btn.primary, background: showForm.buttonColor }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ width: '520px', background: '#1a1a1f', borderRadius: '16px', border: '1px solid rgba(236,72,153,0.3)' }}>
            {(() => {
              const t = showTask.tasks[taskIdx];
              return (
                <>
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(236,72,153,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899', fontSize: '14px', fontWeight: '700' }}>{taskIdx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>{t.name}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Task {taskIdx + 1} of {showTask.tasks.length}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {showTask.tasks.map((_, i) => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < taskIdx ? '#10B981' : i === taskIdx ? '#EC4899' : 'rgba(255,255,255,0.1)' }} />)}
                      </div>
                    </div>
                    {t.description && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>{t.description}</p>}
                  </div>
                  <div style={{ padding: '20px', maxHeight: '350px', overflowY: 'auto' }}>
                    {t.components.length > 0 ? t.components.map(c => (
                      <div key={c.id} style={{ marginBottom: '16px' }}>
                        <label style={label}>{c.label} {c.required && <span style={{ color: '#EF4444' }}>*</span>}</label>
                        {c.type === 'textarea' ? (
                          <textarea style={{ ...input, minHeight: '80px' }} placeholder={`Enter ${c.label.toLowerCase()}...`} />
                        ) : c.type === 'checklist' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {c.items?.map((it, i) => <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /><span style={{ fontSize: '13px' }}>{it}</span></label>)}
                          </div>
                        ) : c.type === 'file' || c.type === 'image' ? (
                          <div style={{ padding: '20px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '10px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                            <Icons.Upload /><div style={{ marginTop: '8px', fontSize: '13px' }}>Upload</div>
                          </div>
                        ) : (
                          <input type="text" style={input} placeholder={`Enter ${c.label.toLowerCase()}...`} />
                        )}
                      </div>
                    )) : (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                        <Icons.CheckCircle /><div style={{ marginTop: '8px' }}>No form fields</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{t.onComplete === 'continue' ? 'Next: Continue' : t.onComplete === 'goto_state' ? 'Next: Jump state' : 'Next: Trigger action'}</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setShowTask(null)} style={btn.secondary}>Cancel</button>
                      <button onClick={() => finishTask(t)} style={{ ...btn.primary, background: '#EC4899' }}>{taskIdx < showTask.tasks.length - 1 ? 'Complete & Next' : 'Complete'} <Icons.ArrowRight /></button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DAMPlatform;
