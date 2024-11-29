import { Helmet } from 'react-helmet-async';

import { ReceiptView } from 'src/sections/receipt';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>

      <ReceiptView />
    </>
  );
}
