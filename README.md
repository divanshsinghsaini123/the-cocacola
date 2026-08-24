# Project Setup, Configuration, & Architecture Guide

Welcome to the comprehensive setup guide for this project. This documentation explains step-by-step how to configure your Database (MongoDB), CDN & Cloud Storage (Gcore), and Headless CMS (Strapi). 

> [!NOTE]
> For a visual and detailed technical breakdown of the production deployment, database pipelines, triggers, and automated GitHub Action cron backup workflows, please check the [System Architecture Guide](file:///d:/the-cocacola/ARCHITECTURE.md).

Before starting, ensure you have Node.js and a package manager (npm) installed on your machine.

---

## Environment Variables (`.env`)

At the root of your project, you must create a `.env` file. You will gradually fill this in as you configure the services below. Here is the comprehensive template:

```env
# MONGODB SETTINGS
MONGODB_URI="your_mongodb_connection_string"

# JWT CONFIG
JWT_SECRET="your_secure_jwt_secret"

# SITE URL
NEXT_PUBLIC_BASE_URL="https://your-deployed-site-url.com"

# STRAPI CONFIGURATION
# Local Development: NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
NEXT_PUBLIC_STRAPI_URL="your_strapi_cloud_url"  

# The below url must be null if we want to use Strapi Cloud; it's only for custom hosting
NEXT_PUBLIC_STRAPICONTENT_PREFIX="https://strapicloud9-k6ghp.ondigitalocean.app"

# GCORE CDN & S3 STORAGE SETTINGS
GCORE_ACCESS_KEY_ID="your_gcore_access_key"
GCORE_SECRET_ACCESS_KEY="your_gcore_secret_key"
GCORE_ENDPOINT="https://s-ed1.cloud.gcore.lu"
GCORE_CDN_HOSTNAME="s-ed1.cloud.gcore.lu"
GCORE_BUCKET_NAME="cocacola-bucket"
GCORE_REGION="s-ed1"
NEXT_PUBLIC_GCORE_CDN_URL="https://cdn.yourdomain.com"

# DEV ENVIRONMENT SSL FIX (Local development ONLY - NEVER set this in production!)
# NODE_TLS_REJECT_UNAUTHORIZED="0"

# GITHUB WORKFLOWS AUTOMATED DISPATCHERS
GITHUB_OWNER="github_username_or_organization"
GITHUB_REPO="github_repository_name"
GITHUB_TOKEN="your_github_personal_access_token"

# TRANSACTIONAL EMAIL & BACKUP CRONS
EMAIL_USER="your_sending_gmail_address@gmail.com"
EMAIL_PASS="your_gmail_app_password"
REPORT_EMAIL_TO="recipient_email_address_1@gmail.com, recipient_email_address_2@gmail.com"

# COMPANY INFORMATION & MULTI-BRANDING CONFIGURATION
NEXT_PUBLIC_COMPANY_NAME="The Cloud9 Beverages Company"
NEXT_PUBLIC_COMPANY_EMAIL="info@cloud9beverages.com"
NEXT_PUBLIC_COMPANY_PHONE=""
NEXT_PUBLIC_COMPANY_ADDRESS="Cloud9 Beverages 101, Bhakti Park, R.H.B. Road, Mulund West, Mumbai, Maharashtra - 400080"

# SEO & GLOBAL DEFAULT METADATA
NEXT_PUBLIC_DEFAULT_KEYWORDS="beverages,drinks,refreshment,manufacturing,distribution"
NEXT_PUBLIC_COPYRIGHT="© 2025 The Cloud9 Beverages Company. All rights reserved."

# DYNAMIC PAGE METADATA defaults
NEXT_PUBLIC_HOME_TITLE="Home"
NEXT_PUBLIC_HOME_DESCRIPTION="Experience the refreshing taste of our world-class beverages."
NEXT_PUBLIC_ABOUT_TITLE="About Us"
NEXT_PUBLIC_ABOUT_DESCRIPTION="Learn about our company, our history, and our mission to refresh the world."
NEXT_PUBLIC_BRANDS_TITLE="Our Brands"
NEXT_PUBLIC_BRANDS_DESCRIPTION="Explore our portfolio of world-class beverage brands."
NEXT_PUBLIC_CONTACT_TITLE="Contact Us"
NEXT_PUBLIC_CONTACT_DESCRIPTION="Get in touch with us. Find our contact info, location, and send us a message."
NEXT_PUBLIC_EVENTS_TITLE="Events"
NEXT_PUBLIC_EVENTS_DESCRIPTION="Join us at our events and stay updated with community happenings."
NEXT_PUBLIC_EXTENSION_TITLE="Extension"
NEXT_PUBLIC_EXTENSION_DESCRIPTION="Explore our extensions and additional offerings."
NEXT_PUBLIC_COBRANDING_TITLE="Cobranding"
NEXT_PUBLIC_COBRANDING_DESCRIPTION="Partner with us for successful cobranding campaigns."
NEXT_PUBLIC_MANUFACTURING_TITLE="Manufacturing"
NEXT_PUBLIC_MANUFACTURING_DESCRIPTION="Learn about our manufacturing processes, facilities, and high standards."

# TRACKING ANALYTICS PIXELS
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
```

--- npm install

## Step 1: MongoDB Database Setup

This project uses MongoDB as its primary database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and log in or create an account.
2. Spin up a new database cluster.
3. Go to **Database Access** and create a new database user with a password.
4. Go to **Network Access** and whitelist your IP address (or allow all `0.0.0.0/0` for development).
5. Click **Connect** on your cluster, choose "Connect your application", and copy the connection string.
6. Paste the connection string into your `.env` file under `MONGODB_URI` (Remember to swap out `<password>` with your actual password and specify an `appName` if desired).

---

## Step 2: Gcore S3 & CDN Setup

We use Gcore for hosting image assets to ensure fast delivery worldwide.

### Creating the Bucket & Folders
1. Log in to your [Gcore Account](https://gcore.com/).
2. Navigate to **Cloud Storage (S3)**.
3. Create a new bucket (e.g., `cocacola-bucket`).
4. Once the bucket is created, open it and **create the following three folders exactly**:
   - `brands`
   - `products`
   - `stores`

### Access Keys & CDN
1. In the Gcore dashboard, navigate to the API/Access Keys section for your Object Storage.
2. Generate a new `Access Key ID` and `Secret Access Key`.
3. Set up a **CDN resource** pointing to your new bucket to get a CDN URL.
4. Update your `.env` file with these values:
   - `GCORE_ACCESS_KEY_ID`: Your generated Access Key.
   - `GCORE_SECRET_ACCESS_KEY`: Your generated Secret Key.
   - `GCORE_BUCKET_NAME`: The name of the bucket you created.
   - `GCORE_ENDPOINT`: The S3 API endpoint (e.g., `https://s-ed1.cloud.gcore.lu`).
   - `GCORE_REGION`: The region of your bucket (e.g., `s-ed1`).
   - `GCORE_CDN_HOSTNAME`: Make sure it matches the endpoint hostname.
   - `NEXT_PUBLIC_GCORE_CDN_URL`: Your public CDN link (e.g., `https://cdn.birbot.tech`).

---

## Step 3: Strapi CMS Setup & Deployment
(clone this and deploy)
https://github.com/divanshsinghsaini123/Strapi-CocoCola.git
We use Strapi as a Headless CMS to manage the frontend website content. 

### API Permissions (Crucial Step)
For the frontend to fetch data from Strapi without authentication, you must make the endpoint data public.
1. Run your Strapi server locally or visit your deployed dashboard.
2. In the Sidebar, go to **Settings** > **Roles** (Under Users & Permissions Plugin).
3. Click on the **Public** role.
4. Under Permissions, find your Content Types (e.g., Home Page, Brands, Products, etc.).
5. Check the `find` and `findOne` boxes for the respective content types so that they can be read publicly.
6. Click **Save** in the top right corner.

### Strapi Cloud Deployment
1. Go to [Strapi Cloud](https://cloud.strapi.io/).
2. Connect your GitHub repository containing the Strapi codebase.
https://github.com/divanshsinghsaini123/Strapi-CocoCola.git
3. Configure the environment variables inside your Strapi Cloud dashboard if required and click **Deploy**.
4. Once deployed, Strapi Cloud will provide you with a live production URL (e.g., `https://active-nurture-xxxxxx.strapiapp.com`).
5. Update your `NEXT_PUBLIC_STRAPI_URL` in the frontend `.env` with this new live URL. *(Note: For local testing, you can uncomment the `http://localhost:1337` URL).*

---

## Step 4: Running the Project

Once you have meticulously filled out the `.env` file according to the steps above, you are ready to start.

1. Open your terminal in the project root directory.
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Start the application in development mode:
   ```bash
   npm run dev
   ```

---

## Step 5: Google Sheets Integration (Mirzapur Contest Submissions)

Submissions from the `/mirzapur` page are saved to MongoDB and automatically appended as a new row to your Google Sheet via a Google Apps Script Webhook.

### How It Works:
1. **Form Submission**: User submits their Name, Phone, Special Code, and Bottle Image on the `/mirzapur` page.
2. **Image Processing & Storage**: The API route (`app/api/mirzapur/route.ts`) optimizes the image using Sharp to `.webp` format and uploads it to Gcore S3/CDN.
3. **MongoDB Record**: The entry is saved in the `mirzapur` MongoDB collection.
4. **Google Sheet Webhook Sync**: The API makes an asynchronous `POST` request to the Webhook URL configured in `GOOGLE_SHEET_MIRZAPUR_WEBHOOK_URL`.
5. **Spreadsheet Row Append**: Google Apps Script receives the JSON payload and automatically appends a new row (`Submitted At`, `Name`, `Phone`, `Special Code`, `Bottle Image URL`) into the Google Sheet.

### Setup Instructions for Google Sheet:
1. Open your target Google Sheet: [Mirzapur Contest Spreadsheet](https://docs.google.com/spreadsheets/d/1y-tQCrVaXr4eNbAJlkQJgBa-b6MKJNH8O3XI21VeJAE/edit?gid=0#gid=0).
2. Go to **Extensions** → **Apps Script**.
3. Replace the existing script with:
   ```javascript
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = JSON.parse(e.postData.contents);
       
       sheet.appendRow([
         data.submittedAt || new Date().toLocaleString(),
         data.name,
         data.phone,
         data.specialCode,
         data.bottleImageUrl
       ]);
       
       return ContentService
         .createTextOutput(JSON.stringify({ status: "success" }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (err) {
       return ContentService
         .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```
4. Click **Deploy** → **New Deployment**.
5. Choose **Web app** with:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Copy the generated Web App URL and add it to your `.env` file:
   ```env
   GOOGLE_SHEET_MIRZAPUR_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   ```

---
The application should now be successfully running on `http://localhost:3000` connected to MongoDB, reading content from Strapi, and serving images from the Gcore CDN!




# backup notes to postgres database 

// for dumping the database backup 
step : 0
docker exec -i cloud9_postgres-db \
  psql -U doadmin -d defaultdb < backups/backup.sql



//if it gives the error then you need to drop the database first ,
// but we need to terminate the process which is using the database first , 
1. find the process which is using the database 
docker exec -it cloud9_postgres-db psql -U doadmin -d postgres -c "SELECT pid, usename, application_name FROM pg_stat_activity WHERE datname='defaultdb';"
2. remove the connection from the database , 
docker exec -it cloud9_postgres-db psql -U doadmin -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='defaultdb';"

3. drop the databse 
docker exec -it cloud9_postgres-db \
  psql -U doadmin -d postgres -c "DROP DATABASE defaultdb;"
// now try the step 0 again ,  
