import React, { useState } from 'react';
import Icons from '../common/Icons';
import { btn, input, label, card } from '../../constants/styles';
import BrandPortalPreview from '../BrandPortalPreview';

const TenantOnboarding = ({ tenantData, setTenantData, assetTypes, setAssetTypes, workflows, onEditWorkflow, onCreateWorkflow }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState('idle');
  const [deploymentProgress, setDeploymentProgress] = useState([]);
  const [editingAssetType, setEditingAssetType] = useState(null);
  const [editingFields, setEditingFields] = useState([]);
  const [showPortalPreview, setShowPortalPreview] = useState(false);

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
    setAssetTypes([...assetTypes, { id: `at_${Date.now()}`, name: 'New Asset Type', icon: 'image', customFields: [] }]);
  };

  const deleteAssetType = (id) => {
    setAssetTypes(assetTypes.filter(type => type.id !== id));
  };

  const updateAssetType = (id, updates) => {
    setAssetTypes(assetTypes.map(type => type.id === id ? { ...type, ...updates } : type));
  };

  const addCustomField = () => {
    setEditingFields([...editingFields, { id: `field_${Date.now()}`, name: '', type: 'text', required: false }]);
  };

  const updateCustomField = (id, updates) => {
    setEditingFields(editingFields.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const deleteCustomField = (id) => {
    setEditingFields(editingFields.filter(field => field.id !== id));
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
                    onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
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
                      onChange={(e) => setTenantData({ ...tenantData, domain: e.target.value })}
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
                      onChange={(e) => setTenantData({ ...tenantData, primaryColor: e.target.value })}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent', padding: 0 }}
                    />
                    <input
                      type="text"
                      value={tenantData.primaryColor}
                      onChange={(e) => setTenantData({ ...tenantData, primaryColor: e.target.value })}
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
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{type.customFields?.length || 0} custom fields</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => {
                        setEditingAssetType(type);
                        setEditingFields(type.customFields || []);
                      }} style={{ ...btn.ghost, padding: '8px' }}><Icons.Edit /></button>
                      <button onClick={() => deleteAssetType(type.id)} style={{ ...btn.ghost, padding: '8px', color: '#EF4444' }}><Icons.Trash /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Asset Type Modal */}
              {editingAssetType && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => { setEditingAssetType(null); setEditingFields([]); }}>
                  <div style={{ ...card, padding: '28px', width: '700px', maxWidth: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Edit Asset Type</h3>
                      <button onClick={() => { setEditingAssetType(null); setEditingFields([]); }} style={{ ...btn.ghost, padding: '8px' }}><Icons.X /></button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={label}>Asset Type Name *</label>
                      <input
                        type="text"
                        value={editingAssetType.name}
                        onChange={(e) => setEditingAssetType({ ...editingAssetType, name: e.target.value })}
                        placeholder="e.g., Product Images, Videos, Documents"
                        style={input}
                      />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={label}>Icon Type</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => setEditingAssetType({ ...editingAssetType, icon: 'image' })}
                          style={{
                            ...btn.ghost,
                            padding: '12px 20px',
                            background: editingAssetType.icon === 'image' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${editingAssetType.icon === 'image' ? '#3B82F6' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          <Icons.Image /> Image
                        </button>
                        <button
                          onClick={() => setEditingAssetType({ ...editingAssetType, icon: 'video' })}
                          style={{
                            ...btn.ghost,
                            padding: '12px 20px',
                            background: editingAssetType.icon === 'video' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${editingAssetType.icon === 'video' ? '#3B82F6' : 'rgba(255,255,255,0.06)'}`,
                          }}
                        >
                          <Icons.Video /> Video
                        </button>
                      </div>
                    </div>

                    {/* Custom Fields Section */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <label style={label}>Custom Fields</label>
                        <button onClick={addCustomField} style={{ ...btn.secondary, padding: '8px 12px', fontSize: '13px' }}>
                          <Icons.Plus /> Add Field
                        </button>
                      </div>

                      {editingFields.length === 0 ? (
                        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                          No custom fields yet. Click "Add Field" to create one.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {editingFields.map((field) => (
                            <div key={field.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ ...label, fontSize: '12px', marginBottom: '6px' }}>Field Name</label>
                                  <input
                                    type="text"
                                    value={field.name}
                                    onChange={(e) => updateCustomField(field.id, { name: e.target.value })}
                                    placeholder="e.g., SKU, Dimensions, Author"
                                    style={{ ...input, fontSize: '14px', padding: '10px 12px' }}
                                  />
                                </div>
                                <div style={{ width: '160px' }}>
                                  <label style={{ ...label, fontSize: '12px', marginBottom: '6px' }}>Field Type</label>
                                  <select
                                    value={field.type}
                                    onChange={(e) => updateCustomField(field.id, { type: e.target.value })}
                                    style={{ ...input, fontSize: '14px', padding: '10px 12px' }}
                                  >
                                    <option value="text">Text</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="select">Dropdown</option>
                                    <option value="checkbox">Checkbox</option>
                                  </select>
                                </div>
                                <button
                                  onClick={() => deleteCustomField(field.id)}
                                  style={{ ...btn.ghost, padding: '8px', color: '#EF4444', marginTop: '26px', height: 'fit-content' }}
                                >
                                  <Icons.Trash />
                                </button>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => updateCustomField(field.id, { required: e.target.checked })}
                                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                                  Required field
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                      <button onClick={() => { setEditingAssetType(null); setEditingFields([]); }} style={btn.secondary}>Cancel</button>
                      <button
                        onClick={() => {
                          updateAssetType(editingAssetType.id, { name: editingAssetType.name, icon: editingAssetType.icon, customFields: editingFields });
                          setEditingAssetType(null);
                          setEditingFields([]);
                        }}
                        style={btn.primary}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Your DAM portal is now live at https://{tenantData.domain || 'demo'}.dam.com</p>
                  <button onClick={() => setShowPortalPreview(true)} style={{ ...btn.success, padding: '14px 32px', fontSize: '16px' }}>
                    <Icons.ExternalLink /> View Portal Preview
                  </button>
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

      {/* Brand Portal Preview */}
      {showPortalPreview && (
        <BrandPortalPreview
          tenantData={tenantData}
          assetTypes={assetTypes}
          workflows={workflows}
          onClose={() => setShowPortalPreview(false)}
        />
      )}
    </div>
  );
};

export default TenantOnboarding;
