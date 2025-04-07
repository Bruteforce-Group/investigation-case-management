'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useZodForm } from '@/hooks/useFormValidation';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/lib/validation';
import Alert from '@/components/common/Alert';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

const resetPasswordSchema = z.object({
  email: emailSchema,
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, error: authError, loading } = useAuth();
  const router = useRouter();
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
  } = useZodForm(resetPasswordSchema, {
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(values.email);
      setResetSuccess(true);
      resetForm();
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Password reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {resetError && (
          <Alert
            type="error"
            message={resetError}
            onClose={() => setResetError(null)}
          />
        )}

        {resetSuccess && (
          <Alert
            type="success"
            message="Password reset instructions have been sent to your email address."
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || resetSuccess}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || resetSuccess
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <KeyRound className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {loading ? 'Sending...' : 'Send reset instructions'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
