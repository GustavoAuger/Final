package handler

import (
	"log"
	"net/http"
	"strconv"

	"especificacion-service/internal/model"
	"especificacion-service/internal/service"

	"github.com/gin-gonic/gin"
)

type EspecificacionHandler struct {
	service service.EspecificacionService
}

func NewEspecificacionHandler(service service.EspecificacionService) *EspecificacionHandler {
	return &EspecificacionHandler{service: service}
}

// CreateEspecificacion: crea una nueva especificación
func (h *EspecificacionHandler) CreateEspecificacion(c *gin.Context) {
	var especificacion model.Especificacion
	if err := c.ShouldBindJSON(&especificacion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateEspecificacion(&especificacion); err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "ya existe una especificación para esta oferta" {
			statusCode = http.StatusBadRequest
		}
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, especificacion)
}

// GetEspecificacion: obtiene una especificación por su ID
func (h *EspecificacionHandler) GetEspecificacion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	especificacion, err := h.service.GetEspecificacionByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Especificación no encontrada"})
		return
	}

	c.JSON(http.StatusOK, especificacion)
}

// GetEspecificacionPorOferta: obtiene una especificación por el ID de la oferta
func (h *EspecificacionHandler) GetEspecificacionPorOferta(c *gin.Context) {
	ofertaID, err := strconv.ParseUint(c.Param("ofertaId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de oferta inválido"})
		return
	}

	especificacion, err := h.service.GetEspecificacionByOfertaID(int(ofertaID))
	if err != nil {
		// Log del error para debugging
		log.Printf("Error al buscar especificación para oferta ID %d: %v", ofertaID, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Especificación no encontrada para esta oferta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": especificacion})
}

// UpdateEspecificacion actualiza una especificación existente
func (h *EspecificacionHandler) UpdateEspecificacion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var updateData model.Especificacion
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Asegurarse de que el ID de la URL coincida con el del cuerpo
	updateData.ID = uint(id)

	if err := h.service.UpdateEspecificacion(&updateData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": updateData})
}

// DeleteEspecificacion elimina una especificación
func (h *EspecificacionHandler) DeleteEspecificacion(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := h.service.DeleteEspecificacion(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar la especificación"})
		return
	}

	c.Status(http.StatusNoContent)
}

// ListEspecificaciones lista todas las especificaciones
func (h *EspecificacionHandler) ListEspecificaciones(c *gin.Context) {
	especificaciones, err := h.service.GetAllEspecificaciones()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las especificaciones"})
		return
	}

	c.JSON(http.StatusOK, especificaciones)
}
