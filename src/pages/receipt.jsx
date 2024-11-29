import { Helmet } from 'react-helmet-async';

import { ReceiptView } from 'src/sections/receipt/view';

// ----------------------------------------------------------------------

export default function ReceiptPage() {
  return (
    <>
      <Helmet>
        <title> Healthlink Pro </title>
      </Helmet>
      
      <ReceiptView />
    </>
  );
}