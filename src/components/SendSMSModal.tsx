import React, { useState } from 'react';
import { useSendSMS, useWalletBalance } from '../features/wallet/hooks';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface SendSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  spaceId?: number;
  defaultRecipients?: string[];
}

export const SendSMSModal: React.FC<SendSMSModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  spaceId,
  defaultRecipients = [],
}) => {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState(defaultRecipients.join('\n'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: wallet } = useWalletBalance();
  const sendSMSMutation = useSendSMS();

  const handleSendSMS = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    const recipientList = recipients
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r);

    if (recipientList.length === 0) {
      setError('Please enter at least one recipient');
      return;
    }

    if (!wallet || wallet.sms_balance < recipientList.length) {
      setError(
        `Insufficient balance. Required: ${recipientList.length}, Available: ${
          wallet?.sms_balance || 0
        }`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendSMSMutation.mutateAsync({
        recipients: recipientList,
        message,
        space_id: spaceId,
      });

      setResult(response);
      setSuccess(true);

      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error sending SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setRecipients(defaultRecipients.join('\n'));
    setError(null);
    setSuccess(false);
    setResult(null);
    onClose();
  };

  const recipientCount = recipients
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Send SMS</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && !error && (
            <div className="space-y-4 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-xl font-bold text-green-600">SMS Sent Successfully!</h3>
              <p className="text-gray-600">
                Sent to {result?.recipients_count} recipient(s).
              </p>
              <p className="text-sm text-gray-500">
                Credits deducted: {result?.credits_deducted}
              </p>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}

          {!success && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm font-medium text-gray-700">
                  Balance: <span className="font-bold">{wallet?.sms_balance || 0}</span> SMS
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  placeholder="Enter your SMS message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {message.length} characters
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipients (one per line)
                </label>
                <textarea
                  placeholder="256xxxxxxxxx&#10;+256xxxxxxxxx&#10;..."
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {recipientCount} recipient(s) - Cost: {recipientCount} SMS credit(s)
                </div>
              </div>

              {recipientCount > 0 && wallet && recipientCount > wallet.sms_balance && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  Insufficient balance for {recipientCount} recipients.
                  <br />
                  Required: {recipientCount}, Available: {wallet.sms_balance}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendSMS}
                  disabled={
                    isLoading ||
                    !message.trim() ||
                    recipientCount === 0 ||
                    (wallet && recipientCount > wallet.sms_balance)
                  }
                  className="flex-1"
                >
                  {isLoading ? 'Sending...' : 'Send SMS'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
