'use client';

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

function formatDisplayValue(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 8);
  if (!clean) return '';

  const parts: string[] = [];
  if (clean.length <= 4) {
    parts.push(clean);
  } else if (clean.length <= 6) {
    parts.push(clean.slice(0, 4), clean.slice(4));
  } else {
    parts.push(clean.slice(0, 4), clean.slice(4, 6), clean.slice(6));
  }

  return parts.join('-');
}

export function DateOfBirthInput({ value, onChange }: { value?: string; onChange: (val: string) => void }) {
  const [rawValue, setRawValue] = useState(() => value?.replace(/\D/g, '').slice(0, 8) || '');

  useEffect(() => {
    if (value) {
      setRawValue(value.replace(/\D/g, '').slice(0, 8));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setRawValue(raw);

    if (raw.length === 8) {
      const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      onChange(formatted);
    } else {
      onChange(''); // Incomplete or invalid
    }
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      maxLength={10}
      value={formatDisplayValue(rawValue)}
      onChange={handleChange}
      placeholder="YYYY-MM-DD"
      autoComplete="bday"
    />
  );
}
