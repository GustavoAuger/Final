package model

import (
	"gorm.io/gorm"
)

// Especificacion representa la entidad de especificación en el sistema
type Especificacion struct {
	gorm.Model
	OfertaID          uint   `json:"oferta_id" gorm:"not null;index"`
	Activo            bool   `json:"activo"`
	NumeroVacantes    int    `json:"numero_vacantes" gorm:"type:int"`
	PersonalACargo    int    `json:"personal_a_cargo" gorm:"type:int"`
	TipoContrato      string `json:"tipo_contrato" gorm:"type:varchar(30)"`
	ModalidadTrabajo  string `json:"modalidad_trabajo" gorm:"type:varchar(30)"`
	Categoria         string `json:"categoria" gorm:"type:varchar(30)"`
	Subcategoria      string `json:"subcategoria" gorm:"type:varchar(30)"`
	Sector            string `json:"sector" gorm:"type:varchar(30)"`
	NivelProfesional  string `json:"nivel_profesional" gorm:"type:varchar(30)"`
	Departamento      string `json:"departamento" gorm:"type:varchar(30)"`
	ExperienciaMinima string `json:"experiencia_minima" gorm:"type:varchar(30)"`
	JornadaLaboral    string `json:"jornada_laboral" gorm:"type:varchar(30)"`
	FormacionMinima   string `json:"formacion_minima" gorm:"type:varchar(30)"`
}

// TableName especifica el nombre de la tabla en la base de datos
func (Especificacion) TableName() string {
	return "especificaciones"
}
