import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import TenantOnboarding from './components/TenantOnboarding';
import WorkflowBuilder from './components/WorkflowBuilder';
import WorkflowPreview from './components/WorkflowPreview';
import { initialWorkflows, initialAssetTypes } from './utils/demoData';
import { btn } from './constants/styles';
import Icons from './components/common/Icons';

const AppContent = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [tenantData, setTenantData] = useState({ name: '', domain: '', primaryColor: '#3B82F6', logo: null });

  const [assetTypes, setAssetTypes] = useState(initialAssetTypes);
  const [workflows, setWorkflows] = useState(initialWorkflows);

  const handleSaveWorkflow = (workflow) => {
    if (editingWorkflow) {
      setWorkflows(workflows.map(w => w.id === workflow.id ? workflow : w));
    } else {
      setWorkflows([...workflows, { ...workflow, id: `wf_${Date.now()}` }]);
    }
    setShowWorkflowBuilder(false);
    setEditingWorkflow(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B0D11' }}>
        <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D11' }}>
      {/* Header with Logout */}
      {!showWorkflowBuilder && !showPreview && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          background: 'rgba(26,26,26,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.User />
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{user?.name}</span>
          </div>
          <button
            onClick={logout}
            style={{
              ...btn.ghost,
              padding: '6px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Logout
          </button>
        </div>
      )}

      {showWorkflowBuilder ? (
        <WorkflowBuilder
          workflow={editingWorkflow}
          onClose={() => { setShowWorkflowBuilder(false); setEditingWorkflow(null); }}
          onSave={handleSaveWorkflow}
          onPreview={() => setShowPreview(true)}
        />
      ) : showPreview ? (
        <WorkflowPreview
          workflow={editingWorkflow || workflows[0]}
          onClose={() => setShowPreview(false)}
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
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
