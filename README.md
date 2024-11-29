# HealthlinkPro

Welcome to **HealthlinkPro** – a comprehensive healthcare management system designed to streamline clinic operations. This README provides detailed instructions for setting up, using, and understanding the features of the project.

---

## Features

1. **Dynamic Receipt and Medical Leave Generation**
   - Generate receipts dynamically for patients, including treatment and payment details, using **React-PDF Render**.
   - Effortlessly create medical leave certificates based on patient data.

2. **Secure and Protected Subdirectories**
   - All dashboard pages use **hashed URL subdirectories** to ensure secure access to sensitive data.

3. **Home Dashboard with Summary Metrics**
   - A **summary page** serves as the dashboard homepage, providing real-time insights:
     - **Daily Patients**
     - **Total Patients**
     - **Total Revenue**
     - **Total Staff**

4. **Staff Management System**
   - Manage staff attendance efficiently via the **Staff Page**.
   - Generate monthly attendance sheets that summarize attendance for all staff members across each month.

5. **Interactive and User-Friendly UI**
   - Built with **React** and styled with **TailwindCSS** for a responsive, modern interface.
   - Seamless navigation between pages for an intuitive user experience.

---

## Project Layout

The project is organized as follows:

```
.env
.eslintignore
.eslintrc
.gitignore
.prettierignore
.prettierrc
.vercel/
    project.json
    README.txt
CHANGELOG.md
index.html
jsconfig.json
LICENSE.md
main.jsx
package.json
pages/
    pages/
        app.jsx
        ...
postcss.config.js
public/
    _redirects
    assets/
        ...
    favicon/
    manifest.json
README.md
src/
    _mock/
    app.jsx
    assets/
    components/
    global.css
    hooks/
    index.css
    layouts/
    main.jsx
    pages/
    routes/
    sections/
    theme/
    utils/
tailwind.config.js
vercel.json
vite.config.js
```

---

## Database Setup

The project utilizes **Supabase** as the backend. Use the SQL commands below to create the required tables.

### `clinic` Table

```sql
CREATE TABLE clinic (
    id SERIAL PRIMARY KEY,
    sno INT,
    phone_number TEXT,
    alternate_number TEXT,
    name TEXT,
    age INT,
    occupation TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    staff_attended TEXT,
    medical_history TEXT,
    amount_paid INT,
    days_attended INT,
    visit_1 DATE,
    visit_2 DATE,
    visit_3 DATE,
    visit_4 DATE,
    visit_5 DATE,
    visit_6 DATE,
    visit_7 DATE,
    visit_8 DATE,
    visit_9 DATE,
    visit_10 DATE,
    bloodbank_conf BOOLEAN
);
```

### `creds` Table

```sql
CREATE TABLE creds (
    sno BIGINT PRIMARY KEY,
    login_user TEXT,
    login_pass TEXT,
    staff_user TEXT,
    staff_pass TEXT,
    pin BIGINT,
    serverpin BIGINT
);
```

### `rehab` Table

```sql
CREATE TABLE rehab (
    id SERIAL PRIMARY KEY,
    sno INT,
    phone_number TEXT,
    alternate_number TEXT,
    name TEXT,
    age INT,
    occupation TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    staff_attended TEXT,
    medical_history TEXT,
    amount_paid INT,
    days_attended INT,
    visit_1 DATE,
    visit_2 DATE,
    visit_3 DATE,
    visit_4 DATE,
    visit_5 DATE,
    visit_6 DATE,
    visit_7 DATE,
    visit_8 DATE,
    visit_9 DATE,
    visit_10 DATE,
    rehab_commencement DATE,
    rehab_last_date DATE
);
```

### `staff` Table

```sql
CREATE TABLE staff (
    sno SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    days_attended INT,
    days_absent INT,
    mobile_number BIGINT,
    date_joined DATE,
    jan INT,
    feb INT,
    mar INT,
    apr INT,
    may INT,
    jun INT,
    jul INT,
    aug INT,
    sep INT,
    oct INT,
    nov INT,
    dec INT
);
```

---

## User Credentials

- **Admin Username:** `root`
- **Admin Password:** `root`
- **Staff Username:** `root2`
- **Staff Password:** `root2`
- **Unique Pin:** `100`
- **Server Pin:** `1999`

---

## Getting Started

Follow these steps to set up the project locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/RJohnPaul/Healthlink.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Healthlink
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm start
   ```
5. Open your browser and go to `http://localhost:3000`.

---

## Screenshots

### Home Dashboard
![Home Dashboard](https://github.com/RJohnPaul/Healthlink/blob/1d9056c3e47097346b3cf488f67171e4a5d50827/home.png)

### Staff Attendance Page
![Staff Page](https://github.com/RJohnPaul/Healthlink/blob/f7345faed25667b29429951ce55fb6d37a74081b/staff.png)

### Receipt Generation
![Dynamic Receipt](https://github.com/RJohnPaul/Healthlink/blob/b78a04d1b16f466407b7d1b01c118446d2127877/bill.png)

---

## Additional Features

- **Responsive Design:** Optimized for desktops, tablets, and mobile devices.
- **Fast and Lightweight:** Built using **Vite.js** for improved performance.
- **Detailed Logs:** Track patient visits, diagnoses, and treatments effortlessly.
- **Customizable Configurations:** Easily adjust settings via the `.env` file.

---

## License

This project is licensed under the **MIT License**. Refer to the [LICENSE](LICENSE.md) file for details.

---
