# Database

## Tables

### Product

- Id INT IDENTITY(1,1) PRIMARY KEY
- ProductName NVARCHAR(255) NOT NULL
- CreatedBy NVARCHAR(100) NOT NULL
- CreatedOn DATETIME NOT NULL
- ModifiedBy NVARCHAR(100) NULL
- ModifiedOn DATETIME NULL

### Item

- Id INT IDENTITY(1,1) PRIMARY KEY
- ProductId INT NOT NULL (FK -> Product.Id)
- Quantity INT NOT NULL

### RefreshToken

- Id INT IDENTITY(1,1) PRIMARY KEY
- UserId INT NOT NULL
- Token NVARCHAR(200) NOT NULL
- ExpiresOn DATETIME NOT NULL
- IsRevoked BIT NOT NULL

## Initialization Script

`database/init.sql`