package service

import (
	"backend/internal/model"
	"backend/internal/repository"
	"errors"
	"gorm.io/gorm"
)

type PersonaService interface {
	Create(persona *model.Persona) error
	GetAll() ([]model.Persona, error)
	GetByID(id uint) (*model.Persona, error)
	GetByEmail(email string) (*model.Persona, error)
	Update(id uint, persona *model.Persona) error
	Delete(id uint) error
}

type personaService struct {
	repo repository.PersonaRepository
}

func NewPersonaService(repo repository.PersonaRepository) PersonaService {
	return &personaService{repo: repo}
}

func (s *personaService) Create(persona *model.Persona) error {
	// Validar que el email no exista
	existingPersona, err := s.repo.GetByEmail(persona.Email)
	if err == nil && existingPersona.ID != 0 {
		return errors.New("el correo electrónico ya está registrado")
	}
	
	// Validar que el área existe (si se necesita, descomentar)
	// if persona.AreaID == 0 {
	//     return errors.New("debe proporcionar un área válida")
	// }
	
	return s.repo.Create(persona)
}

func (s *personaService) GetAll() ([]model.Persona, error) {
	return s.repo.GetAll()
}

func (s *personaService) GetByID(id uint) (*model.Persona, error) {
	return s.repo.GetByID(id)
}

func (s *personaService) GetByEmail(email string) (*model.Persona, error) {
	return s.repo.GetByEmail(email)
}

func (s *personaService) Update(id uint, persona *model.Persona) error {
	existingPersona, err := s.repo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("persona no encontrada")
		}
		return err
	}

	// Validar que el email no esté en uso por otra persona
	if persona.Email != existingPersona.Email {
		emailPersona, err := s.repo.GetByEmail(persona.Email)
		if err == nil && emailPersona.ID != id {
			return errors.New("el correo electrónico ya está registrado")
		}
	}

	persona.ID = id
	return s.repo.Update(persona)
}

func (s *personaService) Delete(id uint) error {
	_, err := s.repo.GetByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("persona no encontrada")
		}
		return err
	}
	return s.repo.Delete(id)
}
