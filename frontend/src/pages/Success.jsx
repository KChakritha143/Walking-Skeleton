import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
const Success = () => {
  const { authFetch, upgradeUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 
  const [errorMsg, setErrorMsg] = useState('');
  const sessionId = searchParams.get('session_id');
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('error');
        setErrorMsg('Invalid session identifier.');
        return;
      }
      try {
        const response = await authFetch(`${API_BASE_URL}/payments/verify-session`, {
          method: 'POST',
          body: JSON.stringify({ sessionId })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setStatus('success');
          upgradeUser(true);
          const timer = setTimeout(() => {
            navigate('/');
          }, 4000);
          return () => clearTimeout(timer);
        } else {
          setStatus('error');
          setErrorMsg(data.message || 'Verification failed. Please contact support.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during verification.');
      }
    };
    verifyPayment();
  }, [sessionId, authFetch, upgradeUser, navigate]);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#1a1a24',
        border: '1px solid #2d2d3d',
        padding: '3rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        {status === 'loading' && (
          <div>
            <Loader2 size={64} className="spinner" style={{ color: '#a855f7', margin: '0 auto 1.5rem auto', animation: 'spin 2s linear infinite' }} />
            <h2 style={{ color: '#f3f4f6' }}>Verifying Transaction</h2>
            <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>We are securing your subscription details. Please do not close or reload this page.</p>
          </div>
        )}
        {status === 'success' && (
          <div>
            <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ color: '#f3f4f6', margin: '0 0 0.5rem 0' }}>Subscription Activated!</h2>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1.5rem'
            }}>
              PRO MEMBER 👑
            </div>
            <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
              Congratulations! Your payment has been processed successfully. You now have unlimited access to premium features.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '1.5rem' }}>
              Redirecting you to your user space shortly...
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-primary"
              style={{ marginTop: '2rem', width: '100%', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', border: 'none' }}
            >
              Go to Workspace Now
            </button>
          </div>
        )}
        {status === 'error' && (
          <div>
            <AlertTriangle size={64} style={{ color: '#ef4444', margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ color: '#f3f4f6' }}>Verification Failed</h2>
            <p style={{ color: '#f87171', marginTop: '0.5rem', fontWeight: '500' }}>{errorMsg}</p>
            <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.9rem' }}>If you believe this is an error, please reach out to our billing support department.</p>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-secondary"
              style={{ marginTop: '2rem', width: '100%' }}
            >
              Return to Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Success;