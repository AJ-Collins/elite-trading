
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <Button className="bg-primary">Save Changes</Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Site Configuration</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="site-name" className="text-sm font-medium">
                    Site Name
                  </label>
                  <Input
                    id="site-name"
                    placeholder="Trading Education Platform"
                    defaultValue="Trading Education Platform"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="site-tagline" className="text-sm font-medium">
                    Tagline
                  </label>
                  <Input
                    id="site-tagline"
                    placeholder="Learn to trade like a pro"
                    defaultValue="Learn to trade like a pro"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="site-description" className="text-sm font-medium">
                  Site Description
                </label>
                <Input
                  id="site-description"
                  placeholder="A platform for learning trading strategies and techniques"
                  defaultValue="A platform for learning trading strategies and techniques"
                />
                <p className="text-xs text-muted-foreground">
                  This description will be used for SEO purposes.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="maintenance-mode" className="text-sm font-medium">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Temporarily disable the site for maintenance.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Membership Tiers</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Free Tier</h4>
                    <p className="text-sm text-muted-foreground">
                      Basic access with limited content
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Premium Tier</h4>
                    <p className="text-sm text-muted-foreground">
                      Full access to all content and features
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="mt-4">
                  <label htmlFor="premium-price" className="text-sm font-medium block mb-1">
                    Monthly Price
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input
                      id="premium-price"
                      className="w-24"
                      defaultValue="49.99"
                    />
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pro Trader Tier</h4>
                    <p className="text-sm text-muted-foreground">
                      Premium content plus live trading sessions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="mt-4">
                  <label htmlFor="pro-price" className="text-sm font-medium block mb-1">
                    Monthly Price
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input
                      id="pro-price"
                      className="w-24"
                      defaultValue="99.99"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Payment Integration</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="stripe-key" className="text-sm font-medium">
                  Stripe API Key
                </label>
                <Input
                  id="stripe-key"
                  type="password"
                  placeholder="Enter your Stripe API key"
                  defaultValue="sk_test_****************************"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="stripe-webhook" className="text-sm font-medium">
                  Stripe Webhook Secret
                </label>
                <Input
                  id="stripe-webhook"
                  type="password"
                  placeholder="Enter your Stripe webhook secret"
                  defaultValue="whsec_****************************"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="test-mode" className="text-sm font-medium">
                    Test Mode
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Enable test mode for payment processing.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
