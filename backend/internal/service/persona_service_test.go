package service

import (
	"backend/internal/model"
	"errors"
	"testing"
)

// Mock del repositorio de personas
type mockPersonaRepository struct {
	personas   []model.Persona
	shouldFail bool
}

func (m *mockPersonaRepository) Create(persona *model.Persona) error {
	if m.shouldFail {
		return errors.New("database error")
	}
	
	// Verificar email duplicado
	for _, p := range m.personas {
		if p.Email == persona.Email {
			return errors.New("email already exists")
		}
	}
	
	persona.ID = uint(len(m.personas) + 1)
	m.personas = append(m.personas, *persona)
	return nil
}

func (m *mockPersonaRepository) GetAll() ([]model.Persona, error) {
	if m.shouldFail {
		return nil, errors.New("database error")
	}
	return m.personas, nil
}

func (m *mockPersonaRepository) GetByID(id uint) (*model.Persona, error) {
	if m.shouldFail {
		return nil, errors.New("database error")
	}
	
	for _, persona := range m.personas {
		if persona.ID == id {
			return &persona, nil
		}
	}
	return nil, errors.New("persona not found")
}

func (m *mockPersonaRepository) GetByEmail(email string) (*model.Persona, error) {
	if m.shouldFail {
		return nil, errors.New("database error")
	}
	
	for _, persona := range m.personas {
		if persona.Email == email {
			return &persona, nil
		}
	}
	return nil, errors.New("persona not found")
}

func (m *mockPersonaRepository) Update(persona *model.Persona) error {
	if m.shouldFail {
		return errors.New("database error")
	}
	return nil
}

func (m *mockPersonaRepository) Delete(id uint) error {
	if m.shouldFail {
		return errors.New("database error")
	}
	return nil
}

// TestGetAllPersonas prueba la obtención de todas las personas
func TestGetAllPersonas(t *testing.T) {
	// Arrange
	persona1 := model.Persona{
		Nombre:   "Juan Pérez",
		Email:    "juan@test.com",
		AreaID:   1,
	}
	persona1.ID = 1
	
	persona2 := model.Persona{
		Nombre:   "María López",
		Email:    "maria@test.com",
		AreaID:   2,
	}
	persona2.ID = 2
	
	mockRepo := &mockPersonaRepository{
		personas:   []model.Persona{persona1, persona2},
		shouldFail: false,
	}
	
	service := NewPersonaService(mockRepo)

	// Act
	personas, err := service.GetAll()

	// Assert
	if err != nil {
		t.Errorf("Se esperaba nil error, pero se obtuvo: %v", err)
	}

	if len(personas) != 2 {
		t.Errorf("Se esperaban 2 personas, pero se obtuvieron: %d", len(personas))
	}

	if personas[0].Nombre != "Juan Pérez" {
		t.Errorf("Se esperaba 'Juan Pérez', pero se obtuvo: %s", personas[0].Nombre)
	}

	if personas[1].Email != "maria@test.com" {
		t.Errorf("Se esperaba 'maria@test.com', pero se obtuvo: %s", personas[1].Email)
	}
}

// TestCreatePersona prueba la creación exitosa de una persona
func TestCreatePersona(t *testing.T) {
	// Arrange
	mockRepo := &mockPersonaRepository{
		personas:   []model.Persona{},
		shouldFail: false,
	}
	
	service := NewPersonaService(mockRepo)
	
	newPersona := &model.Persona{
		Nombre:   "Carlos Ruiz",
		Email:    "carlos@test.com",
		AreaID:   1,
	}

	// Act
	err := service.Create(newPersona)

	// Assert
	if err != nil {
		t.Errorf("Se esperaba nil error, pero se obtuvo: %v", err)
	}

	if newPersona.ID == 0 {
		t.Error("Se esperaba que se asignara un ID a la persona")
	}

	if len(mockRepo.personas) != 1 {
		t.Errorf("Se esperaba 1 persona en el repositorio, pero hay: %d", len(mockRepo.personas))
	}
}

// TestCreatePersonaDuplicateEmail prueba que no se permita crear persona con email duplicado
func TestCreatePersonaDuplicateEmail(t *testing.T) {
	// Arrange
	existingPersona := model.Persona{
		Nombre:   "Ana García",
		Email:    "ana@test.com",
		AreaID:   1,
	}
	existingPersona.ID = 1
	
	mockRepo := &mockPersonaRepository{
		personas:   []model.Persona{existingPersona},
		shouldFail: false,
	}
	
	service := NewPersonaService(mockRepo)
	
	duplicatePersona := &model.Persona{
		Nombre:   "Otra Ana",
		Email:    "ana@test.com",
		AreaID:   2,
	}

	// Act
	err := service.Create(duplicatePersona)

	// Assert
	if err == nil {
		t.Error("Se esperaba un error por email duplicado, pero se obtuvo nil")
	}

	if err.Error() != "el correo electrónico ya está registrado" {
		t.Errorf("Se esperaba 'el correo electrónico ya está registrado', pero se obtuvo: %s", err.Error())
	}
}

// TestGetAllPersonasError prueba el manejo de errores
func TestGetAllPersonasError(t *testing.T) {
	// Arrange
	mockRepo := &mockPersonaRepository{
		shouldFail: true,
	}
	
	service := NewPersonaService(mockRepo)

	// Act
	personas, err := service.GetAll()

	// Assert
	if err == nil {
		t.Error("Se esperaba un error, pero se obtuvo nil")
	}

	if personas != nil {
		t.Errorf("Se esperaba nil para personas, pero se obtuvo: %v", personas)
	}
}

// TestGetAllPersonasEmpty prueba el caso de lista vacía
func TestGetAllPersonasEmpty(t *testing.T) {
	// Arrange
	mockRepo := &mockPersonaRepository{
		personas:   []model.Persona{},
		shouldFail: false,
	}
	
	service := NewPersonaService(mockRepo)

	// Act
	personas, err := service.GetAll()

	// Assert
	if err != nil {
		t.Errorf("Se esperaba nil error, pero se obtuvo: %v", err)
	}

	if len(personas) != 0 {
		t.Errorf("Se esperaba lista vacía, pero se obtuvieron: %d personas", len(personas))
	}
}
