package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"backend/internal/handler"
	"backend/internal/model"
	"backend/internal/repository"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Configuración de la base de datos
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "app_db")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	// Intentar conectar a la base de datos con reintentos
	var db *gorm.DB
	var dbErr error
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		db, dbErr = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if dbErr == nil {
			// Verificar la conexión
			sqlDB, err := db.DB()
			if err == nil {
				err = sqlDB.Ping()
				if err == nil {
					log.Printf("✅ Conexión exitosa a la base de datos en %s:%s", dbHost, dbPort)
					break
				}
			}
		}
		log.Printf("Intento %d/%d: Error al conectar a la base de datos: %v", i+1, maxRetries, dbErr)
		if i < maxRetries-1 {
			time.Sleep(3 * time.Second)
		}
	}

	if dbErr != nil {
		log.Fatalf("❌ No se pudo conectar a la base de datos después de %d intentos: %v", maxRetries, dbErr)
	}

	// Auto-migrar modelos
	if err := db.AutoMigrate(&model.Area{}, &model.Persona{}); err != nil {
		log.Fatalf("❌ Error al realizar la migración: %v", err)
	}

	log.Println("✅ Migración de la base de datos completada con éxito")

	// Configuración del enrutador Gin
	r := gin.Default()

	// Middleware de CORS
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

	// Inicializar repositorios
	areaRepo := repository.NewAreaRepository(db)
	personaRepo := repository.NewPersonaRepository(db)

	// Inicializar servicios
	areaService := service.NewAreaService(areaRepo)
	personaService := service.NewPersonaService(personaRepo)

	// Inicializar handlers
	areaHandler := handler.NewAreaHandler(areaService)
	personaHandler := handler.NewPersonaHandler(personaService)

	// Grupo de rutas de la API
	api := r.Group("/api/v1")
	{
		// Ruta de salud
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "ok",
				"service": "backend-monolito",
			})
		})

		// Rutas de áreas
		areas := api.Group("/areas")
		{
			areas.POST("", areaHandler.Create)
			areas.GET("", areaHandler.GetAll)
			areas.GET("/:id", areaHandler.GetByID)
			areas.PUT("/:id", areaHandler.Update)
			areas.DELETE("/:id", areaHandler.Delete)
			areas.GET("/conteo", areaHandler.GetAreasConConteo)
		}

		// Rutas de personas
		personas := api.Group("/personas")
		{
			personas.POST("", personaHandler.Create)
			personas.GET("", personaHandler.GetAll)
			personas.GET("/:id", personaHandler.GetByID)
			personas.PUT("/:id", personaHandler.Update)
			personas.DELETE("/:id", personaHandler.Delete)
			personas.GET("/email/:email", personaHandler.GetByEmail)
		}
	}

	// Iniciar servidor
	port := getEnv("PORT", "8080")
	log.Printf("🚀 Servidor iniciado en el puerto %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Error al iniciar el servidor: %v", err)
	}
}

// getEnv obtiene el valor de una variable de entorno o retorna un valor por defecto
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
