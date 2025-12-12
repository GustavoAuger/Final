package model

import (
	"gorm.io/gorm"
)

// Oferta representa la entidad de oferta en el sistema
type Oferta struct {
	gorm.Model
	SolicitudID       int    `json:"solicitud_id" gorm:"column:solicitud_id;not null"`
	Titulo            string `json:"titulo" gorm:"type:varchar(200);not null"`
	Estado            string `json:"estado" gorm:"type:varchar(50);not null"`
	Descripcion       string `json:"descripcion" gorm:"type:text"`
	RequisitosMinimos string `json:"requisitos_minimos" gorm:"type:text"`
	Area              string `json:"area" gorm:"type:varchar(50)"`
	Idioma            string `json:"idioma" gorm:"type:varchar(50)"`
	Pais              string `json:"pais" gorm:"type:varchar(50)"`
	Localizacion      string `json:"localizacion" gorm:"type:varchar(150)"`
	SalarioModalidad  string `json:"salario_modalidad" gorm:"type:varchar(30)"`
	SalarioMoneda     string `json:"salario_moneda" gorm:"type:varchar(30)"`
	SalarioDesde      int    `json:"salario_desde" gorm:"type:int"`
	SalarioHasta      int    `json:"salario_hasta" gorm:"type:int"`
	SalarioMostrar    int    `json:"salario_mostrar" gorm:"type:int;default:1"`
}

// TableName especifica el nombre de la tabla en la base de datos
func (Oferta) TableName() string {
	return "ofertas"
}
