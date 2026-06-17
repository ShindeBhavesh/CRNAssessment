IF DB_ID('ProductManagementDb') IS NULL
BEGIN
    CREATE DATABASE ProductManagementDb;
END
GO

USE ProductManagementDb;
GO

IF OBJECT_ID('dbo.Product', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Product
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ProductName NVARCHAR(255) NOT NULL,
        CreatedBy NVARCHAR(100) NOT NULL,
        CreatedOn DATETIME NOT NULL,
        ModifiedBy NVARCHAR(100) NULL,
        ModifiedOn DATETIME NULL
    );

    CREATE INDEX IX_Product_ProductName ON dbo.Product(ProductName);
END
GO

IF OBJECT_ID('dbo.Item', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Item
    (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ProductId INT NOT NULL,
        Quantity INT NOT NULL,
        CONSTRAINT FK_Item_Product FOREIGN KEY (ProductId) REFERENCES dbo.Product(Id)
    );

    CREATE INDEX IX_Item_ProductId ON dbo.Item(ProductId);
END
GO