# Tables

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

### journey_steps

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
journey_id | uuid |  | True | customer_journeys.id
step_order | integer |  | False | 
created_at | timestamp with time zone |  | False | 
service_id | uuid |  | True | services.id |

### practice_services

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| practice_id (PK) | uuid |  | False | practices.id
service_id (PK) | uuid |  | False | services.id |

### practice_tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| practice_id (PK) | uuid |  | False | practices.id
tag_id (PK) | uuid |  | False | tags.id |

### practices

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
practice_name | text |  | False | 
created_by | uuid |  | True | 
updated_by | uuid |  | True | 
owner_id | uuid |  | True |  |

### service_leads_to

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| source_service_id (PK) | uuid |  | False | services.id
target_service_id (PK) | uuid |  | False | services.id |

### service_tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| service_id (PK) | uuid |  | False | services.id
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
owner_id | uuid |  | True |  |

### tags

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id (PK) | uuid | uuid_generate_v4() | False | 
name | text |  | False | 
created_at | timestamp with time zone | now() | False | 
created_by | uuid |  | True | 
updated_by | uuid |  | True |  |
