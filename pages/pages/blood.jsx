import { Helmet } from 'react-helmet-async';

import { BloodView } from 'src/sections/blood';

// ----------------------------------------------------------------------

export default function LoginPage2() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <BloodView />
    </>
  );
}
