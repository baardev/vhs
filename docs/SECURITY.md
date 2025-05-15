I'll help you harden your Ubuntu server running React/Next.js with Nginx to protect against crypto attacks. Let me provide you with a comprehensive security approach.

## Server Hardening Steps for Your Ubuntu Cloud Server

### 1. Update and Patch Your System

Based on my research, I'll provide you with a comprehensive security hardening guide for your Ubuntu server running React/Next.js with Nginx, focusing particularly on preventing crypto mining attacks. Let's implement these measures to secure your system:

## 1. Update Your System Regularly

First, ensure your system is fully updated:

```bash
sudo apt update
sudo apt full-upgrade -y
```

Set up automatic security updates to ensure you're protected from vulnerabilities:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 2. Secure SSH Access

SSH is often the first target for attackers. Let's harden it:

```bash
sudo nano /etc/ssh/sshd_config
```

Make these changes:

- Change `PermitRootLogin` to `no`
- Change default port from 22 to a non-standard port (like 2222)
- Set `PasswordAuthentication no` to force key-based authentication
- Add `AllowUsers yourusername` to restrict which users can log in
- Use `AddressFamily inet` to disable IPv6 connections if not needed

```bash
sudo systemctl restart sshd
```

## 3. Set Up SSH Key Authentication

Generate SSH keys if you haven't already:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your_server_ip -p 2222
```

## 4. Configure Firewall

Set up UFW (Uncomplicated Firewall):

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp # Your SSH port
sudo ufw allow 80/tcp # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

## 5. Install and Set Up Fail2ban

Fail2ban helps protect against brute force attacks:

```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Configure for SSH (using your custom port) and Nginx:

```
[sshd]
enabled = true
port = 2213
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
```

Start fail2ban:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 6. Secure Nginx Configuration

Edit your Nginx configuration:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add these security improvements:

```nginx
# Hide Nginx version
server_tokens off;

# Configure SSL properly
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1h;
ssl_session_tickets off;

# HTTP security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Disable potentially dangerous HTTP methods
if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE)$) {
    return 444;
}
```

Generate strong DH parameters for better security:

```bash
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

Add to your Nginx SSL configuration:

```nginx
ssl_dhparam /etc/nginx/dhparam.pem;
```

## 7. Implement ModSecurity Web Application Firewall

Install ModSecurity for Nginx:

```bash
sudo apt install libmodsecurity3 libmodsecurity-dev nginx-module-security
```

Configure ModSecurity:

```bash
sudo mkdir -p /etc/nginx/modsec
sudo wget -P /etc/nginx/modsec/ https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended
sudo mv /etc/nginx/modsec/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf
```

Edit the configuration:

```bash
sudo nano /etc/nginx/modsec/modsecurity.conf
```

Change `SecRuleEngine DetectionOnly` to `SecRuleEngine On`

Install OWASP Core Rule Set:

```bash
sudo wget https://github.com/coreruleset/coreruleset/archive/v3.3.2.tar.gz
sudo tar -xzf v3.3.2.tar.gz -C /etc/nginx/modsec/
sudo mv /etc/nginx/modsec/coreruleset-3.3.2 /etc/nginx/modsec/owasp-crs
sudo cp /etc/nginx/modsec/owasp-crs/crs-setup.conf.example /etc/nginx/modsec/owasp-crs/crs-setup.conf
```

Create a ModSecurity include file:

```bash
sudo nano /etc/nginx/modsec/main.conf
```

Add:

```
Include /etc/nginx/modsec/modsecurity.conf
Include /etc/nginx/modsec/owasp-crs/crs-setup.conf
Include /etc/nginx/modsec/owasp-crs/rules/*.conf
```

Update your Nginx configuration to use ModSecurity:

```nginx
server {
    # Other configurations...
    
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
    
    # Rest of your config...
}
```

## 8. Set Up Cryptocurrency Mining Protection

Install ClamAV for malware detection:

```bash
sudo apt install clamav clamav-daemon
```

Update virus definitions and scan your system:

```bash
sudo systemctl stop clamav-freshclam
sudo freshclam
sudo systemctl start clamav-freshclam
sudo clamscan -r /
```

Install and configure RootKit Hunter:

```bash
sudo apt install rkhunter
sudo rkhunter --update
sudo rkhunter --propupd
sudo rkhunter --check
```

## 9. Prevent Unauthorized Process Execution

Install and configure AppArmor:

```bash
sudo apt install apparmor apparmor-utils
sudo aa-enforce /etc/apparmor.d/*
```

## 10. Monitor System Resources and Set Up Alerts

Install tools to monitor system resources:

```bash
sudo apt install htop iotop iftop
```

Set up process monitoring with sysstat:

```bash
sudo apt install sysstat
sudo systemctl enable sysstat
sudo systemctl start sysstat
```

Install and configure Logwatch for log monitoring:

```bash
sudo apt install logwatch
sudo logwatch --output mail --mailto your.email@example.com --detail high
```

## 11. Secure Redis (if you're using it)

Since you mentioned "port rescue", I'm assuming you might be using Redis. If so, secure it properly:

```bash
sudo nano /etc/redis/redis.conf
```

Make these changes:

- Set `bind 127.0.0.1` to restrict access to localhost only
- Set `protected-mode yes`
- Configure a strong password with `requirepass YourStrongPassword`
- Disable dangerous commands: `rename-command FLUSHALL ""`
- Ensure Redis is not running as root

## 12. Secure Environment Variables for Next.js

Store sensitive data in environment variables securely:

```bash
sudo nano /etc/environment
```

Or create a `.env.local` file for your Next.js application and ensure proper permissions:

```bash
sudo chown your-user:your-user /path/to/your/app/.env.local
sudo chmod 600 /path/to/your/app/.env.local
```

## 13. Regular Security Audits

Install Lynis for security auditing:

```bash
sudo apt install lynis
sudo lynis audit system
```

## 14. Implement File Integrity Monitoring

Install and configure AIDE (Advanced Intrusion Detection Environment):

```bash
sudo apt install aide
sudo aideinit
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

Set up a daily check:

```bash
sudo nano /etc/cron.daily/aide-check
```

Add:

```bash
#!/bin/bash
/usr/bin/aide --check | mail -s "AIDE report for $(hostname)" your.email@example.com
```

Make it executable:

```bash
sudo chmod +x /etc/cron.daily/aide-check
```

## 15. Implement Process Controls

Install CGroups to limit CPU usage and prevent crypto mining:

```bash
sudo apt install cgroup-tools
```

Create a configuration file:

```bash
sudo nano /etc/cgconfig.conf
```

Add:

```
group cpulimited {
    cpu {
        cpu.shares = 512;
        cpu.cfs_quota_us = 50000;
    }
}
```

This will limit processes to 50% CPU usage.

## Conclusion

These measures significantly harden your Ubuntu server against various attacks, including cryptocurrency mining. Remember to:

1. Keep your system updated
2. Regularly check logs for suspicious activity
3. Monitor system resources for unusual CPU spikes
4. Implement defense in depth with multiple security layers
5. Keep backups of your data and configuration
6. Perform regular security audits

For complete security, I recommend implementing all these measures, as cryptocurrency miners often exploit multiple vulnerabilities to gain access to systems. The recommended controls address security at the system, network, application, and resource levels.