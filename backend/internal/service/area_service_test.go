package service

import (
	"backend/internal/model"
	"errors"
	"testing"
)

// Mock del repositorio de áreas
type mockAreaRepository struct {
	areas      []model.Area
	shouldFail bool
}

func (m *mockAreaRepository) Create(area *model.Area) error {
	if m.shouldFail {
		return errors.New("database error")
	}
	area.ID = uint(len(m.areas) + 1)
	m.areas = append(m.areas, *area)
	return nil
}

func (m *mockAreaRepository) GetAll() ([]model.Area, error) {
	if m.shouldFail {
		return nil, errors.New("database error")
	}
	return m.areas, nil
}

func (m *mockAreaRepository) GetAreasConConteo() ([]model.AreaConConteo, error) {
	if m.shouldFail {
		return nil, errors.New("database error")
	}
	
	// Simular áreas con conteo
	result := []model.AreaConConteo{
		{ID: 1, Nombre: "Ventas", Descripcion: "Área de ventas", Personas: 5},
		{ID: 2, Nombre: "Marketing", Descripcion: "Área de marketing", Personas: 3},
	}
	return result, nil
}

func (m *mockAreaRepository) GetByID(id uint) (*model.Area, error) {
	if m.shouldFail {
		return nil, errors.New("database error")
	}
	
	for _, area := range m.areas {
		if area.ID == id {
			return &area, nil
		}
	}
	return nil, errors.New("area not found")
}

func (m *mockAreaRepository) Update(area *model.Area) error {
	if m.shouldFail {
		return errors.New("database error")
	}
	return nil
}

func (m *mockAreaRepository) Delete(id uint) error {
	if m.shouldFail {
		return errors.New("database error")
	}
	return nil
}

// TestGetAllAreas prueba la obtención de todas las áreas
func TestGetAllAreas(t *testing.T) {
	// Arrange - Preparar datos de prueba
	area1 := model.Area{Nombre: "Ventas", Descripcion: "Área de ventas"}
	area1.ID = 1
	
	area2 := model.Area{Nombre: "Marketing", Descripcion: "Área de marketing"}
	area2.ID = 2
	
	area3 := model.Area{Nombre: "Tecnología", Descripcion: "Área de TI"}
	area3.ID = 3
	
	mockRepo := &mockAreaRepository{
		areas:      []model.Area{area1, area2, area3},
		shouldFail: false,
	}
	
	service := NewAreaService(mockRepo)

	// Act - Ejecutar la función a probar
	areas, err := service.GetAll()

	// Assert - Verificar resultados
	if err != nil {
		t.Errorf("Se esperaba nil error, pero se obtuvo: %v", err)
	}

	if len(areas) != 3 {
		t.Errorf("Se esperaban 3 áreas, pero se obtuvieron: %d", len(areas))
	}

	if areas[0].Nombre != "Ventas" {
		t.Errorf("Se esperaba 'Ventas', pero se obtuvo: %s", areas[0].Nombre)
	}

	if areas[1].Nombre != "Marketing" {
		t.Errorf("Se esperaba 'Marketing', pero se obtuvo: %s", areas[1].Nombre)
	}

	if areas[2].Nombre != "Tecnología" {
		t.Errorf("Se esperaba 'Tecnología', pero se obtuvo: %s", areas[2].Nombre)
	}
}

// TestGetAllAreasError prueba el manejo de errores al obtener áreas
func TestGetAllAreasError(t *testing.T) {
	// Arrange - Configurar mock para fallar
	mockRepo := &mockAreaRepository{
		shouldFail: true,
	}
	
	service := NewAreaService(mockRepo)

	// Act - Ejecutar la función a probar
	areas, err := service.GetAll()

	// Assert - Verificar que se maneje el error correctamente
	if err == nil {
		t.Error("Se esperaba un error, pero se obtuvo nil")
	}

	if areas != nil {
		t.Errorf("Se esperaba nil para areas, pero se obtuvo: %v", areas)
	}

	if err.Error() != "database error" {
		t.Errorf("Se esperaba 'database error', pero se obtuvo: %s", err.Error())
	}
}

// TestGetAreasConConteo prueba la obtención de áreas con conteo de personas
func TestGetAreasConConteo(t *testing.T) {
	// Arrange
	mockRepo := &mockAreaRepository{
		shouldFail: false,
	}
	
	service := NewAreaService(mockRepo)

	// Act
	areasConteo, err := service.GetAreasConConteo()

	// Assert
	if err != nil {
		t.Errorf("Se esperaba nil error, pero se obtuvo: %v", err)
	}

	if len(areasConteo) != 2 {
		t.Errorf("Se esperaban 2 áreas con conteo, pero se obtuvieron: %d", len(areasConteo))
	}

	if areasConteo[0].Nombre != "Ventas" {
		t.Errorf("Se esperaba 'Ventas', pero se obtuvo: %s", areasConteo[0].Nombre)
	}

	if areasConteo[0].Personas != 5 {
		t.Errorf("Se esperaban 5 personas en Ventas, pero se obtuvieron: %d", areasConteo[0].Personas)
	}

	if areasConteo[1].Nombre != "Marketing" {
		t.Errorf("Se esperaba 'Marketing', pero se obtuvo: %s", areasConteo[1].Nombre)
	}

	if areasConteo[1].Personas != 3 {
		t.Errorf("Se esperaban 3 personas en Marketing, pero se obtuvieron: %d", areasConteo[1].Personas)
	}
}
