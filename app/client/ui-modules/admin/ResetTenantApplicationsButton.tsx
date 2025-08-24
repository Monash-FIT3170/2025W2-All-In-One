import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export function ResetTenantApplicationsButton() {
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all tenant applications? This action cannot be undone.')) {
      return;
    }

    setIsResetting(true);
    setMessage('');

    try {
      await new Promise((resolve, reject) => {
        Meteor.call('resetTenantApplications', (error: any, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      setMessage('✅ Tenant applications reset successfully!');
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Reset Tenant Applications</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will remove all tenant applications from the database. Use with caution.
      </p>

      <button
        onClick={handleReset}
        disabled={isResetting}
        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {isResetting ? 'Resetting...' : 'Reset Tenant Applications'}
      </button>

      {message && (
        <p className={`mt-2 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
