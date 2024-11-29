import { Helmet } from 'react-helmet-async';

import { RegularView } from 'src/sections/Regular/view';

// ----------------------------------------------------------------------

export default function RegularPage() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <RegularView />
    </>
  );
}
