# Etapa de construcción
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /especificacion-service ./cmd/server 

# Etapa de ejecución
FROM alpine:latest
WORKDIR /app
COPY --from=builder /especificacion-service .
EXPOSE 8081
CMD ["./especificacion-service"]
