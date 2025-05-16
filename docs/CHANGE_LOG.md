
# Todo
 - JW: [404] /reset-password - 0.92s - 2326 bytes
 - JW: email not working (for pw reset and securioty logs)
 - JW: database still must be rebuilt, so still volatile
 - JW: test apparmor - last time I think it broke the site due to over aggressive security

 - VN: need wireframes, bg images, UI text, icons, logos
 
 - MR: Handicap api and UI



## 0.0.46
- Mock up handicap system /handicap
- Added DOC comments to all in ./utils
- Added API based logger that logs to (in docker) /tmp/backend-debug.log (like console.log(), but to file instead of console)
- Added log view at /view-logs
- Added PROCESS.md which attempts to clarify the process in general

## 0.0.53
- global logger
- upload scorebord mock
- template and mobile support

## 0.0.55
- Update to CLEARCACHE to delete extremely stubborn caches

## 0.0.63 
- Major DB rewrite, all teh DB create sql,csv,and sh scripts

## 0.0.64
- working examples of new DB
- - https://libronico.com/api/courses   (backend/src/routes/courses.ts)
- - https://libronico.com/course-data  (frontend/pages/courses/index.tsx)

## 0.0.74 
- major revamp of handicap calc and display.  

## 0.0.76
- New Score Card added with dropdown coursename and keys trr_names 

## 0.0.80
- Added api docs in ./doc and api/url tests
 
## 0.0.81
- added docs/make_reports.sh, generates txt for 
- - https://libronico.com/reports/api.txt
- - https://libronico.com/reports/url.txt

## 0.0.88
- created symlink from /.env to /backend/.env and /docs/.env as the same .env vars need to be in each folder 
- changed DB passwd
- renamed SETUP_DEV/PROD to DEV_SETUP, PROD_SETUP
- - Both setups import ". ./.env"
- removed all usernames/passwords form the code and replaced with envvars via ${} and dotenv
- changed perms on many files as teh site was being hacked for crypto-locking.  Rebult site from scratch with hardened security.

## 0.0.91
- added DOC comments to all files referencing from/to calls and desc
- added OnLook consts to _documents.tsx

## 0.0.93
- fixed email login notification
- fixed DEV/PROD build selection
- limit auth token to 15 min
- fixed password reset email link
- all .sh now require sourcing {$HOME}/sites/vhs/.env



