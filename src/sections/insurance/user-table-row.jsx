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
import stampImage from '../../components/logo/clinicstamp.png';
import clinicLogo from '../../components/logo/cliniclogo.png';

// Define PDF Styles
const certificateStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    flexDirection: 'column',
    backgroundColor: '#fff',
    margin: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #000',
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  bodyContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  bodyText: {
    fontSize: 14,
    textAlign: 'justify',
    lineHeight: 1.8,
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  stamp: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  approvedBy: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
  },
});

// PDF Component Definition
const SickLeaveCertificate = ({ userData }) => (
  <Document>
    <Page size="A4" style={certificateStyles.page}>
      {/* Header Section */}
      <View style={certificateStyles.headerContainer}>
        <Image source={clinicLogo} style={certificateStyles.logo} />
        <Text style={certificateStyles.headerText}>Medical Certificate for Sick Leave</Text>
      </View>

      {/* Body Section */}
      <View style={certificateStyles.bodyContainer}>
        <Text style={certificateStyles.sectionHeader}>Patient Information</Text>
        <Text style={certificateStyles.bodyText}>
          Patient Name: <Text style={{ fontWeight: 'bold' }}>{userData?.name || 'PATIENT_NAME'}</Text>
        </Text>
        <Text style={certificateStyles.bodyText}>
          Serial No: <Text style={{ fontWeight: 'bold' }}>{userData?.sno || '12345'}</Text>
        </Text>

        <Text style={certificateStyles.sectionHeader}>Medical Examination Details</Text>
        <Text style={certificateStyles.bodyText}>
          This is to certify that the above individual underwent a thorough medical examination
          conducted on <Text style={{ fontWeight: 'bold' }}>{userData?.commencementDate || 'COMMENCEMENT_DATE'}</Text> by{' '}
          <Text style={{ fontWeight: 'bold' }}>{userData?.staffAttended || 'STAFF_ATTENDED'}</Text>. The patient is currently
          suffering from <Text style={{ fontWeight: 'bold' }}>{userData?.diagnosis || 'USER_DIAGNOSIS'}</Text>.
        </Text>
        <Text style={certificateStyles.bodyText}>
          The examiner has advised that the individual should be excused from company duties for a
          period of <Text style={{ fontWeight: 'bold' }}>{userData?.days || '3'}</Text> days in order to ensure their full
          recovery and maintain their health.
        </Text>
      </View>

      {/* Footer Section */}
      <View style={certificateStyles.footerContainer}>
        <Image source={stampImage} style={certificateStyles.stamp} />
        <Text style={certificateStyles.approvedBy}>Approved by Doctor at HealthLinkPro</Text>
      </View>
    </Page>
  </Document>
);

SickLeaveCertificate.propTypes = {
  userData: PropTypes.shape({
    name: PropTypes.string,
    sno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    commencementDate: PropTypes.string,
    staffAttended: PropTypes.string,
    diagnosis: PropTypes.string,
    days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default function UserTableRow({ row, tableType }) {
  const [userData, setUserData] = useState(null);
  const [fetching, setFetching] = useState(false);

  // Function to fetch user data when download is initiated
  const handleDownloadClick = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from(tableType)
        .select('*')
        .eq('sno', row.sno)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        // Mapping data to ensure proper details for PDF
        setUserData({
          name: data.name,
          sno: data.sno,
          commencementDate: tableType === 'clinic' ? data.visit_1 : data.rehab_commencement_date,
          staffAttended: data.staff_attended,
          diagnosis: data.diagnosis,
          days: data.days_attended || 3, // Use default if not available
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setFetching(false);
    }
  };

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
      <TableCell align="right">
        <IconButton onClick={handleDownloadClick}>
          {userData ? (
            <PDFDownloadLink
              document={<SickLeaveCertificate userData={userData} />}
              fileName={`sick_leave_certificate_${row.sno}.pdf`}
            >
              {({ loading }) => (loading ? 'Loading...' : <Iconify icon="eva:download-outline" />)}
            </PDFDownloadLink>
          ) : (
            <Iconify icon={fetching ? 'eva:clock-outline' : 'eva:download-outline'} />
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
