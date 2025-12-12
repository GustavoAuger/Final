package dto

import "especificacion-service/internal/model"

// EspecificacionResponse es el DTO para la respuesta de especificaciones que incluye la oferta
type EspecificacionResponse struct {
	model.Especificacion
	Oferta interface{} `json:"oferta,omitempty"`
}
