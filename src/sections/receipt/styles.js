import { StyleSheet, Font } from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2',
});

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: '20px',
    fontFamily: 'Inter',
  },
  container: {
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  brandSection: {
    backgroundColor: '#aa1f34',
    padding: '10px 20px',
    marginBottom: '10px',
  },
  brandText: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  bodySection: {
    padding: '16px',
    border: '1px solid gray',
  },
  heading: {
    fontSize: '20px',
    marginBottom: '8px',
    textAlign: 'center',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: '10px',
  },
  text: {
    fontSize: '12px',
    marginBottom: '5px',
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  billSection: {
    marginTop: '10px',
  },
});