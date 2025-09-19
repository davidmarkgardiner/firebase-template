# Teller Secrets Management Guide

This guide explains how to use Teller for secure secrets management with Google Cloud Secret Manager in the Backstage Platform Template project.

## Overview

Teller is a multi-provider secret management tool that allows you to securely fetch secrets from various sources (Google Cloud Secret Manager, AWS Secrets Manager, HashiCorp Vault, etc.) and use them in your development and deployment workflows.

## Prerequisites

### 1. Google Cloud Setup

1. **Install Google Cloud SDK** (already available in devbox):

   ```bash
   devbox shell  # Enters environment with gcloud pre-installed
   gcloud version
   ```

2. **Authenticate with Google Cloud**:

   ```bash
   # Login to your Google account
   gcloud auth login

   # Set up application default credentials for Secret Manager
   gcloud auth application-default login
   ```

3. **Set your Google Cloud project**:

   ```bash
   # List available projects
   gcloud projects list

   # Set your project (replace with your actual project ID)
   gcloud config set project 240676728422
   gcloud auth application-default set-quota-project 240676728422
   ```

4. **Enable Secret Manager API**:
   ```bash
   gcloud services enable secretmanager.googleapis.com
   ```

### 2. Teller Installation

Teller is already available in your devbox environment:

```bash
devbox shell
teller --version  # Should show: teller 2.0.7
```

## Configuration

The project includes a pre-configured `.teller.yml` file with the following secrets defined:

### Database Secrets

- `DB_USERNAME` → `platform-database-username`
- `DB_PASSWORD` → `platform-database-password`
- `DB_HOST` → `platform-database-host`

### Authentication Secrets

- `JWT_SECRET` → `platform-jwt-secret`
- `JWT_REFRESH_SECRET` → `platform-jwt-refresh-secret`

### External Services

- `EXTERNAL_API_KEY` → `platform-external-api-key`
- `ELEVENLABS_API_KEY` → `elevenlabs-api-key`

### Docker Registry

- `DOCKER_USERNAME` → `docker-registry-username`
- `DOCKER_PASSWORD` → `docker-registry-password`

## Creating Secrets in Google Cloud Secret Manager

### Using gcloud CLI

Create each secret in Google Cloud Secret Manager:

```bash
# Database secrets
echo -n "your-db-username" | gcloud secrets create platform-database-username --data-file=-
echo -n "your-db-password" | gcloud secrets create platform-database-password --data-file=-
echo -n "your-db-host.com" | gcloud secrets create platform-database-host --data-file=-

# JWT secrets (generate secure random values)
openssl rand -base64 32 | gcloud secrets create platform-jwt-secret --data-file=-
openssl rand -base64 32 | gcloud secrets create platform-jwt-refresh-secret --data-file=-

# External API keys
echo -n "your-external-api-key" | gcloud secrets create platform-external-api-key --data-file=-
echo -n "" | gcloud secrets create elevenlabs-api-key --data-file=-

# Docker registry credentials
echo -n "" | gcloud secrets create docker-registry-username --data-file=-
echo -n "" | gcloud secrets create docker-registry-password --data-file=-

echo -n "" | gcloud secrets create azure-subscription-id --data-file=-
echo -n "" | gcloud secrets create azure-tenant-id --data-file=-
echo -n "" | gcloud secrets create azure-client-id-contributor --data-file=-
echo -n "" | gcloud secrets create azure-client-secret-contributor --data-file=-



```

### Using Google Cloud Console

