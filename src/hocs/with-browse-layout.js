import { BrowseLayout } from '../components/browse-layout';

export const withBrowseLayout = (Component) => (props) => (
  <BrowseLayout>
    <Component {...props} />
  </BrowseLayout>
);
