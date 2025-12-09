import React from 'react';
import Icons from '../common/Icons';
import { input, btn } from '../../constants/styles';
import { componentTypes } from '../../constants/componentTypes';

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

export default ComponentList;
