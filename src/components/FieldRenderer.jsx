import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const FieldRenderer = ({ field, value, error, onChange, onBlur, onRepeaterAction }) => {
  const { name, label, type, placeholder, options, itemSchema } = field;

  // Handle standard input change
  const handleChange = (e) => {
    let val = e.target.value;
    if (type === 'checkbox') val = e.target.checked;
    if (type === 'number') val = val ? Number(val) : '';
    onChange(name, val);
  };

  const handleBlur = () => {
    if (onBlur) onBlur(name);
  };

  const isInvalid = !!error;
  const inputClass = `form-control ${isInvalid ? 'is-invalid' : ''}`;

  switch (type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
      return (
        <div className="form-group">
          <label className="form-label">{label} *</label>
          <input
            name={name}
            type={type}
            className={inputClass}
            placeholder={placeholder}
            value={value !== undefined ? value : ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {isInvalid && <span className="error-message">⚠️ {error}</span>}
        </div>
      );

    case 'textarea':
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <textarea
            name={name}
            className={inputClass}
            placeholder={placeholder}
            rows={4}
            value={value !== undefined ? value : ''}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {isInvalid && <span className="error-message">⚠️ {error}</span>}
        </div>
      );

    case 'select':
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <select
            name={name}
            className={inputClass}
            value={value !== undefined ? value : ''}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {options?.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {isInvalid && <span className="error-message">⚠️ {error}</span>}
        </div>
      );

    case 'checkbox':
      return (
        <div className="form-group">
          <label className="checkbox-group">
            <input
              type="checkbox"
              name={name}
              checked={!!value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span className="form-label" style={{ marginBottom: 0 }}>{label}</span>
          </label>
          {isInvalid && <span className="error-message">⚠️ {error}</span>}
        </div>
      );

    case 'radio':
      return (
        <div className="form-group">
          <label className="form-label">{label}</label>
          <div className="radio-group">
            {options?.map((opt,i) =>{ 
              console.log("options")
              return(
              <label key={i} className="checkbox-group" style={{ marginTop: 0 }}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(name, e.target.value)}
                  onBlur={handleBlur}
                />
                <span className="form-label" style={{ marginBottom: 0 }}>{opt.label}</span>
              </label>
            )})}
          </div>
          {isInvalid && <span className="error-message">⚠️ {error}</span>}
        </div>
      );

    case 'repeater':
      const list = Array.isArray(value) ? value : [];
      return (
        <div className="form-group repeater-group">
          <div className="repeater-header">
            <label className="form-label" style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{label}</label>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              onClick={() => onRepeaterAction(name, 'add')}
            >
              <Plus size={16} /> Add Item
            </button>
          </div>
          {isInvalid && <span className="error-message" style={{ marginBottom: '1rem' }}>⚠️ {error}</span>}

          {list.map((itemValue, index) => (
            <div key={index} className="repeater-block">
              <div className="repeater-header">
                <span className="repeater-title">Item #{index + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => onRepeaterAction(name, 'remove', index)}
                >
                  <Trash2 size={16} /> <span style={{display: 'none'}}>Delete</span>
                </button>
              </div>
              {/* Render nested schema fields */}
              {itemSchema?.map(nestedField => {
                const compoundName = `${nestedField.name}`;
                // Get deeply nested errors if we had a flat error object (For simplicity, error is passed differently in repeater below)
                // Actually, our DynamicForm handles repeatable flatly vs nested. It's better to pass onChange as a closure for nested stuff.
                return (
                  <FieldRenderer
                    key={nestedField.name}
                    field={nestedField}
                    value={itemValue[nestedField.name]}
                    error={error?.[index]?.[nestedField.name]}
                    onChange={(fieldName, val) => {
                      onRepeaterAction(name, 'update', index, fieldName, val);
                    }}
                    onBlur={() => {}}
                  />
                );
              })}
            </div>
          ))}
        </div>
      );

    default:
      return <div className="form-group"><span className="error-message">Unsupported field type: {type}</span></div>;
  }
};
