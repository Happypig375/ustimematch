# USTimematch

Timetable manager for HKUST students.

## Development

- `pnpm dev` to start the Next.js server
- Start a postgres instance

  ```sh
  mkdir ~/postgres-data

  docker run -d \
   --name dev-postgres \
   -e POSTGRES_PASSWORD=password \
   -v ${HOME}/postgres-data/:/var/lib/postgresql/data \
   -p 5432:5432 \
   postgres
  ```

- `pnpm prisma db push` to initalize the database
  - `pnpm prisma migrate dev` for migration
- setup environment variables
- To inspect the database you can run `pnpm prisma studio`, or start a pgAdmin instance.
  ```sh
  docker run -d \
    -p 80:80 \
    -e 'PGADMIN_DEFAULT_EMAIL=dev@dev.com' \
    -e 'PGADMIN_DEFAULT_PASSWORD=password' \
    --name pgadmin \
    dpage/pgadmin4
  ```
  > [in-depth tutorial](https://towardsdatascience.com/local-development-set-up-of-postgresql-with-docker-c022632f13ea)

## Deployment

### Backup

[https://blog.railway.app/p/automated-postgresql-backups](https://blog.railway.app/p/automated-postgresql-backups)

#### Environment variables

```sh
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_REGION=us-west-2
AWS_S3_BUCKET=ustimematch-production-backup
BACKUP_CRON_SCHEDULE=0 19 * * *
BACKUP_DATABASE_URL=${{ DATABASE_URL }}
```

#### Commands

`pg_restore -c -d <connection_string> <path_to_backup>`

### Services

- Vercel
  - Nextjs
  
- Railway
  - Postgres database
  
- Mailgun
  - SMTP mail server

OR

- AWS
  - SES
    - Sign in emails
  - S3
    - Database backup
  
- Cloudflare
  - Domain management
  - Rate limiting
