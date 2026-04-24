import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const FieldBuilder = ({ onAddField }) => {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [required, setRequired] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !label) return;

    // Simple auto-formatting for name to be camelCase without spaces
    const formattedName = name.trim().replace(/\s+/g, '_').toLowerCase();

    const newField = {
      name: formattedName,
      label: label.trim(),
      type: type,
      defaultValue: type === 'checkbox' ? false : '',
      rules: { required }
    };

    onAddField(newField);

    // Reset local state
    setName('');
    setLabel('');
    setType('text');
    setRequired(false);
  };

  return (
    <div className="field-builder">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.25rem' }}>Field Builder</h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>Configure and add a new field to your form schema.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Display Label</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. First Name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <small className="form-helper">This is what the end-user will see on the form.</small>
        </div>

        <div className="form-group">
          <label className="form-label">Database Key (Internal Name)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. first_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <small className="form-helper">Used as the JSON key in the submission payload. No spaces.</small>
        </div>

        <div className="form-group">
          <label className="form-label">Field Type</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="text">Short Text</option>
            <option value="email">Email Address</option>
            <option value="number">Numeric</option>
            <option value="checkbox">Checkbox / Toggle</option>
            <option value="textarea">Long Text (Paragraph)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <label className="checkbox-group">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            <span className="form-label" style={{ marginBottom: 0 }}>Make this field required</span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add to Schema
        </button>
      </form>
    </div>
  );
};
