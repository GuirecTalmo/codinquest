# Checklist de mise en ligne — codinquest.guirectalmo.com

## Avant de commencer
- [x] Contact éditeur (`sangwyss.dev@gmail.com`) renseigné dans
      `app/confidentialite/page.tsx` et `app/cgu/page.tsx`
- [ ] Vérifier `deploy/codeinquest.service` : chemin (`/opt/codeinquest`),
      user (`codeinquest`) et port (`3000`) conviennent, ou les adapter

## DNS (chez le registrar)
- [ ] Ajouter un enregistrement A `codinquest` → IP publique du VPS
      (AAAA en plus si IPv6)
- [ ] Attendre la propagation (quelques minutes à quelques heures)

## VPS — prérequis système
- [ ] Node.js 20+ LTS installé
- [ ] PostgreSQL installé
- [ ] Caddy installé

## Base de données
- [ ] Créer l'utilisateur et la base PostgreSQL (`codeinquest` / `codeinquest`)
- [ ] Choisir un mot de passe fort pour cet utilisateur (ne pas le réutiliser
      ailleurs, ne jamais le mettre dans un fichier commité)

## Code et configuration
- [ ] Cloner le repo dans `/opt/codeinquest`
- [ ] Copier `.env.example` vers `.env`
- [ ] Renseigner `DATABASE_URL` avec le vrai mot de passe DB
- [ ] Renseigner `NEXTAUTH_SECRET` (valeur générée : voir conversation,
      ne pas réutiliser le secret du `.env` local de dev)
- [ ] Vérifier `NEXTAUTH_URL` et `NEXT_PUBLIC_SITE_URL` =
      `https://codinquest.guirectalmo.com`
- [ ] `npm ci`
- [ ] `npx prisma generate`

## Base de données — schéma et contenu
- [ ] `npx prisma db push` (crée les tables)
- [ ] `npx prisma db seed` (charge les 360 questions / 42 quiz)
- [ ] ⚠️ Supprimer immédiatement le compte de seed `admin@test.com` :
      `psql -d codeinquest -c "DELETE FROM \"User\" WHERE email='admin@test.com';"`

## Build et service
- [ ] `npm run build`
- [ ] Créer l'utilisateur système `codeinquest`
- [ ] Copier `deploy/codeinquest.service` vers `/etc/systemd/system/`
- [ ] `systemctl daemon-reload && systemctl enable --now codeinquest`
- [ ] `systemctl status codeinquest` → `active (running)`

## Reverse proxy / HTTPS
- [ ] Copier `deploy/Caddyfile` vers `/etc/caddy/Caddyfile`
- [ ] `systemctl restart caddy`
- [ ] Vérifier que le certificat Let's Encrypt est bien émis

## Firewall
- [ ] `ufw allow 80,443/tcp`
- [ ] `ufw allow OpenSSH`
- [ ] `ufw enable`
- [ ] Vérifier que le port 3000 n'est pas accessible depuis l'extérieur

## Vérifications finales
- [ ] `https://codinquest.guirectalmo.com` répond en HTTPS
- [ ] `/robots.txt` et `/sitemap.xml` pointent vers le bon domaine
- [ ] Inscription + connexion fonctionnent
- [ ] Le compte `admin@test.com` n'existe plus
- [ ] Lien RGPD / CGU visibles et fonctionnels sur la landing et le signup
