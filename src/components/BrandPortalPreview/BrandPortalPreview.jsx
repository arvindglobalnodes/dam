import React, { useState } from 'react';
import Icons from '../common/Icons';
import { btn, input } from '../../constants/styles';

const BrandPortalPreview = ({ tenantData, assetTypes, workflows, onClose }) => {
  const [selectedAssetType, setSelectedAssetType] = useState(assetTypes[0]?.id);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [executingAction, setExecutingAction] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);
  const [worklogFormData, setWorklogFormData] = useState({});

  // Generate sample assets for each asset type
  const generateSampleAssets = () => {
    const samples = [];
    assetTypes.forEach(assetType => {
      const workflow = workflows.find(w => w.assetTypes?.includes(assetType.name)) || workflows[0];
      if (!workflow) return;

      const states = workflow.states || [];
      // Create 3-4 sample assets per asset type in different states
      const assetNames = [
        'Summer Campaign Hero',
        'Product Launch Banner',
        'Social Media Post',
        'Email Header Image'
      ];

      assetNames.forEach((name, idx) => {
        const state = states[idx % states.length];
        samples.push({
          id: `asset_${assetType.id}_${idx}`,
          name: name,
          assetType: assetType,
          workflow: workflow,
          currentState: state,
          uploadedBy: 'Demo User',
          uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          thumbnail: `https://via.placeholder.com/300x200/${tenantData.primaryColor.slice(1)}/ffffff?text=${encodeURIComponent(name.slice(0, 15))}`,
          assignedTasks: [] // Tasks assigned to this asset
        });
      });
    });
    return samples;
  };

  const [sampleAssets, setSampleAssets] = useState(generateSampleAssets());

  const currentAssetType = assetTypes.find(at => at.id === selectedAssetType);
  const filteredAssets = sampleAssets.filter(a => a.assetType.id === selectedAssetType);

  const getStateColor = (state) => state?.color || '#6B7280';

  // Handle action execution
  const executeAction = (action) => {
    setExecutingAction(action);
    setFormData({});

    // If action has tasks, start with first task
    if (action.hasTasks && action.tasks && action.tasks.length > 0) {
      setCurrentTask(action.tasks[0]);
      setCurrentTaskIndex(0);
    }
  };

  // Handle task completion
  const completeTask = () => {
    if (!executingAction || !currentTask) return;

    const nextIndex = currentTaskIndex + 1;

    // Check if there are more tasks
    if (nextIndex < executingAction.tasks.length) {
      setCurrentTask(executingAction.tasks[nextIndex]);
      setCurrentTaskIndex(nextIndex);
      setFormData({});
    } else {
      // All tasks completed, execute the action
      completeAction();
    }
  };

  // Complete the action and update asset state
  const completeAction = () => {
    if (!executingAction || !selectedAsset) return;

    // Find the target state
    const targetState = selectedAsset.workflow.states.find(s => s.id === executingAction.toState);

    // Assign tasks to asset if action has tasks
    let assignedTasks = selectedAsset.assignedTasks || [];
    if (executingAction.hasTasks && executingAction.tasks && executingAction.tasks.length > 0) {
      const newTasks = executingAction.tasks.map(task => ({
        ...task,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        assignedTo: 'Demo User', // Default assignee
        assignedAt: new Date().toISOString(),
        status: 'pending', // pending, in_progress, completed
        completedAt: null,
        worklogs: task.worklogs || []
      }));
      assignedTasks = [...assignedTasks, ...newTasks];
    }

    // Update the asset's current state and tasks
    const updatedAsset = {
      ...selectedAsset,
      currentState: targetState,
      assignedTasks: assignedTasks
    };

    setSampleAssets(assets =>
      assets.map(asset =>
        asset.id === selectedAsset.id ? updatedAsset : asset
      )
    );

    // Update selected asset
    setSelectedAsset(updatedAsset);

    // Reset execution state
    setExecutingAction(null);
    setCurrentTask(null);
    setCurrentTaskIndex(0);
    setFormData({});
    setUploadedFiles({});
  };

  // Handle file upload
  const handleFileUpload = (componentId, files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFiles({ ...uploadedFiles, [componentId]: file });
      setFormData({ ...formData, [componentId]: file.name });
    }
  };

  // Handle asset upload
  const handleAssetUpload = () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    // Get the workflow for this asset type
    const workflow = workflows.find(w => w.assetTypes?.includes(currentAssetType.name)) || workflows[0];
    if (!workflow) return;

    // Find the initial state
    const initialState = workflow.states.find(s => s.type === 'initial') || workflow.states[0];

    // Create new asset
    const newAsset = {
      id: `asset_uploaded_${Date.now()}`,
      name: uploadFormData.assetName || uploadFile.name,
      assetType: currentAssetType,
      workflow: workflow,
      currentState: initialState,
      uploadedBy: 'Demo User',
      uploadedAt: new Date().toLocaleDateString(),
      thumbnail: `https://via.placeholder.com/300x200/${tenantData.primaryColor.slice(1)}/ffffff?text=${encodeURIComponent((uploadFormData.assetName || uploadFile.name).slice(0, 15))}`,
      customFieldValues: uploadFormData,
      assignedTasks: []
    };

    // Add to assets list
    setSampleAssets([newAsset, ...sampleAssets]);

    // Reset and close
    setShowUploadModal(false);
    setUploadFormData({});
    setUploadFile(null);
    setSelectedAsset(newAsset);
  };

  // Complete a task
  const completeAssetTask = (taskId) => {
    if (!selectedAsset) return;

    const updatedAsset = {
      ...selectedAsset,
      assignedTasks: selectedAsset.assignedTasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
          : task
      )
    };

    setSampleAssets(assets =>
      assets.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset)
    );
    setSelectedAsset(updatedAsset);
  };

  // Add worklog to task
  const addWorklogToTask = (taskId, worklog) => {
    if (!selectedAsset) return;

    const updatedAsset = {
      ...selectedAsset,
      assignedTasks: selectedAsset.assignedTasks.map(task =>
        task.id === taskId
          ? { ...task, worklogs: [...(task.worklogs || []), worklog] }
          : task
      )
    };

    setSampleAssets(assets =>
      assets.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset)
    );
    setSelectedAsset(updatedAsset);
  };

  // Update task assignee
  const updateTaskAssignee = (taskId, assignee) => {
    if (!selectedAsset) return;

    const updatedAsset = {
      ...selectedAsset,
      assignedTasks: selectedAsset.assignedTasks.map(task =>
        task.id === taskId
          ? { ...task, assignedTo: assignee }
          : task
      )
    };

    setSampleAssets(assets =>
      assets.map(asset => asset.id === selectedAsset.id ? updatedAsset : asset)
    );
    setSelectedAsset(updatedAsset);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0A0A0A', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: `linear-gradient(135deg, ${tenantData.primaryColor}15, rgba(0,0,0,0.3))`,
        borderBottom: `2px solid ${tenantData.primaryColor}40`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Brand Logo/Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: tenantData.primaryColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '700',
            color: '#fff',
            boxShadow: `0 8px 24px ${tenantData.primaryColor}40`
          }}>
            {tenantData.name ? tenantData.name[0].toUpperCase() : 'B'}
          </div>

          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>{tenantData.name || 'Brand Name'}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Digital Asset Management Portal</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            {filteredAssets.length} assets
          </div>
          <button onClick={onClose} style={{ ...btn.ghost, padding: '10px 16px' }}>
            <Icons.X /> Close Preview
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar - Asset Types */}
        <div style={{ width: '260px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Asset Types</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {assetTypes.map(assetType => {
              const count = sampleAssets.filter(a => a.assetType.id === assetType.id).length;
              return (
                <button
                  key={assetType.id}
                  onClick={() => setSelectedAssetType(assetType.id)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    marginBottom: '8px',
                    background: selectedAssetType === assetType.id ? `${tenantData.primaryColor}20` : 'rgba(255,255,255,0.02)',
                    border: selectedAssetType === assetType.id ? `1px solid ${tenantData.primaryColor}60` : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: selectedAssetType === assetType.id ? `${tenantData.primaryColor}40` : 'rgba(59,130,246,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedAssetType === assetType.id ? tenantData.primaryColor : '#3B82F6'
                  }}>
                    {assetType.icon === 'video' ? <Icons.Video /> : <Icons.Image />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: selectedAssetType === assetType.id ? '#fff' : 'rgba(255,255,255,0.9)', marginBottom: '2px' }}>
                      {assetType.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                      {count} assets • {assetType.customFields?.length || 0} fields
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{currentAssetType?.name}</h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{filteredAssets.length} assets available</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    ...btn.ghost,
                    padding: '8px 12px',
                    background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    fontSize: '13px'
                  }}
                >
                  <Icons.Grid /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    ...btn.ghost,
                    padding: '8px 12px',
                    background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    fontSize: '13px'
                  }}
                >
                  <Icons.List /> List
                </button>
              </div>

              <button onClick={() => setShowUploadModal(true)} style={{ ...btn.primary, background: tenantData.primaryColor }}>
                <Icons.Upload /> Upload Asset
              </button>
            </div>
          </div>

          {/* Assets Grid/List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {viewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: selectedAsset?.id === asset.id ? `2px solid ${tenantData.primaryColor}` : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      height: '180px',
                      background: `linear-gradient(135deg, ${asset.currentState.color}40, ${asset.currentState.color}20)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: '48px', opacity: 0.3 }}>
                        {asset.assetType.icon === 'video' ? <Icons.Video /> : <Icons.Image />}
                      </div>
                      {/* State Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '6px 12px',
                        background: asset.currentState.color,
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {asset.currentState.name}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#fff' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                        {asset.uploadedBy} • {asset.uploadedAt}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                        Workflow: {asset.workflow.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 16px',
                      background: selectedAsset?.id === asset.id ? `${tenantData.primaryColor}20` : 'rgba(255,255,255,0.02)',
                      border: selectedAsset?.id === asset.id ? `1px solid ${tenantData.primaryColor}60` : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: `${asset.currentState.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {asset.assetType.icon === 'video' ? <Icons.Video /> : <Icons.Image />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{asset.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        {asset.uploadedBy} • {asset.uploadedAt}
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      background: asset.currentState.color,
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#fff'
                    }}>
                      {asset.currentState.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {asset.workflow.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Asset Details */}
        {selectedAsset && (
          <div style={{ width: '360px', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Asset Details</h3>
                <button onClick={() => setSelectedAsset(null)} style={{ ...btn.ghost, padding: '4px' }}>
                  <Icons.X />
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>{selectedAsset.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Uploaded by {selectedAsset.uploadedBy} on {selectedAsset.uploadedAt}
                </div>
              </div>

              {/* Current State */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase' }}>Current State</div>
                <div style={{
                  padding: '10px 14px',
                  background: `${selectedAsset.currentState.color}20`,
                  border: `1px solid ${selectedAsset.currentState.color}60`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: selectedAsset.currentState.color }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{selectedAsset.currentState.name}</span>
                </div>
              </div>

              {/* Available Actions */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Available Actions</div>
                {selectedAsset.workflow.actions
                  ?.filter(action => action.fromState === selectedAsset.currentState.id)
                  .map(action => {
                    const toState = selectedAsset.workflow.states.find(s => s.id === action.toState);
                    return (
                      <button
                        key={action.id}
                        onClick={() => executeAction(action)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          marginBottom: '8px',
                          background: `${action.buttonColor}20`,
                          border: `1px solid ${action.buttonColor}60`,
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{action.name}</span>
                        <span style={{ fontSize: '11px', opacity: 0.7 }}>→ {toState?.name}</span>
                      </button>
                    );
                  }) || <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', padding: '12px', textAlign: 'center' }}>No actions available</div>}
              </div>

              {/* Assigned Tasks */}
              {selectedAsset.assignedTasks && selectedAsset.assignedTasks.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Assigned Tasks ({selectedAsset.assignedTasks.filter(t => t.status !== 'completed').length} pending)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedAsset.assignedTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskForView(task)}
                        style={{
                          padding: '12px',
                          background: task.status === 'completed' ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                          border: task.status === 'completed' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', flex: 1 }}>{task.name}</div>
                          {task.status === 'completed' && <Icons.CheckCircle />}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                          {task.description}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {task.type && (
                            <span style={{
                              padding: '3px 8px',
                              background: 'rgba(59,130,246,0.1)',
                              border: '1px solid rgba(59,130,246,0.3)',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#3B82F6',
                              textTransform: 'uppercase'
                            }}>
                              {task.type}
                            </span>
                          )}
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                            <Icons.User /> {task.assignedTo}
                          </span>
                          {task.worklogs && task.worklogs.length > 0 && (
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                              {task.worklogs.length} worklog{task.worklogs.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {selectedAsset.assetType.customFields && selectedAsset.assetType.customFields.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>Custom Fields</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedAsset.assetType.customFields.slice(0, 5).map(field => (
                      <div key={field.id} style={{ fontSize: '12px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                          {field.name} {field.required && <span style={{ color: '#EF4444' }}>*</span>}
                        </div>
                        <div style={{
                          padding: '8px 10px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '12px'
                        }}>
                          {field.type === 'checkbox' ? '☑ Yes' : 'Sample value'}
                        </div>
                      </div>
                    ))}
                    {selectedAsset.assetType.customFields.length > 5 && (
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', padding: '8px', textAlign: 'center' }}>
                        + {selectedAsset.assetType.customFields.length - 5} more fields
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action/Task Execution Modal */}
      {executingAction && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '1100px', maxWidth: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                {currentTask ? `Task ${currentTaskIndex + 1}/${executingAction.tasks?.length}: ${currentTask.name}` : executingAction.name}
              </h3>
              {currentTask && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>{currentTask.description}</p>
                  {currentTask.type && (
                    <span style={{
                      padding: '4px 10px',
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#3B82F6',
                      textTransform: 'uppercase'
                    }}>
                      {currentTask.type}
                    </span>
                  )}
                </div>
              )}
              {!currentTask && executingAction.components && executingAction.components.length > 0 && (
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Complete the form below to proceed</p>
              )}
            </div>

            {/* Modal Body - Two Columns */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

              {/* Left Panel - Asset Details */}
              <div style={{ width: '360px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset Information</div>

                  {/* Asset Thumbnail */}
                  <div style={{
                    height: '160px',
                    background: `linear-gradient(135deg, ${selectedAsset.currentState.color}40, ${selectedAsset.currentState.color}20)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '48px', opacity: 0.3 }}>
                      {selectedAsset.assetType.icon === 'video' ? <Icons.Video /> : <Icons.Image />}
                    </div>
                    {/* State Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '6px 12px',
                      background: selectedAsset.currentState.color,
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#fff'
                    }}>
                      {selectedAsset.currentState.name}
                    </div>
                  </div>

                  {/* Asset Name & Meta */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#fff' }}>{selectedAsset.name}</h4>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                      Type: {selectedAsset.assetType.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                      Uploaded by {selectedAsset.uploadedBy}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Date: {selectedAsset.uploadedAt}
                    </div>
                  </div>

                  {/* Workflow Info */}
                  <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Current Workflow</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{selectedAsset.workflow.name}</div>
                  </div>

                  {/* Custom Fields */}
                  {selectedAsset.assetType.customFields && selectedAsset.assetType.customFields.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Asset Metadata</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedAsset.assetType.customFields.slice(0, 6).map(field => (
                          <div key={field.id} style={{ fontSize: '12px' }}>
                            <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontSize: '11px' }}>
                              {field.name} {field.required && <span style={{ color: '#EF4444' }}>*</span>}
                            </div>
                            <div style={{
                              padding: '8px 10px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '6px',
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '12px'
                            }}>
                              {field.type === 'checkbox' ? '☑ Yes' : field.type === 'date' ? '2024-12-09' : field.type === 'number' ? '100' : 'Sample value'}
                            </div>
                          </div>
                        ))}
                        {selectedAsset.assetType.customFields.length > 6 && (
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', padding: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                            + {selectedAsset.assetType.customFields.length - 6} more fields
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Form */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <div style={{ padding: '24px 32px', flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {currentTask ? 'Task Requirements' : 'Action Form'}
                  </div>

                  {/* Form Components */}
                  <div>
                    {(currentTask ? currentTask.components : executingAction.components || []).map(comp => (
                      <div key={comp.id} style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                          {comp.label} {comp.required && <span style={{ color: '#EF4444' }}>*</span>}
                        </label>

                        {comp.type === 'text' && (
                          <input
                            type="text"
                            value={formData[comp.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [comp.id]: e.target.value })}
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                            placeholder="Enter value..."
                          />
                        )}

                        {comp.type === 'textarea' && (
                          <textarea
                            value={formData[comp.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [comp.id]: e.target.value })}
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '100px', resize: 'vertical' }}
                            placeholder="Enter details..."
                          />
                        )}

                        {comp.type === 'checklist' && comp.items && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {comp.items.map((item, idx) => (
                              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                                <span style={{ fontSize: '14px' }}>{item}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {comp.type === 'file' && (
                          <div>
                            <input
                              type="file"
                              id={`file-${comp.id}`}
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(comp.id, e.target.files)}
                            />
                            <label
                              htmlFor={`file-${comp.id}`}
                              style={{
                                display: 'block',
                                padding: '32px 24px',
                                background: uploadedFiles[comp.id] ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                                border: uploadedFiles[comp.id] ? '2px solid rgba(16,185,129,0.3)' : '2px dashed rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                {uploadedFiles[comp.id] ? (
                                  <>
                                    <Icons.CheckCircle />
                                    <div style={{ fontSize: '14px', color: '#10B981', fontWeight: '600' }}>
                                      {uploadedFiles[comp.id].name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                      {(uploadedFiles[comp.id].size / 1024).toFixed(2)} KB
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                                      Click to change file
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Icons.Upload />
                                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                                      Click to upload or drag and drop
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                                      PNG, JPG, PDF up to 10MB
                                    </div>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        )}

                        {comp.type === 'select' && (
                          <select
                            value={formData[comp.id] || ''}
                            onChange={(e) => setFormData({ ...formData, [comp.id]: e.target.value })}
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                          >
                            <option value="">Select...</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                          </select>
                        )}
                      </div>
                    ))}

                    {(currentTask ? currentTask.components : executingAction.components || []).length === 0 && (
                      <div style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        <Icons.CheckCircle />
                        <div style={{ marginTop: '12px', fontSize: '14px' }}>No form required. Click continue to proceed.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setExecutingAction(null);
                      setCurrentTask(null);
                      setCurrentTaskIndex(0);
                      setFormData({});
                      setUploadedFiles({});
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => currentTask ? completeTask() : completeAction()}
                    style={{
                      padding: '10px 20px',
                      background: tenantData.primaryColor,
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {currentTask
                      ? (currentTaskIndex < executingAction.tasks.length - 1 ? 'Next Task' : 'Complete Tasks')
                      : 'Complete Action'}
                    <Icons.ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Asset Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '700px', maxWidth: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Upload New Asset</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                Upload a new {currentAssetType?.name} to your digital asset library
              </p>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

              {/* File Upload Area */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                  Select File <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="file"
                  id="asset-upload-file"
                  style={{ display: 'none' }}
                  accept="image/*,video/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="asset-upload-file"
                  style={{
                    display: 'block',
                    padding: '40px 24px',
                    background: uploadFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                    border: uploadFile ? '2px solid rgba(16,185,129,0.3)' : '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    {uploadFile ? (
                      <>
                        <Icons.CheckCircle />
                        <div style={{ fontSize: '16px', color: '#10B981', fontWeight: '600' }}>
                          {uploadFile.name}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                          Click to change file
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '48px', opacity: 0.3 }}>
                          {currentAssetType?.icon === 'video' ? <Icons.Video /> : <Icons.Image />}
                        </div>
                        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                          Click to upload or drag and drop
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                          {currentAssetType?.icon === 'video' ? 'MP4, MOV, AVI' : 'PNG, JPG, GIF, SVG'} up to 50MB
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Asset Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                  Asset Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={uploadFormData.assetName || ''}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, assetName: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                  placeholder={`Enter ${currentAssetType?.name.toLowerCase()} name...`}
                />
              </div>

              {/* Custom Fields */}
              {currentAssetType?.customFields && currentAssetType.customFields.length > 0 && (
                <>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255,255,255,0.9)', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    Asset Metadata
                  </div>
                  {currentAssetType.customFields.map(field => (
                    <div key={field.id} style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                        {field.name} {field.required && <span style={{ color: '#EF4444' }}>*</span>}
                      </label>

                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={uploadFormData[field.id] || ''}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, [field.id]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                        />
                      )}

                      {field.type === 'textarea' && (
                        <textarea
                          value={uploadFormData[field.id] || ''}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, [field.id]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                        />
                      )}

                      {field.type === 'number' && (
                        <input
                          type="number"
                          value={uploadFormData[field.id] || ''}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, [field.id]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                        />
                      )}

                      {field.type === 'date' && (
                        <input
                          type="date"
                          value={uploadFormData[field.id] || ''}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, [field.id]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                        />
                      )}

                      {field.type === 'select' && (
                        <select
                          value={uploadFormData[field.id] || ''}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, [field.id]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
                        >
                          <option value="">Select {field.name.toLowerCase()}...</option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                          <option value="option3">Option 3</option>
                        </select>
                      )}

                      {field.type === 'checkbox' && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={uploadFormData[field.id] || false}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, [field.id]: e.target.checked })}
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>Yes</span>
                        </label>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFormData({});
                  setUploadFile(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssetUpload}
                style={{
                  padding: '10px 20px',
                  background: tenantData.primaryColor,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Icons.Upload />
                Upload Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTaskForView && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3500, padding: '20px' }}>
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', width: '800px', maxWidth: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{selectedTaskForView.name}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
                  {selectedTaskForView.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {selectedTaskForView.type && (
                    <span style={{
                      padding: '4px 10px',
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#3B82F6',
                      textTransform: 'uppercase'
                    }}>
                      {selectedTaskForView.type}
                    </span>
                  )}
                  <span style={{
                    padding: '4px 10px',
                    background: selectedTaskForView.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    border: selectedTaskForView.status === 'completed' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: selectedTaskForView.status === 'completed' ? '#10B981' : '#F59E0B',
                    textTransform: 'uppercase'
                  }}>
                    {selectedTaskForView.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedTaskForView(null)} style={{ ...btn.ghost, padding: '8px' }}>
                <Icons.X />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

              {/* Assignee Section */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                  Assigned To
                </label>
                <select
                  value={selectedTaskForView.assignedTo}
                  onChange={(e) => updateTaskAssignee(selectedTaskForView.id, e.target.value)}
                  disabled={selectedTaskForView.status === 'completed'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                >
                  <option value="Demo User">Demo User</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Chen">Mike Chen</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>

              {/* Task Components/Form Fields */}
              {selectedTaskForView.components && selectedTaskForView.components.length > 0 && (
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' }}>
                    Task Requirements
                  </div>
                  {selectedTaskForView.components.map(comp => (
                    <div key={comp.id} style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255,255,255,0.9)' }}>
                        {comp.label} {comp.required && <span style={{ color: '#EF4444' }}>*</span>}
                      </label>
                      {comp.type === 'checklist' && comp.items && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {comp.items.map((item, idx) => (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                              <input type="checkbox" disabled={selectedTaskForView.status === 'completed'} style={{ width: '16px', height: '16px' }} />
                              <span style={{ fontSize: '14px' }}>{item}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {comp.type === 'textarea' && (
                        <div style={{
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                          minHeight: '60px'
                        }}>
                          Sample response text...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Worklogs Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                    Worklogs ({selectedTaskForView.worklogs?.length || 0})
                  </div>
                </div>

                {/* Add Worklog Form */}
                {selectedTaskForView.status !== 'completed' && (
                  <div style={{ marginBottom: '16px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.7)' }}>Add Worklog</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'rgba(255,255,255,0.6)' }}>Time Spent</label>
                        <input
                          type="text"
                          value={worklogFormData.timeSpent || ''}
                          onChange={(e) => setWorklogFormData({ ...worklogFormData, timeSpent: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '13px'
                          }}
                          placeholder="e.g., 2h 30m"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'rgba(255,255,255,0.6)' }}>User</label>
                        <input
                          type="text"
                          value={worklogFormData.user || 'Demo User'}
                          onChange={(e) => setWorklogFormData({ ...worklogFormData, user: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '13px'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: 'rgba(255,255,255,0.6)' }}>Comment</label>
                      <textarea
                        value={worklogFormData.comment || ''}
                        onChange={(e) => setWorklogFormData({ ...worklogFormData, comment: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '13px',
                          minHeight: '60px',
                          resize: 'vertical'
                        }}
                        placeholder="Add a comment about your work..."
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (worklogFormData.timeSpent && worklogFormData.comment) {
                          addWorklogToTask(selectedTaskForView.id, {
                            id: `wl_${Date.now()}`,
                            user: worklogFormData.user || 'Demo User',
                            timestamp: new Date().toISOString(),
                            timeSpent: worklogFormData.timeSpent,
                            comment: worklogFormData.comment
                          });
                          setWorklogFormData({});
                          // Refresh selected task
                          const updatedTask = selectedAsset.assignedTasks.find(t => t.id === selectedTaskForView.id);
                          if (updatedTask) setSelectedTaskForView(updatedTask);
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        background: tenantData.primaryColor,
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Add Worklog
                    </button>
                  </div>
                )}

                {/* Worklogs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedTaskForView.worklogs && selectedTaskForView.worklogs.length > 0 ? (
                    selectedTaskForView.worklogs.map(log => (
                      <div key={log.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{log.user}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                          {log.comment}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                          Time spent: <span style={{ fontWeight: '600', color: tenantData.primaryColor }}>{log.timeSpent}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                      No worklogs yet. Add your first worklog above.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedTaskForView(null)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              {selectedTaskForView.status !== 'completed' && (
                <button
                  onClick={() => {
                    completeAssetTask(selectedTaskForView.id);
                    setSelectedTaskForView(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#10B981',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icons.CheckCircle />
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandPortalPreview;
