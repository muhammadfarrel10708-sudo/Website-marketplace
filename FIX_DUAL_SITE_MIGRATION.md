# Fix migration dual-site

Replace the existing migration file with the included file:
backend/database/migrations/2026_10_05_000001_add_site_scoping.php

This fixes the MariaDB `key` reserved-word SQL error and makes the migration safe after a partial first run. It also avoids duplicating Nusatron data because NusatronSeeder already created it after the first migration attempt.
