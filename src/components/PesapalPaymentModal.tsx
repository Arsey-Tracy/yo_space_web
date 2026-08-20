import React, { useState, useEffect } from 'react';
import { useInitiatePesapalPayment, useVerifyPesapalPayment, useSMSBundles } from '../features/wallet/hooks';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface PesapalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Bundle {
  id: number;
  name: string;
  sms_count: number;
  price: number;
  price_per_sms: number;
}

export const PesapalPaymentModal: React.FC<PesapalPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'bundle' | 'payment' | 'verify' | 'success'>('bundle');
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = React.useRef<number | null>(null);

  const { data: bundles = [] } = useSMSBundles();
  const initiateMutation = useInitiatePesapalPayment();
  const verifyMutation = useVerifyPesapalPayment();

  const handleSelectBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setCustomAmount('');
    setStep('payment');
  };

  const handleCustomAmount = () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setSelectedBundle(null);
    setStep('payment');
  };

  const handleInitiatePayment = async () => {
    if (!phoneNumber || !email) {
      setError('Please enter phone number and email');
      return;
    }

    const amount = selectedBundle ? selectedBundle.price : parseFloat(customAmount);
    if (!amount || amount <= 0) {
      setError('Invalid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await initiateMutation.mutateAsync({
        amount,
        phone_number: phoneNumber,
        email,
        bundle_id: selectedBundle?.id,
      });

      if (response.redirect_url) {
        setTrackingId(response.tracking_id);
        setRedirectUrl(response.redirect_url);
        setStep('verify');

        // Redirect to PesaPal
        window.open(response.redirect_url, '_blank');

        // Start polling for payment verification
        pollRef.current = window.setInterval(() => {
          verifyPayment(response.tracking_id);
        }, 5000);
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error initiating payment');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (tracking_id: string) => {
    try {
      const response = await verifyMutation.mutateAsync({
        tracking_id,
      });

      if (response.payment.status === 'completed') {
        if (pollRef.current) {
          window.clearInterval(pollRef.current);
          pollRef.current = null;
        }

        setStep('success');
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      } else if (response.payment.status === 'failed' || response.payment.status === 'cancelled') {
        if (pollRef.current) {
          window.clearInterval(pollRef.current);
          pollRef.current = null;
        }
        setError(`Payment ${response.payment.status}`);
        setStep('payment');
      }
    } catch (err: any) {
      // Continue polling on error
      console.error('Verification error:', err);
    }
  };

  const handleClose = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setStep('bundle');
    setSelectedBundle(null);
    setCustomAmount('');
    setPhoneNumber('');
    setEmail('');
    setRedirectUrl(null);
    setTrackingId(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Top Up Wallet</h2>
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

          {step === 'bundle' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-3">Select SMS Bundle</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bundles.map((bundle: Bundle) => (
                  <button
                    key={bundle.id}
                    onClick={() => handleSelectBundle(bundle)}
                    className="w-full p-3 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition text-left"
                  >
                    <div className="font-semibold">{bundle.name}</div>
                    <div className="text-sm text-gray-600">
                      {bundle.sms_count} SMS for UGX {bundle.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      UGX {bundle.price_per_sms.toFixed(2)}/SMS
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold mb-3">Or Enter Custom Amount</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount in UGX"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCustomAmount}
                    disabled={!customAmount || parseFloat(customAmount) <= 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>

              {selectedBundle && (
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-semibold">{selectedBundle.name}</div>
                  <div className="text-sm">UGX {selectedBundle.price}</div>
                </div>
              )}

              {customAmount && (
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-semibold">Custom Amount</div>
                  <div className="text-sm">UGX {customAmount}</div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="256xxxxxxxxx or +256xxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('bundle')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleInitiatePayment}
                  disabled={isLoading || !phoneNumber || !email}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Pay with PesaPal'}
                </Button>
              </div>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-blue-50 rounded">
                <div className="text-sm text-gray-600 mb-2">Redirecting to PesaPal...</div>
                <div className="text-xs text-gray-500">
                  A new window should open. If it doesn't, click below.
                </div>
              </div>

              {redirectUrl && (
                <Button
                  onClick={() => window.open(redirectUrl, '_blank')}
                  className="w-full"
                >
                  Open Payment Page
                </Button>
              )}

              <div className="text-sm text-gray-600">
                Verifying payment... (checking every 5 seconds)
              </div>

              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Close & Continue Later
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-xl font-bold text-green-600">Payment Successful!</h3>
              <p className="text-gray-600">
                Your wallet has been topped up with SMS credits.
              </p>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
