# 04 - Set up a service principal

A script that proves the setup works before you write any embedding code.

## Setup checklist

1. Entra admin center > App registrations > New registration. Copy tenant ID and client ID.
2. Certificates & secrets > New client secret. Copy the value (use a certificate in production).
3. Create a security group and add the app to it.
4. Fabric admin portal > Tenant settings > "Service principals can use Fabric APIs":
   enable it for that security group.
5. Workspace > Manage access > add the app as Member or Admin.
6. Assign the workspace to a capacity.

## Run

```bash
cp .env.example .env   # TENANT_ID, CLIENT_ID, CLIENT_SECRET (WORKSPACE_ID optional)
npm run ep04
```

## Common failures

| Output | Cause |
|---|---|
| `AADSTS7000215` invalid client secret | Copied the secret ID instead of the secret value, or it expired |
| `401 Unauthorized` on `/groups` | Tenant setting not enabled, or the app isn't in the allowed group |
| Empty workspace list | App not added to any workspace |
| `NOT on a capacity` | Embedding for customers needs the workspace on an F, A or P capacity |
