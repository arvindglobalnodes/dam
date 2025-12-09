import React, { useState } from 'react';
import Icons from '../common/Icons';
import { btn, input, label } from '../../constants/styles';

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

export default WorkflowPreview;
