# Guida al Deploy: quiz.linuxbari.it (Porta 8087 con Traefik)

Questa guida spiega i passaggi esatti per pubblicare **APEX Grand Prix Quiz** su `quiz.linuxbari.it` tramite **Docker Compose** e **Traefik**.

---

## 1. Configurazione Già Applicata

Nel progetto trovi tutto già preconfigurato:

- **Dominio**: `quiz.linuxbari.it`
- **Porta Host**: `8087` (mappata verso la porta 80 interna del container Nginx)
- **Labels Traefik**: già presenti in [`docker-compose.yml`](file:///home/francesco/Progetti/motorsport-quiz/docker-compose.yml):
  * `traefik.enable=true`
  * `traefik.http.routers.motorsport-quiz.rule=Host(\`quiz.linuxbari.it\`)`
  * `traefik.http.routers.motorsport-quiz.entrypoints=websecure`
  * `traefik.http.routers.motorsport-quiz.tls=true`
  * `traefik.http.routers.motorsport-quiz.tls.certresolver=letsencrypt`
  * `traefik.http.services.motorsport-quiz.loadbalancer.server.port=80`

---

## 2. Deploy sul Server (3 Semplici Comandi)

Sul tuo server Linux:

```bash
# 1. Clona il repository pubblico da GitHub
git clone https://github.com/frater1998/motorsport-quiz.git

# 2. Entra nella cartella
cd motorsport-quiz

# 3. Avvia il container in produzione
docker compose up -d --build
```

Il container verrà compilato e avviato in pochi secondi. L'app risponderà localmente su:
`http://localhost:8087`

---

## 3. Integrazione con Traefik (Rete `proxy`)

Il file [`docker-compose.yml`](file:///home/francesco/Progetti/motorsport-quiz/docker-compose.yml) è già impostato con:
- La label obbligatoria: `"traefik.docker.network=proxy"`
- La connessione alla rete esterna: `proxy`
- La porta interna del container: `80`

Se sul server hai fatto il pull:
```bash
git pull origin main
docker compose up -d
```
Traefik individuerà subito l'IP del container sulla rete `proxy` senza generare l'errore Bad Gateway.


### Modalità B: Tramite File Provider Dinamico di Traefik (su porta 8087)
Se invece gestisci i router di Traefik tramite un file YAML dinamico (es. `dynamic_conf.yml`), ti basta aggiungere questo blocco:

```yaml
http:
  routers:
    motorsport-quiz:
      rule: "Host(`quiz.linuxbari.it`)"
      entryPoints:
        - "websecure"
      service: "motorsport-quiz-service"
      tls:
        certResolver: "letsencrypt"

  services:
    motorsport-quiz-service:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:8087"
```

---

## 4. Record DNS

Nel pannello DNS di `linuxbari.it`:
- **Tipo**: `A`
- **Nome (Host)**: `quiz`
- **Valore (Indirizzo IP)**: L'IP pubblico del tuo server.

Una volta propagato il record DNS, il quiz sarà online e protetto da HTTPS su:
👉 **https://quiz.linuxbari.it**
