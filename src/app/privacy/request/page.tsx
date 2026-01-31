'use client';

import { useState } from 'react';

export default function DataRequestPage() {
  const [email, setEmail] = useState('');
  const [requestType, setRequestType] = useState<'deletion' | 'access'>('deletion');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const endpoint = requestType === 'deletion'
        ? 'https://email-sender-53995941986.asia-northeast3.run.app/api/data-deletion'
        : 'https://email-sender-53995941986.asia-northeast3.run.app/api/data-access';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Privacy Request</h1>
          <p className="text-gray-600 mb-6">
            Exercise your data privacy rights under GDPR and other applicable regulations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="requestType"
                    value="deletion"
                    checked={requestType === 'deletion'}
                    onChange={(e) => setRequestType(e.target.value as 'deletion')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Delete My Data</div>
                    <div className="text-sm text-gray-600">
                      Permanently delete all personal data associated with your email address
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="requestType"
                    value="access"
                    checked={requestType === 'access'}
                    onChange={(e) => setRequestType(e.target.value as 'access')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Access My Data</div>
                    <div className="text-sm text-gray-600">
                      View all personal data we have stored about you
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : `Submit ${requestType === 'deletion' ? 'Deletion' : 'Access'} Request`}
            </button>
          </form>

          {/* Result Display */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? '✓ Success' : '✗ Error'}
              </h3>
              <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.message}
              </p>

              {/* Display data for access requests */}
              {result.success && requestType === 'access' && result.data && result.data.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Your Data:</h4>
                  <div className="bg-white p-3 rounded border border-gray-200 max-h-96 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(result.data, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `irunica-data-${email}-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Download as JSON
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Deletion requests are processed immediately and cannot be undone</li>
              <li>• Access requests show all data we currently have in our system</li>
              <li>• Both requests are logged for compliance purposes</li>
              <li>• For questions, contact: <a href="mailto:privacy@irunica.com" className="underline">privacy@irunica.com</a></li>
            </ul>
          </div>

          {/* Back to Privacy Policy */}
          <div className="mt-6 text-center">
            <a href="/privacy" className="text-blue-600 hover:underline text-sm">
              ← Back to Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
