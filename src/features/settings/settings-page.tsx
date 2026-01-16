import { useState } from 'react';
import {
  Building2,
  User,
  Bell,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Globe,
  Save,
} from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { useAuth } from '../../hooks';
import { cn } from '../../lib/utils';

type SettingsTab = 'business' | 'profile' | 'notifications' | 'billing';

export function SettingsPage() {
  const { profile, organization } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('business');
  const [isSaving, setIsSaving] = useState(false);

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const [businessForm, setBusinessForm] = useState({
    name: organization?.name || '',
    email: organization?.email || '',
    phone: organization?.phone || '',
    zip_code: organization?.zip_code || '',
    website: '',
  });

  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    email: '',
  });

  const [notifications, setNotifications] = useState({
    low_stock_email: true,
    low_stock_push: true,
    order_updates_email: true,
    order_updates_push: false,
    weekly_report_email: true,
    price_alerts_email: true,
    price_alerts_push: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="h-fit lg:w-64">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-rose-50 text-rose-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1">
          {activeTab === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Business Name
                  </label>
                  <Input
                    value={businessForm.name}
                    onChange={(e) =>
                      setBusinessForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Your Nail Salon"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      <Mail className="mr-1 inline h-4 w-4" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={businessForm.email}
                      onChange={(e) =>
                        setBusinessForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="contact@salon.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      <Phone className="mr-1 inline h-4 w-4" />
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={businessForm.phone}
                      onChange={(e) =>
                        setBusinessForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      <MapPin className="mr-1 inline h-4 w-4" />
                      ZIP Code
                    </label>
                    <Input
                      value={businessForm.zip_code}
                      onChange={(e) =>
                        setBusinessForm((prev) => ({ ...prev, zip_code: e.target.value }))
                      }
                      placeholder="07753"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      <Globe className="mr-1 inline h-4 w-4" />
                      Website
                    </label>
                    <Input
                      value={businessForm.website}
                      onChange={(e) =>
                        setBusinessForm((prev) => ({ ...prev, website: e.target.value }))
                      }
                      placeholder="https://yoursalon.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-2xl font-medium text-white">
                    {profileForm.first_name[0]}
                    {profileForm.last_name[0]}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      First Name
                    </label>
                    <Input
                      value={profileForm.first_name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, first_name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Last Name
                    </label>
                    <Input
                      value={profileForm.last_name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, last_name: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Low Stock Alerts</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Email notifications</p>
                      <p className="text-xs text-slate-500">
                        Receive emails when stock falls below reorder point
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.low_stock_email}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          low_stock_email: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Push notifications</p>
                      <p className="text-xs text-slate-500">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.low_stock_push}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          low_stock_push: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-slate-900">Order Updates</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Email notifications</p>
                      <p className="text-xs text-slate-500">
                        Updates on order status changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.order_updates_email}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          order_updates_email: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-slate-900">Reports</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Weekly summary email</p>
                      <p className="text-xs text-slate-500">
                        Receive a weekly inventory and spending summary
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.weekly_report_email}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          weekly_report_email: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-rose-900">Professional Plan</h3>
                      <p className="text-sm text-rose-700">$49/month - Up to 3 locations</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Payment Method</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-100">
                        <CreditCard className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Visa ending in 4242</p>
                        <p className="text-sm text-slate-500">Expires 12/2026</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Payment Method
                  </Button>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-medium text-slate-900">Billing History</h3>
                  <div className="space-y-2">
                    {[
                      { date: 'Jan 1, 2025', amount: '$49.00', status: 'Paid' },
                      { date: 'Dec 1, 2024', amount: '$49.00', status: 'Paid' },
                      { date: 'Nov 1, 2024', amount: '$49.00', status: 'Paid' },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{invoice.date}</p>
                          <p className="text-xs text-slate-500">{invoice.amount}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
