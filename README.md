# HealthlinkPro

Welcome to the Project! This README will guide you through the setup and usage of the project.

## Project Layout

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
		blog.jsx
		blood.jsx
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

## Database Setup

This project uses Supabase as the database. Below are the SQL commands to create the necessary tables. Paste these commands into the SQL editor in Supabase.

### Clinic Table

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

### Creds Table

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

### Rehab Table

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

### Staff Table

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

## User Credentials

- **Username:** `saa`
- **Password:** `saa`
- **Staff Username:** `staffy`
- **Staff Password:** `staffy`
- **Unique Pin:** `100`
- **Server Pin:** `1999`

## Screenshots

![Screenshot 1](path/to/screenshot1.png)
![Screenshot 2](path/to/screenshot2.png)

## Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/RJohnPaul/Healthlink.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. Open the browser and navigate to `http://localhost:3000`.


## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Thank you for using our project! If you have any questions, feel free to open an issue or contact us.