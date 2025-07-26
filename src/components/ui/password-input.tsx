import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  toggleIconPosition?: 'left' | 'right';
}

export const PasswordInput = ({ toggleIconPosition = 'right', ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="relative">
      {toggleIconPosition === 'left' && (
        <Button type="button" variant="ghost" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={togglePassword} tabIndex={-1}>
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      )}
      <Input type={showPassword ? 'text' : 'password'} className={`pr-10 ${toggleIconPosition === 'left' ? 'pl-10' : ''}`} {...props} />
      {toggleIconPosition === 'right' && (
        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2" onClick={togglePassword} tabIndex={-1}>
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
};
