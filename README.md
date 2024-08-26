# Client Gateway

# Dev

1. Clonar el repositorio
2. Instalar las dependencias con `pnpm install`
3. Crear un archivo `.env` en base al archivo `.env.example`
4. Levantar el servidor de nats
5. Correr el servidor con `pnpm start:dev`

## Nats
```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

# Prod

Ejecutar
```
docker build -f dockerfile.prod -t client-gateway .
```
