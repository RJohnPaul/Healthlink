import { Helmet } from 'react-helmet-async';

import { BloodView } from 'src/sections/blood/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <BloodView />
    </>
  );
}
