# Tables

### <a name="practice_services"></a>practice_services

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| practice_id <span style="background: #ddd; padding: 2px; font-size: 0.75rem; color: black">PK</span> | <a href="https://www.postgresql.org/docs/9.1/datatype-uuid.html">uuid</a> |  | False | [practices.id](#practices)
service_id <span style="background: #ddd; padding: 2px; font-size: 0.75rem; color: black">PK</span> | <a href="https://www.postgresql.org/docs/9.1/datatype-uuid.html">uuid</a> |  | False | [services.id](#services) |

### <a name="services"></a>services

| Name | Type | Default | Nullable | References |
| -- | -- | -- | -- | ---------- |
| id <span style="background: #ddd; padding: 2px; font-size: 0.75rem; color: black">PK</span> | <a href="https://www.postgresql.org/docs/9.1/datatype-uuid.html">uuid</a> | uuid_generate_v4() | False | 
name | <a href="https://www.postgresql.org/docs/9.5/datatype-character.html">text</a> |  | False | 
description | <a href="https://www.postgresql.org/docs/9.5/datatype-character.html">text</a> |  | True | 
created_at | <a href="https://www.postgresql.org/docs/9.5/datatype-datetime.html">timestamp with time zone</a> | now() | False | 
updated_at | <a href="https://www.postgresql.org/docs/9.5/datatype-datetime.html">timestamp with time zone</a> | now() | False | 
created_by | <a href="https://www.postgresql.org/docs/9.1/datatype-uuid.html">uuid</a> |  | True | 
updated_by | <a href="https://www.postgresql.org/docs/9.1/datatype-uuid.html">uuid</a> |  | True | 
owner_id | <a href="https://www.postgresql.org/docs/9.1/datatype-uuid.html">uuid</a> |  | True |  |
