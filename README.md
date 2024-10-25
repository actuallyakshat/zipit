# Zipit
Zipit allows you to seamlessly share files from any device. It's a super convenient way to transfer files between devices with zero signups and zero compromise on the quality.

### Inorder to test the application locally:
1. Clone the repository: `git clone https://github.com/actuallyakshat/zipit.git`
2. Install dependencies: `pnpm install`
3. Set Environment Variables:
     ```
     UPLOADTHING_APP_ID=your_uploadthing_app_id"
     UPLOADTHING_SECRET="your_uploadthing_secret"
     DATABASE_URL="supabase_postgres_db_with_realtime"
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```
4. Migrate Prisma Scehmas: `pnpm dlx prisma migrate dev --name migration_name` and then `npx prisma generate`  
5. Run the local server: `pnpm dev`

### Tech Stack Used
- Next.js
- Typescript
- Uploadthing
- Supabase Realtime & Prisma
- JsZip
- Tailwind
- Zod

### Have any queries?
Feel free to contact me on LinkedIn or Instagram! You can find the link to my socials from my GitHub Profile.
