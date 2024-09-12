# Database Schema Documentation

---

## Tables

### practice_services

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| practice_id (PK) | uuid |  | False | practices.id
service_id (PK) | uuid |  | False | services.id |

### service_tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| service_id (PK) | uuid |  | False | services.id
tag_id (PK) | uuid |  | False | tags.id |

### service_leads_to

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| source_service_id (PK) | uuid |  | False | services.id
target_service_id (PK) | uuid |  | False | services.id |

### practice_tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| practice_id (PK) | uuid |  | False | practices.id
tag_id (PK) | uuid |  | False | tags.id |

### services

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
description | text |  | True | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
owner_id | uuid |  | True | 
position | jsonb |  | True |  |

### tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
created_at | timestamp with time zone | now() | False | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
parent_id | uuid |  | True | tags.id
updated_at | timestamp with time zone | now() | False |  |

### journey_steps

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
journey_id | uuid |  | True | customer_journeys.id
step_order | integer |  | False | 
created_at | timestamp with time zone |  | False | 
service_id | uuid |  | True | services.id
updated_at | timestamp with time zone | now() | False |  |

### customer_journeys

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
description | text |  | True | 
created_at | timestamp with time zone | now() | False | 
updated_at | timestamp with time zone | now() | False | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
owner_id | uuid |  | True |  |

### practices

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
owner_id | uuid |  | True | 
updated_at | timestamp with time zone | now() | False | 
created_at | timestamp with time zone | now() | False | 
description | text |  | True |  |

## Types

### net.http_response

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| status_code | integer | 1 | false
headers | jsonb | 2 | false
body | text | 3 | false |

### net.http_response_result

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| status | net.request_status | 1 | false
message | text | 2 | false
response | net.http_response | 3 | false |

### pgsodium._key_id_context

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| key_id | bigint | 1 | false
key_context | bytea | 2 | false |

### pgsodium.crypto_box_keypair

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| public | bytea | 1 | false
secret | bytea | 2 | false |

### pgsodium.crypto_kx_keypair

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| public | bytea | 1 | false
secret | bytea | 2 | false |

### pgsodium.crypto_kx_session

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| rx | bytea | 1 | false
tx | bytea | 2 | false |

### pgsodium.crypto_sign_keypair

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| public | bytea | 1 | false
secret | bytea | 2 | false |

### pgsodium.crypto_signcrypt_keypair

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| public | bytea | 1 | false
secret | bytea | 2 | false |

### pgsodium.crypto_signcrypt_state_key

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| state | bytea | 1 | false
shared_key | bytea | 2 | false |

### realtime.user_defined_filter

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| column_name | text | 1 | false
op | realtime.equality_op | 2 | false
value | text | 3 | false |

### realtime.wal_column

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| name | text | 1 | false
type_name | text | 2 | false
type_oid | oid | 3 | false
value | jsonb | 4 | false
is_pkey | boolean | 5 | false
is_selectable | boolean | 6 | false |

### realtime.wal_rls

| column name | type | position | required? |
| ----------- | ---- | -------- | --------- |
| wal | jsonb | 1 | false
is_rls_enabled | boolean | 2 | false
subscription_ids | uuid[] | 3 | false
errors | text[] | 4 | false |
