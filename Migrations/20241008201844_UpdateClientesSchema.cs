using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectLocalize.Migrations
{
    /// <inheritdoc />
    public partial class UpdateClientesSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Update",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Update",
                table: "Cobrancas");

            migrationBuilder.DropColumn(
                name: "Update",
                table: "Clientes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Update",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Update",
                table: "Cobrancas",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Update",
                table: "Clientes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
