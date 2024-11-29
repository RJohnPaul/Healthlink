import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from 'src/_mock/user';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import clinicLogo from '../../components/logo/cliniclogo.png';
import stampImage from '../../components/logo/clinicstamp.png';

// Function to convert amount to words in Indian currency format
const convertAmountToWords = (amount) => {
  if (amount < 0) return false;
  const single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double_digit = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const below_hundred = [
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  if (amount === 0) return 'Zero Rupees';

  function translate(n) {
    let word = '';
    if (n < 10) {
      word = `${single_digit[n]} `;
    } else if (n < 20) {
      word = `${double_digit[n - 10]} `;
    } else if (n < 100) {
      const rem = translate(n % 10);
      word = `${below_hundred[(n - (n % 10)) / 10 - 2]} ${rem}`;
    } else if (n < 1000) {
      word = `${single_digit[Math.trunc(n / 100)]} Hundred ${translate(n % 100)}`;
    } else if (n < 10000) {
      word = `${single_digit[Math.trunc(n / 1000)]} Thousand ${translate(n % 1000)}`;
    } else if (n < 20000) {
      word = `Ten ${translate(n % 10000)}`;
    } else if (n < 100000) {
      word = `${translate(Math.trunc(n / 10000))} Ten Thousand ${translate(n % 10000)}`;
    } else if (n < 1000000) {
      word = `${translate(Math.trunc(n / 100000))} Lakh ${translate(n % 100000)}`;
    } else if (n < 10000000) {
      word = `${translate(Math.trunc(n / 1000000))} Ten Lakh ${translate(n % 1000000)}`;
    } else if (n < 100000000) {
      word = `${translate(Math.trunc(n / 10000000))} Crore ${translate(n % 10000000)}`;
    } else {
      word = `${translate(Math.trunc(n / 100000000))} Ten Crore ${translate(n % 100000000)}`;
    }
    return word;
  }

  const result = translate(amount);
  return `${result.trim()} Rupees Only`;
};

// Define styles for the invoice template with advanced CSS
const invoiceStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
    fontSize: 12,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  companyInfo: {
    flex: 1,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  companyAddress: {
    fontSize: 10,
    textAlign: 'center',
    color: '#555',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#555',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontWeight: 'bold',
    marginRight: 15,
    color: '#555',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#333',
    padding: 12,
    backgroundColor: '#fff',
    marginRight: 15,
  },
  amountText: {
    marginLeft: 15,
    flex: 1,
    fontStyle: 'italic',
  },
  paymentFor: {
    height: 70,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 12,
  },
  receivedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signatureContainer: {
    height: 180,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  stampImage: {
    width: 180,
    height: 180,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
    color: '#fff',
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerContact: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default function UserTableRow({ row, tableType }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from(tableType)
          .select('*')
          .eq('sno', row.sno)
          .single();
        if (error) {
          console.error('Error fetching user data:', error.message);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchData();
  }, [row.sno, tableType]);

  const ClinicInvoice = () => (
    <Document>
      <Page size="A4" style={invoiceStyles.page}>
        <View style={invoiceStyles.headerContainer}>
          <View style={invoiceStyles.logoContainer}>
            <Image source={clinicLogo} style={invoiceStyles.logo} />
          </View>
          <View style={invoiceStyles.companyInfo}>
            <Text style={invoiceStyles.companyName}>Healthlink Pro</Text>
            <Text style={invoiceStyles.companyAddress}>
              Madambakkam, Chennai - 600126
            </Text>
            <Text style={invoiceStyles.companyAddress}>
              (Near Bus Stop)
            </Text>
          </View>
        </View>
        <Text style={invoiceStyles.header}>PAYMENT RECEIPT</Text>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Serial.No</Text>
          <Text>{userData.sno}</Text>
        </View>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Date</Text>
          <Text>{userData.visit_1}</Text>
        </View>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Received From</Text>
          <Text>{userData.name}</Text>
        </View>
        <View style={invoiceStyles.amountContainer}>
          <Text style={invoiceStyles.amountLabel}>Amount</Text>
          <Text style={invoiceStyles.amountValue}>{userData.amount_paid}</Text>
          <Text style={invoiceStyles.amountText}>
            {convertAmountToWords(userData.amount_paid)}
          </Text>
        </View>
        <View style={invoiceStyles.paymentFor}>
          <Text style={invoiceStyles.label}>Payment For:</Text>
          <Text>{userData.treatment_plan}</Text>
        </View>
        <View style={invoiceStyles.receivedBy}>
          <Text style={invoiceStyles.label}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
          <View style={invoiceStyles.signatureContainer}>
            <Image source={stampImage} style={invoiceStyles.stampImage} />
          </View>
        </View>
        <View style={invoiceStyles.footer}>
          <Text style={invoiceStyles.footerText}>Thanks for visiting</Text>
          <Text style={invoiceStyles.footerContact}>
            Healthlink Pro Clinic | 97777 98888
          </Text>
        </View>
      </Page>
    </Document>
  );

  const RehabInvoice = () => (
    <Document>
      <Page size="A4" style={invoiceStyles.page}>
        <View style={invoiceStyles.headerContainer}>
          <View style={invoiceStyles.logoContainer}>
            <Image source={clinicLogo} style={invoiceStyles.logo} />
          </View>
          <View style={invoiceStyles.companyInfo}>
            <Text style={invoiceStyles.companyName}>Healthlink Pro</Text>
            <Text style={invoiceStyles.companyAddress}>
              Madambakkam, Chennai - 600126
            </Text>
            <Text style={invoiceStyles.companyAddress}>
              (Near Bus Stop)
            </Text>
          </View>
        </View>
        <Text style={invoiceStyles.header}>REHAB PAYMENT RECEIPT</Text>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Serial.No</Text>
          <Text>{userData.sno}</Text>
        </View>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Rehab Joined</Text>
          <Text>{userData.rehab_commencement_date}</Text>
        </View>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Rehab Finished</Text>
          <Text>{userData.rehab_last_date}</Text>
        </View>
        <View style={invoiceStyles.row}>
          <Text style={invoiceStyles.label}>Received From</Text>
          <Text>{userData.name}</Text>
        </View>
        <View style={invoiceStyles.amountContainer}>
          <Text style={invoiceStyles.amountLabel}>Amount</Text>
          <Text style={invoiceStyles.amountValue}>{userData.amount_paid}</Text>
          <Text style={invoiceStyles.amountText}>
            {convertAmountToWords(userData.amount_paid)}
          </Text>
        </View>
        <View style={invoiceStyles.paymentFor}>
          <Text style={invoiceStyles.label}>Payment For:</Text>
          <Text>{userData.treatment_plan}</Text>
        </View>
        <View style={invoiceStyles.receivedBy}>
          <Text style={invoiceStyles.label}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
          <View style={invoiceStyles.signatureContainer}>
            <Image source={stampImage} style={invoiceStyles.stampImage} />
          </View>
        </View>
        <View style={invoiceStyles.footer}>
          <Text style={invoiceStyles.footerText}>Thanks for visiting</Text>
          <Text style={invoiceStyles.footerContact}>
            Healthlink Pro Clinic | 97777 98888
          </Text>
        </View>
      </Page>
    </Document>
  );

  const renderCellContent = (key) => {
    const value = row[key];
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') return value.toString();
    return value || 'N/A';
  };

  const cellKeys = [
    'phone_number',
    'alternate_number',
    'sno',
    'name',
    'age',
    'occupation',
    'diagnosis',
    'treatment_plan',
    'staff_attended',
    'medical_history',
    'rehab_commencement_date',
    'rehab_last_date',
    'amount_paid',
    'days_attended',
  ];

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell padding="checkbox">
        <Checkbox />
      </TableCell>
      {cellKeys.map((key) => (
        <TableCell key={key}>{renderCellContent(key)}</TableCell>
      ))}
      <TableCell align="right"> </TableCell>
      <TableCell align="right">
        <IconButton>
          {userData ? (
            <PDFDownloadLink
              document={tableType === 'rehab' ? <RehabInvoice /> : <ClinicInvoice />}
              fileName={`${tableType}_bill_report_${row.sno}.pdf`}
            >
              {({ loading }) => (loading ? '' : <Iconify icon="eva:download-fill" />)}
            </PDFDownloadLink>
          ) : (
            <Iconify icon="eva:printer-fill" />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

UserTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  tableType: PropTypes.oneOf(['clinic', 'rehab']).isRequired,
};