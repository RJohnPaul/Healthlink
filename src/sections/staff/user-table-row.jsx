import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from 'src/_mock/user';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { styles } from './styles';

// Load custom fonts
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

Font.register({
  family: 'RobotoBold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

// Import styles from styles.js


export default function UserTableRow({ row, filterName }) {
  const [userData, setUserData] = useState(null);

  const highlightText = (text) => {
    if (!filterName) return text;
    const matchRegex = new RegExp(filterName, 'gi');
    const parts = text.split(matchRegex);
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === filterName.toLowerCase() ? <mark key={index}>{part}</mark> : part
        )}
      </span>
    );
  };

  const handlePrintAndDownload = async () => {
    try {
      const { data, error } = await supabase
        .from('rehab')
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

  const {
    date,
    name,
    age,
    occupation,
    diagnosis,
    treatment_plan,
    staff_attended,
    medical_history,
    rehab_commencement_date,
    rehab_last_date,
    amount_paid,
    days_attended,
  } = userData || {};

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell padding="checkbox">
        <Checkbox />
      </TableCell>
      <TableCell>{row.sno}</TableCell>
      <TableCell>{row.date}</TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.age}</TableCell>
      <TableCell>{row.occupation}</TableCell>
      <TableCell>{row.diagnosis}</TableCell>
      <TableCell>{row.treatment_plan}</TableCell>
      <TableCell>{row.staff_attended}</TableCell>
      <TableCell>{row.medical_history}</TableCell>
      <TableCell>{row.rehab_commencement_date}</TableCell>
      <TableCell>{row.rehab_last_date}</TableCell>
      <TableCell>{row.amount_paid}</TableCell>
      <TableCell>{row.days_attended}</TableCell>
      <TableCell align="right">
        <IconButton onClick={handlePrintAndDownload}>
          {userData ? (
            <PDFDownloadLink
              document={
                <Document>
                  <Page size="A4" style={styles.page}>
                    <View style={styles.container}>
                      <View style={styles.brandSection}>
                        <Text style={styles.brandText}>Healthlink Pro</Text>
                      </View>
                      <View style={styles.bodySection}>
                        <Text style={styles.heading}>Bill Report</Text>
                        <View style={styles.section}>
                          <Text style={[styles.text, styles.bold]}>Date:</Text>
                          <Text style={styles.text}>{date}</Text>
                          <Text style={[styles.text, styles.bold]}>Name:</Text>
                          <Text style={styles.text}>{name}</Text>
                          <Text style={[styles.text, styles.bold]}>Age:</Text>
                          <Text style={styles.text}>{age}</Text>
                          <Text style={[styles.text, styles.bold]}>Occupation:</Text>
                          <Text style={styles.text}>{occupation}</Text>
                          <Text style={[styles.text, styles.bold]}>Diagnosis:</Text>
                          <Text style={styles.text}>{diagnosis}</Text>
                          <Text style={[styles.text, styles.bold]}>Treatment Plan:</Text>
                          <Text style={styles.text}>{treatment_plan}</Text>
                          <Text style={[styles.text, styles.bold]}>Physio Attended:</Text>
                          <Text style={styles.text}>{staff_attended}</Text>
                          <Text style={[styles.text, styles.bold]}>Medical History:</Text>
                          <Text style={styles.text}>{medical_history}</Text>
                        </View>
                        <View style={styles.billSection}>
                          <Text style={[styles.text, styles.bold]}>Rehab Commencement Date:</Text>
                          <Text style={styles.text}>{rehab_commencement_date}</Text>
                          <Text style={[styles.text, styles.bold]}>Rehab Last Date:</Text>
                          <Text style={styles.text}>{rehab_last_date}</Text>
                          <Text style={[styles.text, styles.bold]}>Amount Paid:</Text>
                          <Text style={styles.text}>{amount_paid}</Text>
                          <Text style={[styles.text, styles.bold]}>Days Attended:</Text>
                          <Text style={styles.text}>{days_attended}</Text>
                        </View>
                      </View>
                    </View>
                  </Page>
                </Document>
              }
              fileName={`bill_report_${row.sno}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? '' : <Iconify icon="eva:download-fill" />
              }
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
  filterName: PropTypes.string.isRequired,
};