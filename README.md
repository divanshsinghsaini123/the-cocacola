# Project Setup & Configuration Guide

Welcome to the comprehensive setup guide for this project. This documentation explains step-by-step how to configure your Database (MongoDB), CDN & Cloud Storage (Gcore), and Headless CMS (Strapi). 

Before starting, ensure you have Node.js and a package manager (npm) installed on your machine.

and RUN 
NP
---

## Environment Variables (`.env`)

At the root of your project, you must create a `.env` file. You will gradually fill this in as you complete the setup steps below. Here is the template:

```env
# MONGODB SETTINGS
MONGODB_URI="your_mongodb_connection_string"

# JWT CONFIG
JWT_SECRET="your_secure_jwt_secret"

# STRAPI CONFIGURATION
# Local Development: NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
NEXT_PUBLIC_STRAPI_URL="your_strapi_cloud_url"

# GCORE CDN & S3 STORAGE SETTINGS
GCORE_ACCESS_KEY_ID="your_gcore_access_key"
GCORE_SECRET_ACCESS_KEY="your_gcore_secret_key"
GCORE_ENDPOINT="https://s-ed1.cloud.gcore.lu"
GCORE_CDN_HOSTNAME="s-ed1.cloud.gcore.lu"
GCORE_BUCKET_NAME="cocacola-bucket"
GCORE_REGION="s-ed1"
NEXT_PUBLIC_GCORE_CDN_URL="https://cdn.yourdomain.com"

# DEV ENVIRONMENT SSL FIX
NODE_TLS_REJECT_UNAUTHORIZED="0"
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

The application should now be successfully running on `http://localhost:3000` connected to MongoDB, reading content from Strapi, and serving images from the Gcore CDN!
