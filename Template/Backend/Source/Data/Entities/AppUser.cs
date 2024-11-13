using System.ComponentModel;
using Microsoft.AspNetCore.Identity;

namespace Backend.Data.Entities;

public class AppUser : IdentityUser
{
    #region Hide Properties From Auto Code Generation Tool

    [Browsable(false)]
    public override string? NormalizedUserName { get => base.NormalizedUserName; set => base.NormalizedUserName = value; }
    [Browsable(false)]
    public override string? NormalizedEmail { get => base.NormalizedEmail; set => base.NormalizedEmail = value; }
    [Browsable(false)]
    public override bool EmailConfirmed { get => base.EmailConfirmed; set => base.EmailConfirmed = value; }
    [Browsable(false)]
    public override string? PasswordHash { get => base.PasswordHash; set => base.PasswordHash = value; }
    [Browsable(false)]
    public override string? SecurityStamp { get => base.SecurityStamp; set => base.SecurityStamp = value; }
    [Browsable(false)]
    public override string? ConcurrencyStamp { get => base.ConcurrencyStamp; set => base.ConcurrencyStamp = value; }
    [Browsable(false)]
    public override bool PhoneNumberConfirmed { get => base.PhoneNumberConfirmed; set => base.PhoneNumberConfirmed = value; }
    [Browsable(false)]
    public override DateTimeOffset? LockoutEnd { get => base.LockoutEnd; set => base.LockoutEnd = value; }
    [Browsable(false)]
    public override int AccessFailedCount { get => base.AccessFailedCount; set => base.AccessFailedCount = value; }

    #endregion
}
