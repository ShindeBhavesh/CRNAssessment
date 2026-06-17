using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Product",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                ProductName = table.Column<string>(maxLength: 255, nullable: false),
                CreatedBy = table.Column<string>(maxLength: 100, nullable: false),
                CreatedOn = table.Column<DateTime>(nullable: false),
                ModifiedBy = table.Column<string>(maxLength: 100, nullable: true),
                ModifiedOn = table.Column<DateTime>(nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Product", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Item",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                ProductId = table.Column<int>(nullable: false),
                Quantity = table.Column<int>(nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Item", x => x.Id);
                table.ForeignKey(
                    name: "FK_Item_Product_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Product",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "RefreshToken",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                UserId = table.Column<int>(nullable: false),
                Token = table.Column<string>(maxLength: 200, nullable: false),
                ExpiresOn = table.Column<DateTime>(nullable: false),
                IsRevoked = table.Column<bool>(nullable: false),
                CreatedOn = table.Column<DateTime>(nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RefreshToken", x => x.Id);
            });

        migrationBuilder.CreateIndex(name: "IX_Item_ProductId", table: "Item", column: "ProductId");
        migrationBuilder.CreateIndex(name: "IX_Product_ProductName", table: "Product", column: "ProductName");
        migrationBuilder.CreateIndex(name: "IX_RefreshToken_Token", table: "RefreshToken", column: "Token", unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Item");
        migrationBuilder.DropTable(name: "RefreshToken");
        migrationBuilder.DropTable(name: "Product");
    }
}