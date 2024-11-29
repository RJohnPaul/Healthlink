import { Helmet } from 'react-helmet-async';

import { InsuranceView } from 'src/sections/insurance/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>
      
      <InsuranceView />
    </>
  );
}
