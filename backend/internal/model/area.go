package model

import (
	"gorm.io/gorm"
)

// Area representa el modelo de área de trabajo en el sistema
type Area struct {
	gorm.Model
	Nombre      string `json:"nombre" gorm:"type:varchar(100);not null;unique" binding:"required"`
	Descripcion string `json:"descripcion" gorm:"type:text"`
}

// TableName especifica el nombre de la tabla en la base de datos
func (Area) TableName() string {
	return "areas"
}

// AreaConConteo representa un área con el conteo de personas
type AreaConConteo struct {
	ID          uint   `json:"id"`
	Nombre      string `json:"nombre"`
	Descripcion string `json:"descripcion"`
	Personas    int64  `json:"personas"`
}
