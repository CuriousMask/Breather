import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import styles from './AuthPage.module.css';

const validate = (values) => {
  const errors = {};
  if (!values.name)                    errors.name = 'Name is required';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!values.email)                   errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Enter a valid email';
  if (!values.password)                errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (!values.confirmPassword)         errors.confirmPassword = 'Please confirm your password';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [serverError, setServerError] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm({ name: '', email: '', password: '', confirmPassword: '' }, validate);

  const onSubmit = async (vals) => {
    setServerError('');
    const result = await register(vals.name, vals.email, vals.password);
    if (result.success) {
      navigate('/experiences', { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <AuthLayout
      title="Begin your journey 🌱"
      subtitle="Create your free account and find your calm"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.fields}>
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            placeholder="Alex Rivera"
            autoComplete="name"
            icon="👤"
            required
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            placeholder="you@example.com"
            autoComplete="email"
            icon="✉️"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            icon="🔒"
            hint="Use a mix of letters and numbers"
            required
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && errors.confirmPassword}
            placeholder="Repeat your password"
            autoComplete="new-password"
            icon="🔑"
            required
          />
        </div>

        {serverError && (
          <motion.div
            className={styles.serverError}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
          >
            <span>⚠️</span> {serverError}
          </motion.div>
        )}

        {/* ── Password strength indicator ── */}
        {values.password && (
          <PasswordStrength password={values.password} />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className={styles.submitBtn}
        >
          Create Account
        </Button>
      </form>

      {/* ── Terms note ── */}
      <p className={styles.terms}>
        By creating an account you agree to use Breather responsibly.
      </p>

      {/* ── Divider ── */}
      <div className={styles.divider}>
        <span />
        <p>Already have an account?</p>
        <span />
      </div>

      <Link to="/login" className={styles.switchLink}>
        Sign in instead
      </Link>
    </AuthLayout>
  );
};

// ── Password Strength Sub-component ──
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = ['', '#ef7070', '#f5c864', '#7da7d9', '#a5c89f', '#6db97f'];

const PasswordStrength = ({ password }) => {
  const score = getStrength(password);
  return (
    <div className={styles.strength}>
      <div className={styles.strengthBars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={styles.strengthBar}
            style={{
              background: i <= score ? STRENGTH_COLORS[score] : 'var(--color-border)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
      {score > 0 && (
        <span
          className={styles.strengthLabel}
          style={{ color: STRENGTH_COLORS[score] }}
        >
          {STRENGTH_LABELS[score]}
        </span>
      )}
    </div>
  );
};

export default RegisterPage;
