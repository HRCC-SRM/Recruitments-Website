"use client"

import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import the actual dashboard components
import TechnicalAdminDashboard from './technical/page';
import CorporateAdminDashboard from './corporate/page';
import CreativesAdminDashboard from './creatives/page';

export default function DashboardPage() {
  const { admin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!admin) return null;

  // For super admin, show the main dashboard with links
  if (admin.role === 'super_admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">HRCC Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {admin.username} ({admin.role.replace('_', ' ')})
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Dashboard</CardTitle>
                  <CardDescription>
                    Manage technical domain applications and candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/technical">
                    <Button className="w-full">Access Technical Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Creative Dashboard</CardTitle>
                  <CardDescription>
                    Manage creative domain applications and candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/creatives">
                    <Button className="w-full">Access Creative Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corporate Dashboard</CardTitle>
                  <CardDescription>
                    Manage corporate domain applications and candidates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/dashboard/corporate">
                    <Button className="w-full">Access Corporate Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // For domain-specific admins, render their specific dashboard directly
  switch (admin.role) {
    case 'technical_lead':
      return <TechnicalAdminDashboard />;
    case 'creative_lead':
      return <CreativesAdminDashboard />;
    case 'corporate_lead':
      return <CorporateAdminDashboard />;
    default:
      return (
        <ProtectedRoute>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have permission to access this dashboard.
              </p>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </ProtectedRoute>
      );
  }
}
