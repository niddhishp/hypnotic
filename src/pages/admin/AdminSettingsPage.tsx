import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Shield,
  Bell,
  CreditCard,
  Mail,
  Database,
  Key,
  Globe,
  Save,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
          <p className="text-zinc-400">
            Configure platform settings and preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-orange-500 hover:bg-orange-600"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Platform Configuration</CardTitle>
              <CardDescription className="text-zinc-400">
                Basic platform settings and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Platform Name</Label>
                  <Input
                    defaultValue="Hypnotic"
                    className="border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Support Email</Label>
                  <Input
                    defaultValue="support@hypnotic.ai"
                    className="border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Platform Description</Label>
                <Input
                  defaultValue="AI Creative Operating System for modern creators"
                  className="border-zinc-800 bg-zinc-900 text-white"
                />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Maintenance Mode</p>
                    <p className="text-sm text-zinc-400">
                      Temporarily disable access to the platform
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">New User Registration</p>
                    <p className="text-sm text-zinc-400">
                      Allow new users to sign up
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Waitlist Mode</p>
                    <p className="text-sm text-zinc-400">
                      Put new registrations on a waitlist
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Regional Settings</CardTitle>
              <CardDescription className="text-zinc-400">
                Default language and timezone settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-800 bg-zinc-900">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-800 bg-zinc-900">
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                      <SelectItem value="cet">Central European</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-800 bg-zinc-900">
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Authentication</CardTitle>
              <CardDescription className="text-zinc-400">
                Configure login and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-zinc-400">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Social Login</p>
                    <p className="text-sm text-zinc-400">
                      Allow login with Google, GitHub, etc.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Email Verification</p>
                    <p className="text-sm text-zinc-400">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator className="bg-zinc-800" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Session Timeout (hours)</Label>
                  <Input
                    type="number"
                    defaultValue="24"
                    className="border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Max Login Attempts</Label>
                  <Input
                    type="number"
                    defaultValue="5"
                    className="border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-500" />
                API Keys
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Manage external service API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'OpenAI API Key', status: 'configured', mask: 'sk-...7f8a' },
                { name: 'Anthropic API Key', status: 'configured', mask: 'sk-...9b2c' },
                { name: 'Stability AI Key', status: 'missing', mask: 'Not set' },
                { name: 'ElevenLabs API Key', status: 'configured', mask: 'sk-...3d4e' },
              ].map((key) => (
                <div
                  key={key.name}
                  className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2">
                      <Key className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{key.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">{key.mask}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={key.status === 'configured' ? 'default' : 'secondary'}
                      className={
                        key.status === 'configured'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }
                    >
                      {key.status === 'configured' ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {key.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Pricing Plans</CardTitle>
              <CardDescription className="text-zinc-400">
                Configure subscription tiers and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Free', price: '$0', users: 245, status: 'active' },
                { name: 'Creator', price: '$29/mo', users: 189, status: 'active' },
                { name: 'Studio', price: '$99/mo', users: 87, status: 'active' },
                { name: 'Enterprise', price: 'Custom', users: 12, status: 'active' },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2">
                      <CreditCard className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{plan.name}</p>
                      <p className="text-xs text-zinc-500">{plan.users} subscribers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400">{plan.price}</span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400"
                    >
                      {plan.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Credit System</CardTitle>
              <CardDescription className="text-zinc-400">
                Configure credit packs and usage rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Credits per Image</Label>
                  <Input
                    type="number"
                    defaultValue="1"
                    className="border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Credits per Video (sec)</Label>
                  <Input
                    type="number"
                    defaultValue="2"
                    className="border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Credits per Audio (min)</Label>
                <Input
                  type="number"
                  defaultValue="3"
                  className="border-zinc-800 bg-zinc-900 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-500" />
                Email Notifications
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Configure automated email communications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Welcome Email', description: 'Sent to new users on signup', enabled: true },
                { name: 'Password Reset', description: 'Sent when user requests password reset', enabled: true },
                { name: 'Billing Receipts', description: 'Sent after successful payment', enabled: true },
                { name: 'Usage Alerts', description: 'Sent when user reaches 80% of credits', enabled: true },
                { name: 'Weekly Digest', description: 'Weekly activity summary', enabled: false },
                { name: 'Marketing Updates', description: 'Product updates and promotions', enabled: false },
              ].map((notification) => (
                <div
                  key={notification.name}
                  className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">{notification.name}</p>
                    <p className="text-xs text-zinc-500">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                Admin Alerts
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Notifications for platform events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'New User Signup', enabled: false },
                { name: 'Failed Payment', enabled: true },
                { name: 'High Error Rate', enabled: true },
                { name: 'Low Credit Balance', enabled: true },
                { name: 'System Maintenance', enabled: true },
              ].map((alert) => (
                <div
                  key={alert.name}
                  className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                >
                  <p className="text-sm text-white">{alert.name}</p>
                  <Switch defaultChecked={alert.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-500" />
                Connected Services
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Manage third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Stripe', description: 'Payment processing', status: 'connected', icon: CreditCard },
                { name: 'SendGrid', description: 'Email delivery', status: 'connected', icon: Mail },
                { name: 'Cloudflare', description: 'CDN & Security', status: 'connected', icon: Globe },
                { name: 'Sentry', description: 'Error tracking', status: 'disconnected', icon: AlertTriangle },
              ].map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2">
                      <service.icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{service.name}</p>
                      <p className="text-xs text-zinc-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={service.status === 'connected' ? 'default' : 'secondary'}
                      className={
                        service.status === 'connected'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }
                    >
                      {service.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-zinc-400">
                      {service.status === 'connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Webhook Endpoints</CardTitle>
              <CardDescription className="text-zinc-400">
                Configure webhook URLs for events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Stripe Webhook URL</Label>
                <Input
                  defaultValue="https://api.hypnotic.ai/webhooks/stripe"
                  className="border-zinc-800 bg-zinc-900 text-white"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Custom Webhook URL</Label>
                <Input
                  placeholder="https://your-app.com/webhook"
                  className="border-zinc-800 bg-zinc-900 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
