import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Eye, EyeOff, MapPin, Check } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../../components/ui';
import { useAuth } from '../../hooks';

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    zipCode: '',
    phone: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      setStep(2);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      businessName: formData.businessName,
      zipCode: formData.zipCode,
      phone: formData.phone,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  const features = [
    'Track inventory in real-time',
    'AI-powered reorder suggestions',
    'Find local beauty suppliers',
    'Weekly analytics reports',
  ];

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-rose-500 to-rose-700 p-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NailPro</span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white">
            Streamline your nail salon inventory
          </h2>
          <p className="mt-4 text-lg text-rose-100">
            Join hundreds of salon owners in NJ/NY who save time and money with smart inventory management.
          </p>

          <div className="mt-8 space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-rose-50">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-rose-200">
          Trusted by 500+ salons in New Jersey and New York
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-slate-500">
              {step === 1 ? 'Enter your personal details' : 'Set up your business'}
            </p>
          </div>

          <div className="mb-6 flex gap-2">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-slate-200'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-slate-200'}`} />
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          First Name
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Last Name
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          placeholder="Create a strong password"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Business Name
                      </label>
                      <Input
                        value={formData.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                        placeholder="Your Nail Salon Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        ZIP Code
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={formData.zipCode}
                          onChange={(e) => updateField('zipCode', e.target.value)}
                          placeholder="07753"
                          className="pl-10"
                          required
                          pattern="[0-9]{5}"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        We'll find local suppliers in your area
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Phone (Optional)
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button type="submit" className="flex-1" isLoading={isLoading}>
                    {step === 1 ? 'Continue' : 'Create Account'}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-rose-600 hover:text-rose-700">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
