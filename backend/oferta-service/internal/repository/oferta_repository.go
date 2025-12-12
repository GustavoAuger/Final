package repository

import (
	"oferta-service/internal/model"

	"gorm.io/gorm"
)

type OfertaRepository interface {
	FindAll() ([]model.Oferta, error)
	FindByID(id uint) (*model.Oferta, error)
	Create(oferta model.Oferta) (*model.Oferta, error)
	ModificarOferta(id uint, oferta model.Oferta) (*model.Oferta, error)
}

type ofertaRepository struct {
	DB *gorm.DB
}

func NewOfertaRepository(db *gorm.DB) OfertaRepository {
	return &ofertaRepository{DB: db}
}

func (r *ofertaRepository) FindAll() ([]model.Oferta, error) {
	var ofertas []model.Oferta
	if err := r.DB.Find(&ofertas).Error; err != nil {
		return nil, err
	}
	return ofertas, nil
}

func (r *ofertaRepository) FindByID(id uint) (*model.Oferta, error) {
	var oferta model.Oferta
	if err := r.DB.First(&oferta, id).Error; err != nil {
		return nil, err
	}
	return &oferta, nil
}

func (r *ofertaRepository) Create(oferta model.Oferta) (*model.Oferta, error) {
	if err := r.DB.Create(&oferta).Error; err != nil {
		return nil, err
	}
	return &oferta, nil
}
func (r *ofertaRepository) ModificarOferta(id uint, oferta model.Oferta) (*model.Oferta, error) {
	if err := r.DB.Save(&oferta).Error; err != nil {
		return nil, err
	}
	return &oferta, nil
}
