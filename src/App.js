import React, { useState } from 'react';
import TenantOnboarding from './components/TenantOnboarding';
import WorkflowBuilder from './components/WorkflowBuilder';
import WorkflowPreview from './components/WorkflowPreview';
import { initialWorkflows, initialAssetTypes } from './utils/demoData';

const App = () => {
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

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D11' }}>
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

export default App;
