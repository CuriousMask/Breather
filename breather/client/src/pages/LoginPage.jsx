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
  if (!values.email)               errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Enter a valid email';
  if (!values.password)            errors.password = 'Password is required';
  return errors;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [serverError, setServerError] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm({ email: '', password: '' }, validate);

  const onSubmit = async (vals) => {
    setServerError('');
    const result = await login(vals.email, vals.password);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back 🌿"
      subtitle="Sign in to return to your peaceful space"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.fields}>
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
            placeholder="Your password"
            autoComplete="current-password"
            icon="🔒"
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

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className={styles.submitBtn}
        >
          Sign In
        </Button>
      </form>

      {/* ── Divider ── */}
      <div className={styles.divider}>
        <span />
        <p>New to Breather?</p>
        <span />
      </div>

      <Link to="/register" className={styles.switchLink}>
        Create an account
      </Link>

      {/* ── Demo hint ── */}
      <motion.div
        className={styles.demoHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>🎯 Demo: <strong>alex@breather.app</strong> / <strong>password123</strong></p>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;