1. Navigate to [Secret Manager](https://console.cloud.google.com/security/secret-manager)
2. Click "CREATE SECRET"
3. Enter the secret name (e.g., `platform-jwt-secret`)
4. Enter the secret value
5. Click "CREATE"

## Using Teller

### 1. Export Secrets as Environment Variables

```bash
# Export all secrets as environment variables
eval $(teller env)

# Verify secrets are loaded
echo $JWT_SECRET
```

### 2. Run Commands with Secrets

```bash
# Run a single command with secrets loaded
teller run -- npm start

# Run your platform API with secrets
teller run -- npm run dev --prefix platform-api

# Run Docker build with registry credentials
teller run -- docker build -t myapp .
```

### 3. Show Available Secrets (for debugging)

```bash
# Show all configured secrets (redacted by default)
teller show

# Show full secret values (use with caution)
teller show --redact=false
```

### 4. Validate Configuration

```bash
# Test if all secrets can be fetched
teller env > /dev/null && echo "✅ All secrets accessible" || echo "❌ Error fetching secrets"
```

## Environment-Specific Configuration

The `.teller.yml` file supports different environments:

### Development

```bash
# Use development project
TELLER_PROJECT=backstage-platform-dev teller env
```

### Staging

```bash
# Use staging project
TELLER_PROJECT=backstage-platform-staging teller env
```

### Production

```bash
# Use production project
TELLER_PROJECT=backstage-platform-prod teller env
```

## Security Best Practices

### 1. Never Commit Secrets

- ✅ Use `.teller.yml` to define secret mappings
- ❌ Never commit actual secret values
- ✅ Use `.env.sample` for documentation

### 2. Principle of Least Privilege

```bash
# Grant minimal required permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="user:your-email@domain.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Audit Secret Access

```bash
# View secret access logs
gcloud logging read 'resource.type="gce_instance" AND jsonPayload.serviceName="secretmanager.googleapis.com"'
```

## CI/CD Integration

### GitHub Actions

Create a workflow that uses Teller:

```yaml
# .github/workflows/deploy.yml
name: Deploy with Secrets

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Google Cloud Auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Install Teller
        run: |
          curl -L https://github.com/tellerops/teller/releases/latest/download/teller_linux_x86_64.tar.gz | tar -xz
          sudo mv teller /usr/local/bin/

      - name: Deploy with secrets
        run: |
          teller run -- npm run deploy
```

### Kubernetes Deployment

Use External Secrets Operator with Teller:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: gcpsm-secret-store
spec:
  provider:
    gcpsm:
      projectId: YOUR_PROJECT_ID
      auth:
        workloadIdentity:
          clusterLocation: us-central1
          clusterName: your-cluster
          serviceAccountRef:
            name: external-secrets-sa
```

## Troubleshooting

### Common Issues

1. **"No such file or directory" error**:

   ```bash
   # Ensure you're authenticated
   gcloud auth application-default login
   ```

2. **"Permission denied" errors**:

   ```bash
   # Check your IAM permissions
   gcloud projects get-iam-policy YOUR_PROJECT_ID
   ```

3. **"API not enabled" errors**:

   ```bash
   # Enable Secret Manager API
   gcloud services enable secretmanager.googleapis.com
   ```

4. **"Quota exceeded" errors**:
   ```bash
   # Set quota project
   gcloud auth application-default set-quota-project YOUR_PROJECT_ID
   ```

### Debug Mode

Run Teller with verbose logging:

```bash
teller --verbose env
```

### Validate Secrets Exist

Check if secrets exist in Google Cloud:

```bash
# List all secrets
gcloud secrets list

# Check specific secret
gcloud secrets describe platform-jwt-secret
```

## Integration with Development Workflow

### 1. Local Development

Add to your shell profile (`.bashrc`, `.zshrc`):

```bash
# Load secrets for development
alias load-secrets='eval $(teller env)'

# Start development with secrets
alias dev-start='teller run -- npm run dev'
```

### 2. Docker Development

Create a `docker-compose.override.yml`:

```yaml
version: "3.8"
services:
  platform-api:
    environment:
      # Load from teller
      - DB_USERNAME
      - DB_PASSWORD
      - JWT_SECRET
```

Run with secrets:

```bash
teller run -- docker-compose up
```

### 3. Testing

Run tests with secrets:

```bash
teller run -- npm test
```

## Advanced Configuration

### Custom Provider Configuration

You can extend `.teller.yml` to use multiple providers:

```yaml
providers:
  google_secretmanager:
    kind: google_secretmanager
    maps:
      - id: prod
        path: ""

  # Add AWS Secrets Manager
  aws_secretsmanager:
    kind: aws_secretsmanager
    maps:
      - id: backup
        path: ""

secrets:
  env:
    PRIMARY_SECRET:
      provider: google_secretmanager
      path: primary-secret
    BACKUP_SECRET:
      provider: aws_secretsmanager
      path: backup-secret
```

### Template Integration

Use Teller with configuration templates:

```bash
# Create template
teller template --config .teller.yml --template config.template.json > config.json
```

## References

- [Teller Documentation](https://github.com/tellerops/teller)
- [Google Secret Manager](https://cloud.google.com/secret-manager/docs)
- [External Secrets Operator](https://external-secrets.io/)
- [Google Cloud IAM](https://cloud.google.com/iam/docs)

## Support

For issues with this configuration:

1. Check the [troubleshooting section](#troubleshooting)
2. Verify your Google Cloud setup
3. Test with `teller show --redact=false` (in secure environment only)
4. Check Google Cloud audit logs for permission issues
