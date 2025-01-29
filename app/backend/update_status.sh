#!/bin/bash

PGPASSWORD="postgres-password" psql -h localhost -U postgres-user -d postgres-db -c "
UPDATE public.internship
SET status = 'interview'
WHERE status = 'application'
AND application_end < NOW();"
