import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/main',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Patients Data',
    path: '/patient',
    icon: icon('ic_user'),
  },
  {
    title: 'Rehab Patients',
    path: '/rehab',
    icon: icon('ic_user'),
  },
  {
    title: 'Payments & Bills',
    path: '/bill',
    icon: icon('ic_cart'),
  },
  {
    title: 'Medical Certificate',
    path: '/medical',
    icon: icon('ic_cart'),
  },
  {
    title: 'Blood Bank',
    path: '/bloody',
    icon: icon('ic_user'),
  },
  {
    title: 'Insurance',
    path: '/insurance',
    icon: icon('ic_user'),
  },
  {
    title: 'Staff Record',
    path: '/blog',
    icon: icon('ic_user'),
  },
  
];

export default navConfig;
