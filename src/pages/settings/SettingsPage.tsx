import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette,
  Key,
  Mail,
  Smartphone,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const plans = [
  { id: 'starter', name: 'Starter', price: 19, credits: 50, features: ['3 projects', '5 Insight reports/month', 'Basic models'] },
  { id: 'pro', name: 'Pro', price: 49, credits: 200, features: ['Unlimited projects', 'All modules', 'Premium models', 'Priority support'], popular: true },
  { id: 'agency', name: 'Agency', price: 149, credits: 1000, features: ['5 team seats', 'White-label', 'API access', 'Dedicated manager'] },
];

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-1">Settings</h1>
        <p className="text-sm text-[#A7A7A7]">Manage your account and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0F0F11] border border-white/5">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white/10">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white/10">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="bg-[#0F0F11] border-white/5">
            <CardHeader>
              <CardTitle className="text-base font-medium text-[#F6F6F6]">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
                  <span className="text-2xl font-semibold text-[#0B0B0D]">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="border-white/10 text-[#F6F6F6] hover:bg-white/5">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#A7A7A7] mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] focus:outline-none focus:border-[#D8A34A]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A7A7A7] mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] focus:outline-none focus:border-[#D8A34A]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A7A7A7] mb-2">Company</label>
                  <input
                    type="text"
                    placeholder="Your company"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A7A7A7] mb-2">Role</label>
                  <input
                    type="text"
                    defaultValue={user?.role}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] focus:outline-none focus:border-[#D8A34A]/50"
                  />
                </div>
              </div>

              <Button className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-[#0F0F11] border-white/5">
            <CardHeader>
              <CardTitle className="text-base font-medium text-[#F6F6F6]">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', description: 'Receive updates about your projects', icon: Mail },
                { id: 'push', label: 'Push Notifications', description: 'Get real-time alerts in your browser', icon: Smartphone },
                { id: 'marketing', label: 'Marketing Emails', description: 'Product updates and tips', icon: Bell },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#A7A7A7]" />
                    <div>
                      <div className="text-sm font-medium text-[#F6F6F6]">{item.label}</div>
                      <div className="text-xs text-[#666]">{item.description}</div>
                    </div>
                  </div>
                  <div 
                    onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                    className={cn(
                      "w-12 h-6 rounded-full cursor-pointer transition-colors relative",
                      notifications[item.id as keyof typeof notifications] ? 'bg-[#D8A34A]' : 'bg-white/10'
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      notifications[item.id as keyof typeof notifications] ? 'left-7' : 'left-1'
                    )} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          {/* Current Plan */}
          <Card className="bg-[#0F0F11] border-white/5">
            <CardHeader>
              <CardTitle className="text-base font-medium text-[#F6F6F6]">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-[#D8A34A]/10 border border-[#D8A34A]/30 rounded-lg">
                <div>
                  <div className="text-lg font-medium text-[#D8A34A] capitalize">{user?.plan} Plan</div>
                  <div className="text-sm text-[#A7A7A7]">
                    {user?.credits} credits remaining
                  </div>
                </div>
                <Button variant="outline" className="border-[#D8A34A] text-[#D8A34A] hover:bg-[#D8A34A]/10">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Plans */}
          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={cn(
                  "bg-[#0F0F11] border-white/5",
                  plan.popular && "border-[#D8A34A]/50"
                )}
              >
                <CardContent className="p-5">
                  {plan.popular && (
                    <div className="mb-3 px-2 py-1 bg-[#D8A34A]/20 text-[#D8A34A] text-xs rounded-full inline-block">
                      Most Popular
                    </div>
                  )}
                  <div className="text-lg font-medium text-[#F6F6F6] mb-1">{plan.name}</div>
                  <div className="text-2xl font-semibold text-[#F6F6F6] mb-4">
                    ${plan.price}
                    <span className="text-sm text-[#666]">/month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#A7A7A7]">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? 'default' : 'outline'}
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
                        : "border-white/10 text-[#F6F6F6] hover:bg-white/5"
                    )}
                  >
                    {user?.plan === plan.id ? 'Current Plan' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-[#0F0F11] border-white/5">
            <CardHeader>
              <CardTitle className="text-base font-medium text-[#F6F6F6]">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-[#A7A7A7]" />
                    <div>
                      <div className="text-sm font-medium text-[#F6F6F6]">Password</div>
                      <div className="text-xs text-[#666]">Last changed 3 months ago</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-[#F6F6F6] hover:bg-white/5">
                    Change
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#A7A7A7]" />
                    <div>
                      <div className="text-sm font-medium text-[#F6F6F6]">Two-Factor Authentication</div>
                      <div className="text-xs text-[#666]">Add an extra layer of security</div>
                    </div>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-white/10 relative cursor-pointer">
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-[#A7A7A7]" />
                    <div>
                      <div className="text-sm font-medium text-[#F6F6F6]">API Keys</div>
                      <div className="text-xs text-[#666]">Manage your API access</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 text-[#F6F6F6] hover:bg-white/5">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
