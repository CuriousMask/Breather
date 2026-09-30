import React, { useState } from 'react';
import styles from './InputField.module.css';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required,
  autoComplete,
  icon,
  hint,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`${styles.group} ${error ? styles.hasError : ''}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>
      )}

      <div className={styles.inputWrap}>
        {icon && <span className={styles.leadIcon} aria-hidden="true">{icon}</span>}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={`${styles.input} ${icon ? styles.withIcon : ''} ${isPassword ? styles.withToggle : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${name}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default InputField;
