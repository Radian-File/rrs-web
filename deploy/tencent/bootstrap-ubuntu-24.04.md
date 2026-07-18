# Tencent Cloud CVM Bootstrap — Ubuntu 24.04

> Run these steps manually on the CVM. They harden the host but do not deploy RRS automatically.

## 1. Tencent Cloud firewall / Security Group

Allow only:

| Port | Source | Purpose |
|---|---|---|
| 22/TCP | Your current public IP only | SSH administration |
| 80/TCP | 0.0.0.0/0, ::/0 | Initial HTTP/IP verification and ACME challenge |
| 443/TCP | 0.0.0.0/0, ::/0 | HTTPS after domain/TLS setup |

Do **not** open 3000, 5432, or Docker internal ports publicly.

## 2. Create non-root deployment user

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

Verify key login in a separate terminal before continuing. Then edit `/etc/ssh/sshd_config.d/rrs.conf`:

```text
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
```

```bash
sudo systemctl reload ssh
```

## 3. Base host hardening

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git ufw fail2ban
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from YOUR_PUBLIC_IP to any port 22 proto tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo systemctl enable --now fail2ban
```

## 4. Docker Engine and Compose plugin

Install Docker Engine using Docker's official Ubuntu repository, then verify:

```bash
docker --version
docker compose version
sudo usermod -aG docker deploy
```

Log out and back in after changing group membership.

## 5. Repository and production environment

```bash
sudo mkdir -p /srv/rrs-web
sudo chown deploy:deploy /srv/rrs-web
cd /srv/rrs-web
git clone YOUR_PRIVATE_REPOSITORY_URL .
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Generate secrets locally on the server; never commit or paste them into chat:

```bash
openssl rand -base64 48
openssl rand -hex 32
```

## 6. Start staging by IP

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs -f app nginx
```

Verify from the server and browser:

```bash
curl -I http://127.0.0.1
curl -I http://PUBLIC_SERVER_IP
```

## 7. Backups before domain/TLS production use

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > rrs-$(date +%F).sql.gz
docker run --rm -v rrs-web_rrs_uploads:/data -v "$PWD/backups:/backup" alpine tar czf /backup/rrs-uploads-$(date +%F).tgz -C /data .
```

Test restoring both database and upload backup into an isolated environment before treating the server as production-ready.

## 8. Domain and HTTPS later

After DNS A record points to the CVM and HTTP works:

1. Obtain a certificate with Certbot or another approved ACME workflow.
2. Replace the HTTP Nginx config with `deploy/nginx/rrs.https.conf.example` after filling domain paths.
3. Mount certificate directory read-only into Nginx compose service.
4. Add `443:443` to Nginx ports.
5. Change `NEXT_PUBLIC_APP_URL` to `https://YOUR_DOMAIN`.
6. Restart compose and verify HTTPS, redirect, webhook URLs, CSP, and trusted forwarded headers.

Do not enable Midtrans production keys until HTTPS domain and webhook verification are complete.
