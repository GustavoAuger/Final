package handler

import (
	"backend/internal/model"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type PersonaHandler struct {
	service service.PersonaService
}

func NewPersonaHandler(service service.PersonaService) *PersonaHandler {
	return &PersonaHandler{service: service}
}

// Create crea una nueva persona
func (h *PersonaHandler) Create(c *gin.Context) {
	var persona model.Persona
	
	if err := c.ShouldBindJSON(&persona); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	if err := h.service.Create(&persona); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al registrar la persona",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Persona registrada exitosamente",
		"data":    persona,
	})
}

// GetAll obtiene todas las personas
func (h *PersonaHandler) GetAll(c *gin.Context) {
	personas, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener las personas",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": personas,
	})
}

// GetByID obtiene una persona por ID
func (h *PersonaHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	persona, err := h.service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Persona no encontrada",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": persona,
	})
}

// GetByEmail obtiene una persona por email
func (h *PersonaHandler) GetByEmail(c *gin.Context) {
	email := c.Param("email")

	persona, err := h.service.GetByEmail(email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Persona no encontrada",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": persona,
	})
}

// Update actualiza una persona
func (h *PersonaHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	var persona model.Persona
	if err := c.ShouldBindJSON(&persona); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	if err := h.service.Update(uint(id), &persona); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al actualizar la persona",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Persona actualizada exitosamente",
		"data":    persona,
	})
}

// Delete elimina una persona
func (h *PersonaHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Error al eliminar la persona",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Persona eliminada exitosamente",
	})
}
