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
```

notes:

```sh
# most mount/bind the docker dir to the local volume
services:
  nginx:
    volumes:
      - ./logs/nginx:/var/log/nginx   # needed to access the log files for Fail2Ban

```

create `/etc/fail2ban/jail.local`

```sh
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5


[nginx-malicious]
enabled = true
port = http,https
filter = nginx-malicious
logpath = /home/jw/sites/vhs/logs/nginx/access.log
maxretry = 1
findtime = 60
bantime = 86400
backend = auto

[nginx-winvnc]
enabled = true
filter = nginx-winvnc
action = iptables[name=nginx-winvnc, port=http, protocol=tcp]
logpath = /home/jw/sites/vhs/logs/nginx/access.log
maxretry = 1
findtime = 600
bantime = 86400

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
logpath = /home/jw/sites/vhs/logs/nginx/access.log
maxretry = 3

```

create ` /etc/fail2ban/jail.d/defaults-debian.conf`

```sh
[DEFAULT]
banaction = nftables
banaction_allports = nftables[type=allports]
backend = systemd

[sshd]
enabled = true

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

Add to limit processes to 50% CPU usage.

```
group cpulimited {
    cpu {
        cpu.shares = 512;
        cpu.cfs_quota_us = 50000;
    }
}
```



# System Architecture Overview

You've described a multi-layered network architecture with Docker containers and complex firewall configurations. Here's a brief explanation:

## Overall System Components

1. Docker Container Environment

   :

   - Frontend container (likely Next.js) on port 3000
   - Backend container (likely API server) on port 4000
   - PostgreSQL database container (no direct external port)
   - BuildKit container for Docker building operations

2. Web Services

   :

   - Production web traffic on standard ports 80 (HTTP) and 443 (HTTPS)
   - Development web interfaces on ports 3000, 4000, and 6541
   - Standalone web monitoring tool on port 9090 (outside Docker)

3. Remote Access

   :

   - SSH service running on non-standard port 2213 (security through obscurity)

## Multi-layered Firewall Setup

Your system uses a complex combination of firewall technologies:

1. NFTables

   : The modern Linux firewall subsystem

   - Used as the primary packet filtering framework
   - Provides the backend for other firewall systems

2. Legacy IPTables

   : The classic Linux firewall tool

   - Used alongside NFTables in a hybrid approach
   - Directly manages Docker network rules
   - Currently has INPUT policy set to DROP (default deny)
   - Explicitly allows ports 2213, 80, 443, 53, 3000, 4000, 6541

3. UFW (Uncomplicated Firewall)

   :

   - Front-end for easier management of NFTables/IPTables
   - Provides simplified interface for managing firewall rules

4. Docker's Network Integration

   :

   - Docker creates its own chains in IPTables (DOCKER, DOCKER-USER, etc.)
   - Custom bridges for container networking (br-41fb80084158, etc.)
   - Port forwarding from host to containers
   - Currently binding containers only to localhost (127.0.0.1)

## Key Challenges

The main issue in your system is that the Docker containers are bound to localhost only, making them inaccessible from the internet despite having the necessary firewall ports open. This creates a situation where external traffic is allowed to reach the server, but is then unable to reach the containerized services.

This multi-layered approach provides flexibility and security but requires careful coordination between the different firewall technologies to ensure proper traffic flow.



## ## Saving iptable data

create `/etc/docker/daemon.json`

```sh
# Let Docker manage its own rules
{
  "iptables": true
}
```

Install...

```json
sudo apt install iptables-persistent
# to save...
sudo netfilter-persistent save
```

Configure Docker restart order: Ensure Docker starts after netfilter-persistent so Docker can apply its rules last:

```sh
sudo systemctl edit docker.service
# add line below in teh emto top space

#---
### Anything between here and the comment below will become the contents of the drop-in file

[Unit]
After=netfilter-persistent.service

### Edits below this comment will be discarded
#---

```





## iptables

```sh
sudo nft list ruleset # show nftable rules
sudo iptables -L -n -v # Show IPv4 iptables rules (filter table — default):

sudo iptables -t nat -L -n -v # 🔍 Show IPv4 iptables rules for the NAT table:
sudo iptables-save #  List all iptables rules including custom chains

sudo iptables -L DOCKER-USER -v -n # View Docker user-defined rules:
sudo iptables -I DOCKER-USER -s 203.0.113.100 -j DROP # Add a custom Docker rule.
sudo iptables -L DOCKER-USER --line-numbers -n # First list them with line numbers:
sudo iptables -D DOCKER-USER 3 # Then delete, for example, line 3
sudo iptables -F DOCKER-USER # lush all custom Docker rules

sudo iptables -A INPUT -p tcp --dport 9090 -j ACCEPT # open a port
sudo netfilter-persistent save # make permanant

# If no DOCKER chain exists:
docker ps # make sure all containers are up
sudo systemctl restart docker  # resdtart docker
sudo iptables -L DOCKER-USER -v -n

# Block all inbound traffic from a malicious IP to Docker
sudo iptables -I DOCKER-USER -s 203.0.113.66 -j DROP 

# Allow only your IP to reach Docker containers
sudo iptables -I DOCKER-USER -s YOUR.IP.ADDRESS.HERE -j ACCEPT
sudo iptables -A DOCKER-USER -j DROP


sudo iptables -F DOCKER-USER #  clear the DOCKER-USER rules

# Unless specified explicity, all IPs are using dockerinterface `docker0`.  


```

