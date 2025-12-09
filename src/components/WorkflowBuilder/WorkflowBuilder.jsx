import React, { useState, useEffect } from 'react';
import Icons from '../common/Icons';
import { btn, input, label, card } from '../../constants/styles';
import { componentTypes } from '../../constants/componentTypes';
import { stateColors } from '../../constants/colors';
import ComponentList from './ComponentList';

const WorkflowBuilder = ({ workflow, onClose, onSave, onPreview }) => {
  const [activeTab, setActiveTab] = useState('states');
  const [workflowName, setWorkflowName] = useState(workflow?.name || 'New Workflow');
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [statePositions, setStatePositions] = useState({});

  // Drag-to-connect state
  const [dragFrom, setDragFrom] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);

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
    const s = { id: `s_${Date.now()}`, name: 'New State', type: 'intermediate', color: '#8B5CF6', order: Math.max(...states.map(x => x.order), -1) + 1 };
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
    const t = {
      id: `t_${Date.now()}`,
      name: 'New Task',
      description: '',
      type: 'review', // default task type
      components: [],
      onComplete: 'continue',
      onCompleteTarget: null,
      worklogs: []
    };
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

  // Worklog CRUD
  const addWorklog = (aid, tid) => {
    const wl = {
      id: `wl_${Date.now()}`,
      user: 'Current User',
      timestamp: new Date().toISOString(),
      timeSpent: '',
      comment: ''
    };
    setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, worklogs: [...(t.worklogs || []), wl] } : t) } : a));
  };
  const updateWorklog = (aid, tid, wlid, u) => setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, worklogs: (t.worklogs || []).map(wl => wl.id === wlid ? { ...wl, ...u } : wl) } : t) } : a));
  const deleteWorklog = (aid, tid, wlid) => setActions(actions.map(a => a.id === aid ? { ...a, tasks: a.tasks.map(t => t.id === tid ? { ...t, worklogs: (t.worklogs || []).filter(wl => wl.id !== wlid) } : t) } : a));

  const getConnType = (from, to) => {
    if (!from || !to) return 'forward';
    if (to.order < from.order) return 'backward';
    if (to.order - from.order > 1) return 'skip';
    if (to.type === 'terminal') return 'terminal';
    return 'forward';
  };

  // Drag-to-connect handlers
  const handleStateMouseDown = (e, stateId) => {
    const state = states.find(s => s.id === stateId);
    if (state?.type === 'terminal') return; // Can't drag from terminal states

    e.stopPropagation();
    const canvas = e.currentTarget.parentElement.parentElement;
    const rect = canvas.getBoundingClientRect();
    setDragFrom(stateId);
    setDragPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCanvasMouseMove = (e) => {
    if (!dragFrom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDragPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCanvasMouseUp = (e) => {
    if (!dragFrom) return;

    // Check if we're hovering over a state
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const stateElement = element?.closest('[data-state-id]');
    const targetStateId = stateElement?.getAttribute('data-state-id');

    if (targetStateId && targetStateId !== dragFrom) {
      // Create a new action
      const a = {
        id: `a_${Date.now()}`,
        name: 'New Action',
        fromState: dragFrom,
        toState: targetStateId,
        buttonColor: '#3B82F6',
        components: [],
        hasTasks: false,
        tasks: []
      };
      setActions([...actions, a]);
      setSelectedActionId(a.id);
      setActiveTab('actions');
    }

    setDragFrom(null);
    setDragPosition(null);
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
                  <div key={s.id} onClick={() => { setSelectedStateId(s.id); setSelectedActionId(null); setSelectedTaskId(null); }} style={{ padding: '12px', marginBottom: '6px', background: selectedStateId === s.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: selectedStateId === s.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer' }}>
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
                    <div key={a.id} onClick={() => { setSelectedActionId(a.id); setSelectedStateId(null); setSelectedTaskId(null); }} style={{ padding: '12px', marginBottom: '6px', background: selectedActionId === a.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: selectedActionId === a.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer' }}>
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
        <div
          style={{ flex: 1, position: 'relative', background: 'rgba(0,0,0,0.2)', overflow: 'auto', cursor: dragFrom ? 'crosshair' : 'default' }}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={() => { setDragFrom(null); setDragPosition(null); }}
        >
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
            {/* Temporary drag line */}
            {dragFrom && dragPosition && statePositions[dragFrom] && (
              <line
                x1={statePositions[dragFrom].x}
                y1={statePositions[dragFrom].y + 30}
                x2={dragPosition.x}
                y2={dragPosition.y}
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray="5,5"
                strokeOpacity="0.7"
                markerEnd="url(#arr-b)"
              />
            )}
          </svg>
          <div style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
            {Object.keys(statePositions).length > 0 && states.map(s => {
              const p = statePositions[s.id];
              if (!p) return null;
              const sa = actions.filter(a => a.fromState === s.id);
              const tt = sa.reduce((x, a) => x + (a.tasks?.length || 0), 0);
              return (
                <div
                  key={s.id}
                  data-state-id={s.id}
                  onClick={() => { setSelectedStateId(s.id); setSelectedActionId(null); setSelectedTaskId(null); }}
                  onMouseDown={(e) => handleStateMouseDown(e, s.id)}
                  style={{ position: 'absolute', left: p.x - 75, top: p.y, width: '150px', padding: '14px 16px', background: selectedStateId === s.id ? `${s.color}20` : 'rgba(20,20,25,0.9)', border: `2px solid ${selectedStateId === s.id ? s.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', cursor: dragFrom === s.id ? 'grabbing' : 'grab', textAlign: 'center', boxShadow: selectedStateId === s.id ? `0 0 20px ${s.color}40` : '0 4px 12px rgba(0,0,0,0.3)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px', pointerEvents: 'none' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}` }} /><span style={{ fontWeight: '600', fontSize: '14px' }}>{s.name}</span></div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>{s.type === 'initial' ? '● Start' : s.type === 'terminal' ? '● End' : `${sa.length} actions`}{tt > 0 && <span style={{ color: '#EC4899' }}> • {tt} tasks</span>}</div>
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

                {/* Task Type */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={label}>Task Type</label>
                  <select value={selectedTask.type || 'review'} onChange={(e) => updateTask(selectedAction.id, selectedTask.id, { type: e.target.value })} style={input}>
                    <option value="review">Review</option>
                    <option value="approval">Approval</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="upload">Upload</option>
                    <option value="qa">QA/Testing</option>
                    <option value="documentation">Documentation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Worklogs Section */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={label}>Worklogs</label>
                    <button onClick={() => addWorklog(selectedAction.id, selectedTask.id)} style={{ ...btn.secondary, padding: '6px 12px', fontSize: '12px' }}>
                      <Icons.Plus /> Add Log
                    </button>
                  </div>

                  {(!selectedTask.worklogs || selectedTask.worklogs.length === 0) ? (
                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                      No worklogs yet. Click "Add Log" to track work.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedTask.worklogs.map((wl) => (
                        <div key={wl.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                              <strong>{wl.user}</strong> • {new Date(wl.timestamp).toLocaleString()}
                            </div>
                            <button onClick={() => deleteWorklog(selectedAction.id, selectedTask.id, wl.id)} style={{ ...btn.ghost, padding: '4px', color: '#EF4444' }}>
                              <Icons.Trash />
                            </button>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <label style={{ ...label, fontSize: '11px', marginBottom: '4px' }}>Time Spent</label>
                            <input
                              type="text"
                              value={wl.timeSpent}
                              onChange={(e) => updateWorklog(selectedAction.id, selectedTask.id, wl.id, { timeSpent: e.target.value })}
                              placeholder="e.g., 2h 30m"
                              style={{ ...input, fontSize: '12px', padding: '8px 10px' }}
                            />
                          </div>
                          <div>
                            <label style={{ ...label, fontSize: '11px', marginBottom: '4px' }}>Comment</label>
                            <textarea
                              value={wl.comment}
                              onChange={(e) => updateWorklog(selectedAction.id, selectedTask.id, wl.id, { comment: e.target.value })}
                              placeholder="What did you work on?"
                              style={{ ...input, fontSize: '12px', padding: '8px 10px', minHeight: '60px', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Task Form Components */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ ...label, marginBottom: '12px' }}>Task Form</label>
                  <ComponentList comps={selectedTask.components} onUpdate={(cid, u) => updateTaskComp(selectedAction.id, selectedTask.id, cid, u)} onDelete={(cid) => deleteTaskComp(selectedAction.id, selectedTask.id, cid)} onAdd={(t) => addTaskComp(selectedAction.id, selectedTask.id, t)} />
                </div>

                {/* After Completion */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ ...label, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Target /> After Completion</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: selectedTask.onComplete === 'continue' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: selectedTask.onComplete === 'continue' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer' }}><input type="radio" name="oc" checked={selectedTask.onComplete === 'continue'} onChange={() => updateTask(selectedAction.id, selectedTask.id, { onComplete: 'continue', onCompleteTarget: null })} /><div><div style={{ fontWeight: '500', fontSize: '13px' }}>Continue</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Next task or state</div></div></label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: selectedTask.onComplete === 'goto_state' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: selectedTask.onComplete === 'goto_state' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer' }}><input type="radio" name="oc" checked={selectedTask.onComplete === 'goto_state'} onChange={() => updateTask(selectedAction.id, selectedTask.id, { onComplete: 'goto_state' })} /><div style={{ flex: 1 }}><div style={{ fontWeight: '500', fontSize: '13px' }}>Go to State</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Jump to specific state</div></div></label>
                    {selectedTask.onComplete === 'goto_state' && <select value={selectedTask.onCompleteTarget || ''} onChange={(e) => updateTask(selectedAction.id, selectedTask.id, { onCompleteTarget: e.target.value })} style={{ ...input, marginLeft: '32px' }}><option value="">Select...</option>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: selectedTask.onComplete === 'goto_action' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)', border: selectedTask.onComplete === 'goto_action' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', cursor: 'pointer' }}><input type="radio" name="oc" checked={selectedTask.onComplete === 'goto_action'} onChange={() => updateTask(selectedAction.id, selectedTask.id, { onComplete: 'goto_action' })} /><div style={{ flex: 1 }}><div style={{ fontWeight: '500', fontSize: '13px' }}>Trigger Action</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Execute another action</div></div></label>
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

export default WorkflowBuilder;
