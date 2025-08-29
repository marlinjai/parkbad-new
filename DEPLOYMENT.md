# Multi-Environment Deployment Guide

## Environment Setup

This project supports multiple deployment environments with different Sanity datasets:

### Environments

1. **Development** (`localhost:3000`)
   - Uses `development` Sanity dataset
   - Real-time updates (CDN disabled)
   - Local `.env.local` file

2. **Staging** (your staging domain)
   - Uses `development` Sanity dataset
   - Real-time updates (CDN disabled)
   - Environment variables set in Vercel

3. **Production** (your live domain)
   - Uses `production` Sanity dataset
   - CDN enabled for performance
   - Environment variables set in Vercel

## Vercel Configuration

### For Staging Environment:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add these variables for **Preview** deployments:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SANITY_API_VERSION=2023-07-03
SANITY_REVALIDATE_SECRET=hvqw4k29k2te0q1o39yla9
```

### For Production Environment:

Add these variables for **Production** deployments:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-07-03
SANITY_REVALIDATE_SECRET=hvqw4k29k2te0q1o39yla9
```

## Sanity Datasets

### Creating Development Dataset

If you don't have a `development` dataset yet:

1. Go to your Sanity project dashboard
2. Navigate to "Datasets"
3. Create a new dataset named `development`
4. You can either:
   - Start with empty content
   - Copy content from production dataset

### Dataset Management Commands

```bash
# List all datasets
npx sanity dataset list

# Create new dataset
npx sanity dataset create development

# Copy data from production to development
npx sanity dataset copy production development

# Export data from production
npx sanity dataset export production backup.tar.gz

# Import data to development
npx sanity dataset import backup.tar.gz development
```

## Deployment Workflow

### Staging Workflow:
1. Make changes in Sanity Studio using `development` dataset
2. Test locally with `npm run dev`
3. Push to staging branch → auto-deploys to staging domain
4. Test on staging environment
5. If satisfied, merge to main branch

### Production Workflow:
1. Merge to main branch → auto-deploys to production
2. Update production Sanity content as needed
3. Production uses `production` dataset

## Webhook Configuration

Set up separate webhooks for each environment:

### Staging Webhook:
- URL: `https://your-staging-domain.vercel.app/api/revalidate`
- Secret: `hvqw4k29k2te0q1o39yla9`
- Trigger: On publish/unpublish in `development` dataset

### Production Webhook:
- URL: `https://your-production-domain.com/api/revalidate`
- Secret: `hvqw4k29k2te0q1o39yla9`
- Trigger: On publish/unpublish in `production` dataset

## Environment Variables Reference

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_SANITY_DATASET` | `development` | `development` | `production` |
| `NODE_ENV` | `development` | `production` | `production` |
| `VERCEL_ENV` | - | `preview` | `production` |
| CDN Usage | Disabled | Disabled | Enabled |

## Testing

### Local Testing with Different Datasets:

```bash
# Test with development dataset (default)
npm run dev

# Test with production dataset locally
NEXT_PUBLIC_SANITY_DATASET=production npm run dev
```

## Troubleshooting

- **Content not updating on staging**: Check that CDN is disabled for staging
- **Wrong content showing**: Verify `NEXT_PUBLIC_SANITY_DATASET` environment variable
- **Webhook not working**: Check webhook URL and secret match environment
