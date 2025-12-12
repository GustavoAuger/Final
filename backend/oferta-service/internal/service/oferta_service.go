package service

import (
	"oferta-service/internal/model"
	"oferta-service/internal/repository"
)

type OfertaService interface {
	GetAllOfertas() ([]model.Oferta, error)
	GetOfertaByID(id uint) (*model.Oferta, error)
	CreateOferta(oferta model.Oferta) (*model.Oferta, error)
	ModificarOferta(id uint, oferta model.Oferta) (*model.Oferta, error)
}

type ofertaService struct {
	repo repository.OfertaRepository
}

func NewOfertaService(repo repository.OfertaRepository) OfertaService {
	return &ofertaService{repo: repo}
}

func (s *ofertaService) GetAllOfertas() ([]model.Oferta, error) {
	return s.repo.FindAll()
}

func (s *ofertaService) GetOfertaByID(id uint) (*model.Oferta, error) {
	return s.repo.FindByID(id)
}

func (s *ofertaService) CreateOferta(oferta model.Oferta) (*model.Oferta, error) {
	return s.repo.Create(oferta)
}

func (s *ofertaService) ModificarOferta(id uint, oferta model.Oferta) (*model.Oferta, error) {
	return s.repo.ModificarOferta(id, oferta)
}
