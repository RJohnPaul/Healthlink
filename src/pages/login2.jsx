import { Helmet } from 'react-helmet-async';

import { LoginView2 } from 'src/sections/login2';

// ----------------------------------------------------------------------

export default function LoginPage2() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <LoginView2 />
    </>
  );
}
