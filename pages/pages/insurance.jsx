import { Helmet } from 'react-helmet-async';

import { InsuranceView } from 'src/sections/insurance/view';

// ----------------------------------------------------------------------

export default function LoginPage2() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <InsuranceView />
    </>
  );
}