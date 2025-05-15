1. Clone the repository:
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

2. Install dependencies:
   npm install

3. Create a Supabase project at https://app.supabase.com

4. In Supabase, go to Project Settings > API and copy:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

5. Create a .env.local file in the root directory with:
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

6. Run the development server:
   npm run dev
   # or
   yarn dev

7. Open http://localhost:3000 in your browser
