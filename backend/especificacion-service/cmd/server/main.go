package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	ofertaclient "especificacion-service/internal/clients/ofertaclient"
	"especificacion-service/internal/consul"
	"especificacion-service/internal/handler"
	"especificacion-service/internal/model"
	"especificacion-service/internal/repository"
	"especificacion-service/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Configuración de la base de datos
	dbHost := getEnv("DB_HOST", "db_especificacion")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "especificaciones_db")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)
	
	// Intentar conectar a la base de datos con reintentos
	var db *gorm.DB
	var dbErr error
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		db, dbErr = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if dbErr == nil {
			// Verificar la conexión
			sqlDB, err := db.DB()
			if err == nil {
				err = sqlDB.Ping()
				if err == nil {
					log.Printf("Conexión exitosa a la base de datos en %s:%s", dbHost, dbPort)
					break
				}
			}
		}
		log.Printf("Intento %d: Error al conectar a la base de datos: %v", i+1, dbErr)
		if i < maxRetries-1 {
			time.Sleep(5 * time.Second)
		}
	}

	if dbErr != nil {
		log.Fatalf("No se pudo conectar a la base de datos después de %d intentos: %v", maxRetries, dbErr)
	}

	// Auto-migrar modelos
	if err := db.AutoMigrate(&model.Especificacion{}); err != nil {
		log.Fatalf("Error al realizar la migración: %v", err)
	}

	log.Println("Migración de la base de datos completada con éxito")

	// Configuración del enrutador
	r := gin.Default()

	// Configurar CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Inicializar capas
	ofertaClient := ofertaclient.NewClient() // Usando Traefik como punto de entrada

	especificacionRepo := repository.NewEspecificacionRepository(db)
	especificacionService := service.NewEspecificacionService(especificacionRepo, ofertaClient)
	especificacionHandler := handler.NewEspecificacionHandler(especificacionService)

	// Grupo de rutas de la API
	api := r.Group("/api/v1")
	{
		// Ruta de salud
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status": "ok",
			})
		})

		// Rutas de especificaciones
		especificaciones := api.Group("/especificaciones")
		{
			especificaciones.POST("", especificacionHandler.CreateEspecificacion)
			especificaciones.GET("", especificacionHandler.ListEspecificaciones)
			especificaciones.GET(":id", especificacionHandler.GetEspecificacion)
			especificaciones.GET("oferta/:ofertaId", especificacionHandler.GetEspecificacionPorOferta)
			especificaciones.PUT(":id", especificacionHandler.UpdateEspecificacion)
			especificaciones.DELETE(":id", especificacionHandler.DeleteEspecificacion)
		}
	}

	// Configuración del puerto
	port := getEnv("PORT", "8081")
	portInt, _ := strconv.Atoi(port)

	// Registrar el servicio en Consul
	consulAddr := getEnv("CONSUL_HTTP_ADDR", "localhost:8500")
	serviceName := getEnv("SERVICE_NAME", "especificacion-service")

	consulClient, err := consul.NewClient(consulAddr)
	if err != nil {
		log.Fatalf("Error al crear el cliente de Consul: %v", err)
	}

	// Registrar el servicio
	err = consulClient.RegisterService(serviceName, portInt)
	if err != nil {
		log.Fatalf("Error al registrar el servicio en Consul: %v", err)
	}
	log.Printf("Servicio registrado en Consul como %s en el puerto %d", serviceName, portInt)

	// Configurar el cierre adecuado
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Iniciar el servidor en una goroutine
	go func() {
		log.Printf("Servicio de especificaciones iniciado en el puerto %s", port)
		if err := r.Run(":" + port); err != nil {
			log.Fatalf("Error al iniciar el servidor: %v", err)
		}
	}()

	// Esperar señal de terminación
	<-quit
	log.Println("Apagando el servicio...")

	// Desregistrar el servicio de Consul
	if err := consulClient.DeregisterService(serviceName + "-1"); err != nil {
		log.Printf("Error al desregistrar el servicio de Consul: %v", err)
	} else {
		log.Println("Servicio desregistrado de Consul")
	}

	log.Println("Servicio detenido correctamente")
}

// getEnv obtiene una variable de entorno o un valor por defecto
func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}
