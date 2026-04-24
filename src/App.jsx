import React, { useState } from 'react';
import axios from 'axios';
import { DynamicForm } from './components/DynamicForm';
import { FieldBuilder } from './components/FieldBuilder';
import { SubmissionsView } from './components/SubmissionsView';
import { sampleFormSchema } from './schema/sampleConfig';
import { Trash2, Settings, Layers, LayoutTemplate, Database } from 'lucide-react';

function App() {
  const [schema, setSchema] = useState(sampleFormSchema);
  const [submittedData, setSubmittedData] = useState(null);
  const [activeTab, setActiveTab] = useState('build'); // 'build' | 'schema'
  const [viewMode, setViewMode] = useState('builder'); // 'builder' | 'submissions'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // The API_URL checks for a production environment variable. 
      // If it's not set (e.g. running locally), it uses the relative path '/api/form', 
      // which Vite will proxy to the Express backend at http://localhost:5000.
      const API_URL = import.meta.env.VITE_API_URL || '/api/form';
      const res = await axios.post(API_URL, data);
      console.log("Form successfully submitted:", res.data);
      setSubmittedData(data);
    } catch (err) {
      console.error("Submission error", err);
      setSubmitError("Failed to submit form to backend. Ensure MongoDB and Express are running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddField = (newField) => {
    setSchema((prev) => [...prev, newField]);
    setActiveTab('schema');
  };

  const handleRemoveField = (fieldName) => {
    setSchema((prev) => prev.filter((f) => f.name !== fieldName));
  };

  return (
    <div className="workspace">
      {/* Top Navigation */}
      <header className="workspace-header">
        <div className="logo">
          <LayoutTemplate size={24} className="text-primary" />
          <span>Form Architect</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className={`btn ${viewMode === 'builder' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setViewMode('builder')}
          >
            Form Builder
          </button>
          <button 
            className={`btn ${viewMode === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onClick={() => setViewMode('submissions')}
          >
            <Database size={16} /> Submissions
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--panel-border)', margin: '0 0.5rem' }}></div>
          <button className="btn-icon text-muted" title="Settings"><Settings size={20} /></button>
        </div>
      </header>

      <div className="workspace-body">
        {/* Left Sidebar - Only show in builder mode */}
        {viewMode === 'builder' && (
          <aside className="workspace-sidebar">
            <div className="sidebar-tabs">
              <button 
                className={`tab-btn ${activeTab === 'build' ? 'active' : ''}`}
                onClick={() => setActiveTab('build')}
              >
                <PlusIcon /> Add Field
              </button>
              <button 
                className={`tab-btn ${activeTab === 'schema' ? 'active' : ''}`}
                onClick={() => setActiveTab('schema')}
              >
                <Layers size={16} /> Schema ({schema.length})
              </button>
            </div>

            <div className="sidebar-content">
              {activeTab === 'build' && (
                <FieldBuilder onAddField={handleAddField} />
              )}

              {activeTab === 'schema' && (
                <div className="schema-manager">
                  {schema.length === 0 ? (
                    <div className="empty-state">
                      <p className="text-muted">Your form has no fields.</p>
                      <button className="btn btn-secondary mt-3" onClick={() => setActiveTab('build')}>Add your first field</button>
                    </div>
                  ) : (
                    <ul className="schema-list">
                      {schema.map((field) => (
                        <li key={field.name} className="schema-item">
                          <div className="schema-item-info">
                            <strong>{field.label}</strong>
                            <span className="field-meta">{field.type} {field.rules?.required ? '• Required' : ''}</span>
                            <code className="field-key">{field.name}</code>
                          </div>
                          <button 
                            className="btn-icon btn-danger-icon" 
                            onClick={() => handleRemoveField(field.name)}
                            title="Remove Field"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main Canvas */}
        <main className="workspace-canvas">
          <div className="canvas-container" style={viewMode === 'submissions' ? { maxWidth: '1000px' } : {}}>
            
            {viewMode === 'builder' ? (
              <>
                <div className="canvas-header">
                  <h2>Form Preview</h2>
                  <p className="text-muted">This is how your users will see the form. Submitting will save to the MongoDB backend.</p>
                </div>
                
                <div className="canvas-card">
                  {schema.length > 0 ? (
                    <DynamicForm schema={schema} onSubmit={handleSubmit} />
                  ) : (
                    <div className="empty-state text-center py-5">
                      <LayoutTemplate size={48} className="text-muted mb-3 mx-auto" style={{ opacity: 0.5 }} />
                      <p className="text-muted">The canvas is empty. Add fields from the sidebar to start building.</p>
                    </div>
                  )}

                  {isSubmitting && <div className="text-primary mt-3 text-center">Submitting to database...</div>}
                  {submitError && <div className="error-message mt-3" style={{justifyContent: 'center'}}>{submitError}</div>}
                </div>
                
                {submittedData && !submitError && (
                  <div className="json-preview" style={{borderColor: 'var(--success-color)'}}>
                    <h3 style={{color: 'var(--success-color)'}}>Successfully Saved to Backend!</h3>
                    <p className="text-muted" style={{fontSize: '0.8rem', marginBottom: '1rem'}}>You can view this payload in the "Submissions" tab.</p>
                    <pre>
                      {JSON.stringify(submittedData, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <SubmissionsView />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

// Helper icon component
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default App;
