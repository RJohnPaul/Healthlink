import { Helmet } from 'react-helmet-async';

import { RehabView } from 'src/sections/rehab/view';

// ----------------------------------------------------------------------

export default function RehabPage() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <RehabView />
    </>
  );
}
