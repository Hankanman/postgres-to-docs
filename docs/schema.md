# Database Schema Documentation

---

## Tables

### organisations

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | gen_random_uuid() | False | 
created_at | timestamp with time zone | now() | False | 
name | text |  | True |  |

#### Row-Level Security Policies


**Policy**: Authenticated users can read all organisations


**Command**: SELECT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can read all organisations" ON public.organisations TO {authenticated}
```


**USING expression**:

```sql
true
```

### divisions

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | gen_random_uuid() | False | 
created_at | timestamp with time zone | now() | False | 
name | text |  | False | 
organisation_id | uuid |  | True | organisations.id |

#### Row-Level Security Policies


**Policy**: Authenticated users can read divisions they belong to


**Command**: SELECT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can read divisions they belong to" ON public.divisions TO {authenticated}
```


**USING expression**:

```sql
(organisation_id IN ( SELECT user_roles.organisation_id
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))
```


**Policy**: Authenticated users can insert divisions for their organisation


**Command**: INSERT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can insert divisions for their organisation" ON public.divisions TO {authenticated}
```


**WITH CHECK expression**:

```sql
(organisation_id IN ( SELECT user_roles.organisation_id
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))
```


**Policy**: Authenticated users can update their divisions


**Command**: UPDATE


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can update their divisions" ON public.divisions TO {authenticated}
```


**USING expression**:

```sql
(organisation_id IN ( SELECT user_roles.organisation_id
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))
```


**WITH CHECK expression**:

```sql
(organisation_id IN ( SELECT user_roles.organisation_id
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))
```


**Policy**: Authenticated users can delete their divisions


**Command**: DELETE


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can delete their divisions" ON public.divisions TO {authenticated}
```


**USING expression**:

```sql
(organisation_id IN ( SELECT user_roles.organisation_id
   FROM user_roles
  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))
```

### audit_logs

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
table_name | text |  | False | 
record_id | uuid |  | False | 
user_id | uuid |  | False | 
action | text |  | False | 
changed_at | timestamp with time zone | now() | False |  |

#### Row-Level Security Policies


**Policy**: Allow authenticated users to read audit logs


**Command**: SELECT


**Roles**: {authenticated}


**Definition**:

```sql
"Allow authenticated users to read audit logs" ON public.audit_logs TO {authenticated}
```


**USING expression**:

```sql
true
```


**Policy**: Allow authenticated users to insert audit logs


**Command**: INSERT


**Roles**: {authenticated}


**Definition**:

```sql
"Allow authenticated users to insert audit logs" ON public.audit_logs TO {authenticated}
```


**WITH CHECK expression**:

```sql
true
```

### comments

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
user_id | uuid |  | True | 
service_id | uuid |  | True | services.id
practice_id | uuid |  | True | practices.id
content | text |  | False | 
created_at | timestamp with time zone | now() | False |  |

### customer_journeys

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
description | text |  | True | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False | 
owner_id | uuid |  | True | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
status | text | 'active'::text | True | 
version | integer | 1 | True |  |

### journey_steps

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
journey_id | uuid |  | True | customer_journeys.id
service_id | uuid |  | True | services.id
step_order | integer |  | False | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False |  |

### notifications

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
user_id | uuid |  | True | 
message | text |  | False | 
created_at | timestamp with time zone | now() | False | 
read | boolean | false | True |  |

### practice_tag

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| practice_id (PK) | uuid |  | False | practices.id
tag_id (PK) | uuid |  | False | tags.id |

### roles

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False |  |

### service_practice

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| service_id (PK) | uuid |  | False | services.id
practice_id (PK) | uuid |  | False | practices.id |

### tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False | 
description | text |  | True | 
color | text |  | True | 
icon | text |  | True |  |

### service_tag

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| service_id (PK) | uuid |  | False | services.id
tag_id (PK) | uuid |  | False | tags.id |

### user_roles

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| user_id (PK) | uuid |  | False | 
role_id (PK) | uuid |  | False | roles.id
organisation_id | uuid |  | True | organisations.id |

#### Row-Level Security Policies


**Policy**: Enable users to view their own roles


**Command**: SELECT


**Roles**: {authenticated}


**Definition**:

```sql
"Enable users to view their own roles" ON public.user_roles TO {authenticated}
```


**USING expression**:

```sql
(( SELECT auth.uid() AS uid) = user_id)
```

### services

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
description | text |  | True | 
position | jsonb |  | True | 
color | text |  | True | 
icon | text |  | True | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False | 
owner_id | uuid |  | True | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
status | text | 'active'::text | True | 
version | integer | 1 | True | 
practice_id | uuid |  | False | practices.id |

#### Row-Level Security Policies


**Policy**: Authenticated users can read services they belong to


**Command**: SELECT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can read services they belong to" ON public.services TO {authenticated}
```


**USING expression**:

```sql
(practice_id IN ( SELECT practices.id
   FROM practices
  WHERE (practices.division_id IN ( SELECT divisions.id
           FROM divisions
          WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
                   FROM user_roles
                  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))))
```


