# Etapa de construcción
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copiar los archivos de dependencias
COPY go.mod ./
RUN go mod download

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -o /oferta-service ./cmd/server

# Etapa de ejecución
FROM alpine:latest

WORKDIR /app

# Copiar el binario de la etapa de construcción
COPY --from=builder /oferta-service .

# Puerto en el que se ejecutará la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["./oferta-service"]
