package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"errors"
	"gorm.io/gorm"
)

type AreaService interface {
	Create(area *model.Area) error
	GetAll() ([]model.Area, error)
	GetByID(id uint) (*model.Area, error)
	Update(id uint, area *model.Area) error
	Delete(id uint) error
	GetAreasConConteo() ([]model.AreaConConteo, error)
}

type areaService struct {
	repo repository.AreaRepository
}

func NewAreaService(repo repository.AreaRepository) AreaService {
	return &areaService{repo: repo}
}

func (s *areaService) Create(area *model.Area) error {
	return s.repo.Create(area)
}

func (s *areaService) GetAll() ([]model.Area, error) {
	return s.repo.GetAll()
}

func (s *areaService) GetByID(id uint) (*model.Area, error) {
	return s.repo.GetByID(id)
}

func (s *areaService) Update(id uint, area *model.Area) error {
	_, err := s.repo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("área no encontrada")
		}
		return err
	}

	area.ID = id
	return s.repo.Update(area)
}

func (s *areaService) Delete(id uint) error {
	_, err := s.repo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("área no encontrada")
		}
		return err
	}
	return s.repo.Delete(id)
}

func (s *areaService) GetAreasConConteo() ([]model.AreaConConteo, error) {
	return s.repo.GetAreasConConteo()
}