**Policy**: Authenticated users can insert services for their practice


**Command**: INSERT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can insert services for their practice" ON public.services TO {authenticated}
```


**WITH CHECK expression**:

```sql
(practice_id IN ( SELECT practices.id
   FROM practices
  WHERE (practices.division_id IN ( SELECT divisions.id
           FROM divisions
          WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
                   FROM user_roles
                  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))))
```


**Policy**: Authenticated users can update their services


**Command**: UPDATE


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can update their services" ON public.services TO {authenticated}
```


**USING expression**:

```sql
(practice_id IN ( SELECT practices.id
   FROM practices
  WHERE (practices.division_id IN ( SELECT divisions.id
           FROM divisions
          WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
                   FROM user_roles
                  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))))
```


**WITH CHECK expression**:

```sql
(practice_id IN ( SELECT practices.id
   FROM practices
  WHERE (practices.division_id IN ( SELECT divisions.id
           FROM divisions
          WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
                   FROM user_roles
                  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))))
```


**Policy**: Authenticated users can delete their services


**Command**: DELETE


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can delete their services" ON public.services TO {authenticated}
```


**USING expression**:

```sql
(practice_id IN ( SELECT practices.id
   FROM practices
  WHERE (practices.division_id IN ( SELECT divisions.id
           FROM divisions
          WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
                   FROM user_roles
                  WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))))
```

### practices

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
description | text |  | True | 
reference_url | text |  | True | 
color | text |  | True | 
icon | text |  | True | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False | 
owner_id | uuid |  | True | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
status | text | 'active'::text | True | 
version | integer | 1 | True | 
division_id | uuid |  | True | divisions.id |

#### Row-Level Security Policies


**Policy**: Authenticated users can read practices they belong to


**Command**: SELECT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can read practices they belong to" ON public.practices TO {authenticated}
```


**USING expression**:

```sql
(division_id IN ( SELECT divisions.id
   FROM divisions
  WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
           FROM user_roles
          WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))
```


**Policy**: Authenticated users can insert practices for their division


**Command**: INSERT


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can insert practices for their division" ON public.practices TO {authenticated}
```


**WITH CHECK expression**:

```sql
(division_id IN ( SELECT divisions.id
   FROM divisions
  WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
           FROM user_roles
          WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))
```


**Policy**: Authenticated users can update their practices


**Command**: UPDATE


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can update their practices" ON public.practices TO {authenticated}
```


**USING expression**:

```sql
(division_id IN ( SELECT divisions.id
   FROM divisions
  WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
           FROM user_roles
          WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))
```


**WITH CHECK expression**:

```sql
(division_id IN ( SELECT divisions.id
   FROM divisions
  WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
           FROM user_roles
          WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))
```


**Policy**: Authenticated users can delete their practices


**Command**: DELETE


**Roles**: {authenticated}


**Definition**:

```sql
"Authenticated users can delete their practices" ON public.practices TO {authenticated}
```


**USING expression**:

```sql
(division_id IN ( SELECT divisions.id
   FROM divisions
  WHERE (divisions.organisation_id IN ( SELECT user_roles.organisation_id
           FROM user_roles
          WHERE (user_roles.user_id = ( SELECT auth.uid() AS uid))))))
```

## Functions

### create_notification


**Signature**:

```sql
create_notification(user_id uuid, message text) RETURNS void
```


**Language**: plpgsql


**Volatility**: VOLATILE


**Definition**:

```sql
CREATE OR REPLACE FUNCTION public.create_notification(user_id uuid, message text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    insert into notifications (id, user_id, message, created_at, read)
    values (uuid_generate_v4(), user_id, message, now(), false);
end;
$function$
```

### increment_version


**Signature**:

```sql
increment_version() RETURNS trigger
```


**Language**: plpgsql


**Volatility**: VOLATILE


**Definition**:

```sql
CREATE OR REPLACE FUNCTION public.increment_version()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    new.version := old.version + 1;
    return new;
end;
$function$
```

### log_audit


**Signature**:

```sql
log_audit() RETURNS trigger
```


**Language**: plpgsql


**Volatility**: VOLATILE


**Definition**:

```sql
CREATE OR REPLACE FUNCTION public.log_audit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$DECLARE
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  IF current_user_id IS NULL THEN
    -- This could be a known "system" user, or any placeholder you choose
    current_user_id := '00000000-0000-0000-0000-000000000000';
  END IF;
  
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (table_name, record_id, user_id, action, changed_at)
    VALUES (TG_TABLE_NAME, OLD.id, current_user_id, TG_OP, now());
    RETURN OLD;
  ELSE
    INSERT INTO audit_logs (table_name, record_id, user_id, action, changed_at)
    VALUES (TG_TABLE_NAME, NEW.id, current_user_id, TG_OP, now());
    RETURN NEW;
  END IF;
END;$function$
```