## nftables

Used in backend iptable management only for now.  Do not use nftabls commands

## ufw

100% compatible with iptables legacy (which we are using gas that that is what docker supports)

```sh
sudo apt install ufw

# Opening Ports
sudo ufw allow 9090 # Open a specific port for any protocol
sudo ufw allow 9090/tcp # Specify the protocol (tcp/udp)
sudo ufw allow from 192.168.1.100 to any port 9090 # Allow from specific IP address
sudo ufw allow from 192.168.0.0/24 to any port 9090 # Allow from a subnet

# Closing/Dropping Ports
sudo ufw deny 8080/tcp # Deny traffic on a port
sudo ufw reject 8080/tcp # Drop packets (no response sent)
sudo ufw delete 5 # Remove a rule (by number)
sudo ufw delete allow 9090/tcp # Remove a rule (by number)

# Status and Information
sudo ufw status # Check firewall status
sudo ufw status verbose # Verbose status with more details
sudo ufw status numbered # Numbered list of rules (useful for deletion)
sudo ss -tuln # Show listening services

# Service Management
sudo ufw allow ssh # Allow a service by name
sudo ufw allow 2213/tcp comment 'SSH on custom port' # Allow service on non-standard port
sudo ufw allow from 192.168.1.0/24 to any app OpenSSH # Allow specific service to specific network

# Application Profiles
sudo ufw app list # List available application profiles
sudo ufw app info 'Nginx Full' # Get info about a specific application profile
sudo ufw allow 'Nginx Full' # Allow using application profile

# Rate Limiting
sudo ufw limit ssh # Limit SSH connections (prevent brute force)
sudo ufw limit 2213/tcp comment 'Rate limit SSH' # Limit custom SSH port

# Working with Docker
sudo ufw allow from 172.17.0.0/16 # Allow Docker subnet
sudo ufw route allow from 172.19.0.0/16 to 172.20.0.0/16 # Route between specific Docker networks

# UFW Management
sudo ufw enable # Enable UFW (be careful with SSH access!)
sudo ufw disable # Disable UFW
sudo ufw reset # Reset all rules
sudo ufw reload # Reload rules

# Logging
sudo ufw logging on # # Set log level
sudo ufw logging medium  # Options: low, medium, high, full

# Complex Examples
sudo ufw allow log 80/tcp # Allow web traffic but log it

# Forward ports (requires additional iptables setup)
sudo ufw route allow in on eth0 out on eth1 to 192.168.1.100 port 80 proto tcp

# Create a more secure web server setup
sudo ufw allow from any to any port 80 proto tcp
sudo ufw allow from any to any port 443 proto tcp
sudo ufw deny from any to any port 8080 proto tcp


# Save with 
netfilter-persistent save
```



##  ufw-docker

Docker has it’s own ufw rules, so ufw in general will not help secure docker’.  This docker wrapper helps with that.  

Docker has it’s own UFW rules, so UFW in general will not work.  This docker wrapper help.  View README.md in repo.

```sh
cd ~/src
git clone https://github.com/chaifeng/ufw-docker.git
cd ufw-docker
sudo ./install.sh
./ufw-docker install
sudo ./ufw-docker install

# to ban an IP for docker 

cd ~/src/ufw-docker
sudo ./ufw-docker deny in on docker0 from 152.237.64.11
sudo ufw status verbose # to confirm it is in the iptables

# You CANNOT SAVE with `netfilter-persistent save`
```
To ban an IP

```sh
cd ~/src/ufw-docker
# Unless specifrdied explicity, all are using docker interface `docker0`.  
sudo ./ufw-docker deny in on docker0 from 152.237.64.11
sudo ufw status verbose # to confirm it is in the iptables
```



## Move postgress to a new port



## Conclusion

1. Keep your system updated
2. Regularly check logs for suspicious activity
3. Monitor system resources for unusual CPU spikes
4. Implement defense in depth with multiple security layers
5. Keep backups of your data and configuration
6. Perform regular security audits

