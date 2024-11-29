/* eslint-disable no-shadow */
import { useEffect, useState } from 'react';
import { supabase } from 'src/_mock/user';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';

export default function AppView() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyPatients, setDailyPatients] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [rehabPatients, setRehabPatients] = useState([]);
  const [regularPatients, setRegularPatients] = useState([]);
  const [ageGroups, setAgeGroups] = useState({
    preteen: 0,
    teens: 0,
    adults: 0,
    veryOld: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: clinicData, error: clinicError } = await supabase.from('clinic').select('*');
      const { data: rehabData, error: rehabError } = await supabase.from('rehab').select('*');

      if (clinicError) {
        console.error('Error fetching clinic data:', clinicError);
      }
      if (rehabError) {
        console.error('Error fetching rehab data:', rehabError);
      }

      if (clinicData && rehabData) {
        const allPatients = [...clinicData, ...rehabData];
        setTotalPatients(allPatients.length);

        const totalRevenue = allPatients.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);
        setTotalRevenue(totalRevenue || '0');

        const today = new Date().toISOString().slice(0, 10);
        const dailyPatients = allPatients.filter(
          (item) => item.visit_1?.slice(0, 10) === today
        ).length;
        setDailyPatients(dailyPatients || '0');

        const dailyRevenue = allPatients
          .filter((item) => item.visit_1?.slice(0, 10) === today)
          .reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);
        setDailyRevenue(dailyRevenue || '0');

        const rehabPatients = allPatients.filter((item) => item.staff_attended === 'Y');
        const regularPatients = allPatients.filter((item) => item.staff_attended === 'N');

        setRehabPatients(rehabPatients);
        setRegularPatients(regularPatients);

        const ageGroups = allPatients.reduce(
          (acc, curr) => {
            const age = curr.age;
            if (age >= 1 && age <= 12) {
              acc.preteen += 1;
            } else if (age >= 13 && age <= 18) {
              acc.teens += 1;
            } else if (age >= 19 && age <= 59) {
              acc.adults += 1;
            } else {
              acc.veryOld += 1;
            }
            return acc;
          },
          { preteen: 0, teens: 0, adults: 0, veryOld: 0 }
        );

        setAgeGroups(ageGroups);
      }

      const { data: staffData, error: staffError } = await supabase.from('staff').select('*');

      if (staffError) {
        console.error('Error fetching staff data:', staffError);
      } else {
        setTotalStaff(staffData.length || '0');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const labels = Array.from({ length: 11 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().slice(0, 10);
  });

  const regularPatientsCounts = {};
  const rehabPatientsCounts = {};

  labels.forEach((label) => {
    regularPatientsCounts[label] = 0;
    rehabPatientsCounts[label] = 0;
  });

  regularPatients.forEach((patient) => {
    const date = patient.visit_1?.slice(0, 10);
    if (date) {
      regularPatientsCounts[date] = (regularPatientsCounts[date] || 0) + 1;
    }
  });

  rehabPatients.forEach((patient) => {
    const date = patient.visit_1?.slice(0, 10);
    if (date) {
      rehabPatientsCounts[date] = (rehabPatientsCounts[date] || 0) + 1;
    }
  });

  const chartData = {
    labels,
    series: [
      {
        name: 'Regular',
        type: 'column',
        fill: 'solid',
        data: labels.map((label) => regularPatientsCounts[label]),
      },
      {
        name: 'Rehab',
        type: 'area',
        fill: 'gradient',
        data: labels.map((label) => rehabPatientsCounts[label]),
      },
    ],
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back to HealthlinkPro
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Daily Payments"
            total={dailyRevenue}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Patients"
            total={totalPatients}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Revenue"
            total={totalRevenue}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Staff"
            total={totalStaff}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits title="Patient Visits" subheader="Dates where patients visited" chart={chartData} />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Age Group"
            chart={{
              series: [
                { label: 'Preteen', value: ageGroups.preteen },
                { label: 'Teens', value: ageGroups.teens },
                { label: 'Adults', value: ageGroups.adults },
                { label: 'Very Old', value: ageGroups.veryOld },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}