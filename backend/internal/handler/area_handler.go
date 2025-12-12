package handler

import (
	"backend/internal/model"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AreaHandler struct {
	service service.AreaService
}

func NewAreaHandler(service service.AreaService) *AreaHandler {
	return &AreaHandler{service: service}
}

// Create crea una nueva área
func (h *AreaHandler) Create(c *gin.Context) {
	var area model.Area
	
	if err := c.ShouldBindJSON(&area); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	if err := h.service.Create(&area); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al crear el área",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Área creada exitosamente",
		"data":    area,
	})
}

// GetAll obtiene todas las áreas
func (h *AreaHandler) GetAll(c *gin.Context) {
	areas, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener las áreas",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": areas,
	})
}

// GetByID obtiene un área por ID
func (h *AreaHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	area, err := h.service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Área no encontrada",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": area,
	})
}

// Update actualiza un área
func (h *AreaHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	var area model.Area
	if err := c.ShouldBindJSON(&area); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"details": err.Error(),
		})
		return
	}

	if err := h.service.Update(uint(id), &area); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al actualizar el área",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Área actualizada exitosamente",
		"data":    area,
	})
}

// Delete elimina un área
func (h *AreaHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID inválido",
		})
		return
	}

	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Error al eliminar el área",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Área eliminada exitosamente",
	})
}

// GetAreasConConteo obtiene las áreas con el conteo de personas
func (h *AreaHandler) GetAreasConConteo(c *gin.Context) {
	areasConConteo, err := h.service.GetAreasConConteo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al obtener las áreas con conteo",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": areasConConteo,
	})
}
