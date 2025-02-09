## Crud Endpoints Commands

### CRUD Endpoint Command

**Command:** `dotnet fet crudendpoint` or `dotnet fet crud`

**Description:** Create CRUD endpoints (Create, Read, Update, Delete, List) for an entity.

**Options:**
- `--name` or `-n`: Name of the class for CRUD operations. (Required)
- `--pluralName` or `-pn`: Plural name of the entity for CRUD operations. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoints. (Optional)
- `--dataContext` or `-dc`: DataContext class name. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)

### Create Endpoint Command

**Command:** `dotnet fet createendpoint` or `dotnet fet cep`

**Description:** Create an endpoint with request, response, validator, and mapper.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--pluralName` or `-pn`: Plural name of the entity for CRUD operations. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--dataContext` or `-dc`: DataContext class name. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Update Endpoint Command

**Command:** `dotnet fet updateendpoint` or `dotnet fet uep`

**Description:** Update an endpoint with request, response, validator, and mapper.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--pluralName` or `-pn`: Plural name of the entity for CRUD operations. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--dataContext` or `-dc`: DataContext class name. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Get Endpoint Command

**Command:** `dotnet fet getendpoint` or `dotnet fet gep`

**Description:** Get an endpoint with request, response, validator, and mapper.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--pluralName` or `-pn`: Plural name of the entity for CRUD operations. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--dataContext` or `-dc`: DataContext class name. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### List Endpoint Command

**Command:** `dotnet fet listendpoint` or `dotnet fet lep`

**Description:** Create a list endpoint with request, response, validator, and mapper.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--pluralName` or `-pn`: Plural name of the entity for CRUD operations. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--dataContext` or `-dc`: DataContext class name. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Delete Endpoint Command

**Command:** `dotnet fet deleteendpoint` or `dotnet fet dep`

**Description:** Create a delete endpoint with request, response, and validator.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--pluralName` or `-pn`: Plural name of the entity for CRUD operations. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--dataContext` or `-dc`: DataContext class name. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

## Basic Endpoints Commands

### Endpoint Command

**Command:** `dotnet fet endpoint` or `dotnet fet ep`

**Description:** Create an endpoint with request, response, validator, and mapper.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--method` or `-m`: HTTP method. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--entity` or `-e`: Name of the entity class. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Endpoint Without Mapper Command

**Command:** `dotnet fet endpointwithoutmapper` or `dotnet fet epwm`

**Description:** Create an endpoint with request, response, and validator.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--method` or `-m`: HTTP method. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Endpoint Without Response Command

**Command:** `dotnet fet endpointwithoutresponse` or `dotnet fet epwr`

**Description:** Create an endpoint with request and validator.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--method` or `-m`: HTTP method. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Endpoint Without Request Command

**Command:** `dotnet fet endpointwithoutrequest` or `dotnet fet epwreq`

**Description:** Create an endpoint with response.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--method` or `-m`: HTTP method. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)

### Endpoint Without Response and Request Command

**Command:** `dotnet fet endpointwithoutresponseandrequest` or `dotnet fet epwrreq`

**Description:** Create an endpoint.

**Options:**
- `--name` or `-n`: Name of the endpoint class. (Required)
- `--method` or `-m`: HTTP method. (Required)
- `--url` or `-u`: URL of the endpoint. (Required)
- `--output` or `-o`: Path of the endpoint. (Optional)
- `--group` or `-g`: Endpoint group. (Optional)
- `--authorization` or `-auth`: Permission-based authorization. (Optional, Default: `false`)
- `--permission` or `-per`: Permission name. (Optional)