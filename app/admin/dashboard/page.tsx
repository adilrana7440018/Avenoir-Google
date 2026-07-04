import { getAdminData } from '@/app/actions/admin';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import Link from 'next/link';

export const metadata = {
  title: 'Operational Console',
  description: 'AERIS high-density logistics and analytics dashboard.',
};

export default async function AdminDashboardPage() {
  const adminData = await getAdminData();

  if (!adminData) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 max-w-sm space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest font-mono">
            Operational Error
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Failed to parse the system database logs. Verify local database schema and seeder records are synced.
          </p>
          <Link
            href="/"
            className="inline-block bg-text-primary hover:bg-accent-primary text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return <AdminDashboardClient initialData={adminData} />;
}
