# Production Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Environment Variables
- [ ] Create `.env.production` or configure environment variables in your hosting platform
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` with production Supabase URL
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` with production Supabase anon key
- [ ] **Never commit `.env.local` or `.env.production` to git**

### 2. Supabase Configuration
- [ ] Production Supabase project created
- [ ] Database tables created (run SQL from `SUPABASE_SETUP.md`)
- [ ] Row Level Security (RLS) policies configured
- [ ] Storage bucket `listings` created and set to public
- [ ] Storage policies configured for image uploads
- [ ] Authentication email provider enabled
- [ ] Redirect URLs configured for production domain
- [ ] Email templates customized (optional)

### 3. Code Quality
- [x] TypeScript errors fixed (`npx tsc --noEmit`)
- [x] No hardcoded secrets or API keys
- [x] Console.log statements reviewed (only errors/warnings remain)
- [x] All imports are valid
- [x] No unused dependencies

### 4. Build & Test
- [ ] Run production build: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Test all critical user flows:
  - [ ] Homepage loads
  - [ ] Listings page displays data
  - [ ] Listing detail page works
  - [ ] User signup/login works
  - [ ] Favorites add/remove works
  - [ ] Admin panel accessible (for admin users)
  - [ ] Admin can create/edit listings
  - [ ] Images upload correctly
  - [ ] Share functionality works
  - [ ] Contact buttons work

### 5. Performance
- [x] Images optimized with Next.js Image component
- [x] Remote image patterns configured in `next.config.ts`
- [x] Lazy loading implemented where appropriate
- [x] Bundle size optimized with `optimizePackageImports`

### 6. Security
- [x] Environment variables not exposed to client (only `NEXT_PUBLIC_*`)
- [x] Supabase RLS policies prevent unauthorized access
- [x] Admin routes protected with authentication
- [x] No sensitive data in client-side code
- [x] HTTPS enforced (handled by hosting platform)
- [ ] Content Security Policy configured (optional)

### 7. SEO & Metadata
- [ ] Update site metadata in `app/layout.tsx`
- [ ] Add proper page titles and descriptions
- [ ] Configure `robots.txt` (optional)
- [ ] Add `sitemap.xml` (optional)
- [ ] Configure Open Graph images (optional)

### 8. Analytics & Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring

### 9. Domain & Hosting
- [ ] Domain purchased and configured
- [ ] DNS records configured
- [ ] SSL certificate configured (automatic with most platforms)
- [ ] CDN configured (automatic with Vercel/Netlify)

### 10. Backup & Recovery
- [ ] Database backup strategy in place
- [ ] Storage backup configured
- [ ] Disaster recovery plan documented

---

## 🚀 Deployment Platforms

### Option 1: Vercel (Recommended)
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Configure environment variables
4. Deploy

**Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_SUPABASE_URL`
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: Netlify
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Configure environment variables

### Option 3: Self-Hosted (Docker)
1. Build Docker image
2. Configure environment variables
3. Deploy to your server
4. Set up reverse proxy (Nginx/Caddy)
5. Configure SSL with Let's Encrypt

### Option 4: AWS/GCP/Azure
1. Use their Next.js deployment guides
2. Configure environment variables
3. Set up CDN and SSL
4. Configure auto-scaling

---

## 📋 Post-Deployment Checks

### Immediate Checks (Within 1 hour)
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Images loading from Supabase
- [ ] Authentication works
- [ ] Database queries working
- [ ] No console errors in production
- [ ] Mobile responsive design works
- [ ] All links functional

### Within 24 Hours
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test from different devices/browsers
- [ ] Verify email delivery (signup, password reset)
- [ ] Test admin functionality
- [ ] Check analytics tracking

### Within 1 Week
- [ ] Monitor user feedback
- [ ] Check server costs
- [ ] Review performance metrics
- [ ] Optimize based on real usage
- [ ] Set up automated backups

---

## 🔧 Production Configuration

### Update Supabase Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration:
```
Site URL: https://yourdomain.com
Redirect URLs:
  - https://yourdomain.com/reset-password
  - https://yourdomain.com/login
  - https://yourdomain.com/signup
```

### Update Admin Email
In `hooks/useAuth.ts`, update the admin email check:
```typescript
const isAdminUser =
  session.user.user_metadata?.role === 'admin' ||
  session.user.email === 'your-admin-email@domain.com';
```

### Update Contact Information
In `app/(main)/listings/[id]/page.tsx`, update:
- Phone number: `tel:+251967549339`
- Telegram: `https://t.me/el_beba1`

---

## 🐛 Common Production Issues

### Issue: Images Not Loading
**Solution:**
- Check Supabase storage bucket is public
- Verify image URLs in database
- Check `next.config.ts` has correct remote patterns

### Issue: Authentication Not Working
**Solution:**
- Verify environment variables are set
- Check Supabase redirect URLs
- Ensure cookies are enabled

### Issue: Database Queries Failing
**Solution:**
- Check RLS policies in Supabase
- Verify user is authenticated
- Check Supabase logs for errors

### Issue: Build Fails
**Solution:**
- Run `npm run build` locally first
- Check TypeScript errors
- Verify all dependencies installed
- Clear `.next` folder and rebuild

---

## 📊 Performance Optimization

### Already Implemented
- ✅ Next.js Image optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Lazy loading
- ✅ Optimized bundle size

### Additional Optimizations (Optional)
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add service worker for offline support
- [ ] Implement image lazy loading with blur placeholders
- [ ] Add database query caching
- [ ] Implement CDN for static assets

---

## 🔐 Security Best Practices

### Already Implemented
- ✅ Environment variables for secrets
- ✅ Supabase RLS for data access control
- ✅ Authentication required for sensitive operations
- ✅ No sensitive data in client code

### Additional Security (Optional)
- [ ] Rate limiting on API routes
- [ ] CAPTCHA on signup/login
- [ ] Two-factor authentication
- [ ] Content Security Policy headers
- [ ] CORS configuration

---

## 📱 Mobile Optimization

### Already Implemented
- ✅ Responsive design
- ✅ Touch-friendly UI
- ✅ Mobile navigation
- ✅ Optimized images

### Test On
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Various screen sizes
- [ ] Slow network conditions

---

## 🎯 Final Steps

1. **Test Everything**
   - Run through all user flows
   - Test on multiple devices
   - Check all forms and buttons

2. **Monitor**
   - Set up error tracking
   - Monitor performance
   - Track user behavior

3. **Optimize**
   - Review analytics
   - Optimize slow pages
   - Fix reported issues

4. **Maintain**
   - Regular backups
   - Security updates
   - Feature improvements

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Supabase Discord**: https://discord.supabase.com

---

## ✨ You're Ready!

Once all checkboxes are complete, your application is production-ready. Good luck with your launch! 🚀
