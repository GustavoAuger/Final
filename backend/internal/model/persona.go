package model

import (
	"gorm.io/gorm"
)

// Persona representa el modelo de persona en el sistema
type Persona struct {
	gorm.Model
	Nombre string `json:"nombre" gorm:"type:varchar(200);not null" binding:"required"`
	Email  string `json:"email" gorm:"type:varchar(200);not null;unique" binding:"required,email"`
	AreaID uint   `json:"area_id" gorm:"not null" binding:"required"`
	Area   *Area  `json:"area,omitempty" gorm:"foreignKey:AreaID"`
}

// TableName especifica el nombre de la tabla en la base de datos
func (Persona) TableName() string {
	return "personas"
}
