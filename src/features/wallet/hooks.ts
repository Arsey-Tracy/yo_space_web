import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => (await apiClient.get('/billing/wallet/balance/')).data,
    staleTime: 1000 * 30,
  });
}

export function useTopUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/api/wallet/topup/', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallet', 'balance'] }),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: async () => (await apiClient.get('/api/wallet/transactions/')).data,
  });
}

// PesaPal Payment Hooks
export interface InitiatePesapalPaymentInput {
  amount: number;
  phone_number: string;
  email?: string;
  description?: string;
  bundle_id?: number;
}

export interface VerifyPesapalPaymentInput {
  tracking_id: string;
}

export function useInitiatePesapalPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InitiatePesapalPaymentInput) =>
      apiClient.post('/billing/pesapal/initiate/', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      qc.invalidateQueries({ queryKey: ['wallet', 'purchases'] });
    },
  });
}

export function useVerifyPesapalPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyPesapalPaymentInput) =>
      apiClient.post('/billing/pesapal/verify/', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      qc.invalidateQueries({ queryKey: ['wallet', 'purchases'] });
    },
  });
}

export function useSMSBundles() {
  return useQuery({
    queryKey: ['sms', 'bundles'],
    queryFn: async () => (await apiClient.get('/billing/sms-bundles/')).data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePurchaseHistory() {
  return useQuery({
    queryKey: ['wallet', 'purchases'],
    queryFn: async () => (await apiClient.get('/billing/sms-purchases/')).data,
    staleTime: 1000 * 30,
  });
}

// SMS Sending Hook
export interface SendSMSInput {
  recipients: string[];
  message: string;
  space_id?: number;
  broadcast_id?: string;
}

export function useSendSMS() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SendSMSInput) =>
      apiClient.post('/api/wallet/sms/send/', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      qc.invalidateQueries({ queryKey: ['sms', 'usage'] });
    },
  });
}
