import { MainLayout } from '../components/main-layout';

export const withMainLayout = (Component) => (props) => (
  <MainLayout>
    <Component {...props} />
  </MainLayout>
);
