import { DashboardLayout } from '../components/dashboard/dashboard-layout';

export const withDashboardLayout = (Component) => (props) => (
  <DashboardLayout>
    <Component {...props} />
  </DashboardLayout>
);
