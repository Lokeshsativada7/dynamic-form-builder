import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const SubmissionsView = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      // The API_URL checks for a production environment variable.
      // Locally, it uses the relative path which Vite proxies to Express.
      const API_URL = import.meta.env.VITE_API_URL || '/api/form';
      const res = await axios.get(API_URL);
      setSubmissions(res.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to fetch submissions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-5 text-center text-muted">Loading submissions...</div>;
  if (error) return <div className="py-5 text-center" style={{color: 'var(--danger-color)'}}>{error}</div>;

  return (
    <div className="submissions-container">
      {submissions.length === 0 ? (
        <p className="text-muted">No submissions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map((sub) => (
            <div key={sub._id} style={{ background: '#fff', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Submitted: {new Date(sub.submittedAt).toLocaleString()}
                </span>
              </div>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary-color)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(sub.formData, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
