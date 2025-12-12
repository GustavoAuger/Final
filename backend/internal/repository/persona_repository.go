package repository

import (
	"backend/internal/model"
	"gorm.io/gorm"
)

type PersonaRepository interface {
	Create(persona *model.Persona) error
	GetAll() ([]model.Persona, error)
	GetByID(id uint) (*model.Persona, error)
	GetByEmail(email string) (*model.Persona, error)
	Update(persona *model.Persona) error
	Delete(id uint) error
}

type personaRepository struct {
	db *gorm.DB
}

func NewPersonaRepository(db *gorm.DB) PersonaRepository {
	return &personaRepository{db: db}
}

func (r *personaRepository) Create(persona *model.Persona) error {
	return r.db.Create(persona).Error
}

func (r *personaRepository) GetAll() ([]model.Persona, error) {
	var personas []model.Persona
	err := r.db.Preload("Area").Find(&personas).Error
	return personas, err
}

func (r *personaRepository) GetByID(id uint) (*model.Persona, error) {
	var persona model.Persona
	err := r.db.Preload("Area").First(&persona, id).Error
	return &persona, err
}

func (r *personaRepository) GetByEmail(email string) (*model.Persona, error) {
	var persona model.Persona
	err := r.db.Where("email = ?", email).First(&persona).Error
	return &persona, err
}

func (r *personaRepository) Update(persona *model.Persona) error {
	return r.db.Save(persona).Error
}

func (r *personaRepository) Delete(id uint) error {
	return r.db.Delete(&model.Persona{}, id).Error
}
