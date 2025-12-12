package handler

import (
	"backend/internal/model"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

// Mock del servicio de áreas
type mockAreaService struct {
	areas      []model.Area
	shouldFail bool
}

func (m *mockAreaService) Create(area *model.Area) error {
	if m.shouldFail {
		return errors.New("service error")
	}
	area.ID = uint(len(m.areas) + 1)
	m.areas = append(m.areas, *area)
	return nil
}

func (m *mockAreaService) GetAll() ([]model.Area, error) {
	if m.shouldFail {
		return nil, errors.New("service error")
	}
	return m.areas, nil
}

func (m *mockAreaService) GetByID(id uint) (*model.Area, error) {
	if m.shouldFail {
		return nil, errors.New("service error")
	}
	
	for _, area := range m.areas {
		if area.ID == id {
			return &area, nil
		}
	}
	return nil, errors.New("area not found")
}

func (m *mockAreaService) Update(id uint, area *model.Area) error {
	if m.shouldFail {
		return errors.New("service error")
	}
	return nil
}

func (m *mockAreaService) Delete(id uint) error {
	if m.shouldFail {
		return errors.New("service error")
	}
	return nil
}

func (m *mockAreaService) GetAreasConConteo() ([]model.AreaConConteo, error) {
	if m.shouldFail {
		return nil, errors.New("service error")
	}
	
	return []model.AreaConConteo{
		{ID: 1, Nombre: "Ventas", Descripcion: "Área de ventas", Personas: 5},
		{ID: 2, Nombre: "Marketing", Descripcion: "Área de marketing", Personas: 3},
	}, nil
}

// Mock del servicio de personas
type mockPersonaService struct {
	personas   []model.Persona
	shouldFail bool
}

func (m *mockPersonaService) Create(persona *model.Persona) error {
	if m.shouldFail {
		return errors.New("service error")
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

func (m *mockPersonaService) GetAll() ([]model.Persona, error) {
	if m.shouldFail {
		return nil, errors.New("service error")
	}
	return m.personas, nil
}

func (m *mockPersonaService) GetByID(id uint) (*model.Persona, error) {
	if m.shouldFail {
		return nil, errors.New("service error")
	}
	
	for _, persona := range m.personas {
		if persona.ID == id {
			return &persona, nil
		}
	}
	return nil, errors.New("persona not found")
}

func (m *mockPersonaService) GetByEmail(email string) (*model.Persona, error) {
	if m.shouldFail {
		return nil, errors.New("service error")
	}
	
	for _, persona := range m.personas {
		if persona.Email == email {
			return &persona, nil
		}
	}
	return nil, errors.New("persona not found")
}

func (m *mockPersonaService) Update(id uint, persona *model.Persona) error {
	if m.shouldFail {
		return errors.New("service error")
	}
	return nil
}

func (m *mockPersonaService) Delete(id uint) error {
	if m.shouldFail {
		return errors.New("service error")
	}
	return nil
}

// TestGetAllAreasHandler prueba el endpoint GET /areas
func TestGetAllAreasHandler(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
	area1 := model.Area{Nombre: "Ventas", Descripcion: "Área de ventas"}
	area1.ID = 1
	
	area2 := model.Area{Nombre: "Marketing", Descripcion: "Área de marketing"}
	area2.ID = 2
	
	mockService := &mockAreaService{
		areas:      []model.Area{area1, area2},
		shouldFail: false,
	}
	
	handler := NewAreaHandler(mockService)
	
	router := gin.Default()
	router.GET("/areas", handler.GetAll)
	
	req, _ := http.NewRequest("GET", "/areas", nil)
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusOK {
		t.Errorf("Se esperaba status 200, pero se obtuvo: %d", w.Code)
	}

	var response map[string][]model.Area
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Error al decodificar respuesta: %v", err)
	}

	areas := response["data"]
	if len(areas) != 2 {
		t.Errorf("Se esperaban 2 áreas, pero se obtuvieron: %d", len(areas))
	}
}

// TestGetAllAreasHandlerError prueba el manejo de errores en GET /areas
func TestGetAllAreasHandlerError(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
	mockService := &mockAreaService{
		shouldFail: true,
	}
	
	handler := NewAreaHandler(mockService)
	
	router := gin.Default()
	router.GET("/areas", handler.GetAll)
	
	req, _ := http.NewRequest("GET", "/areas", nil)
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusInternalServerError {
		t.Errorf("Se esperaba status 500, pero se obtuvo: %d", w.Code)
	}
}

// TestGetAreasConConteoHandler prueba el endpoint GET /areas/conteo
func TestGetAreasConConteoHandler(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
	mockService := &mockAreaService{
		shouldFail: false,
	}
	
	handler := NewAreaHandler(mockService)
	
	router := gin.Default()
	router.GET("/areas/conteo", handler.GetAreasConConteo)
	
	req, _ := http.NewRequest("GET", "/areas/conteo", nil)
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusOK {
		t.Errorf("Se esperaba status 200, pero se obtuvo: %d", w.Code)
	}

	var response map[string][]model.AreaConConteo
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Error al decodificar respuesta: %v", err)
	}

	areasConteo := response["data"]
	if len(areasConteo) != 2 {
		t.Errorf("Se esperaban 2 áreas con conteo, pero se obtuvieron: %d", len(areasConteo))
	}

	if areasConteo[0].Personas != 5 {
		t.Errorf("Se esperaban 5 personas en la primera área, pero se obtuvieron: %d", areasConteo[0].Personas)
	}
}

// TestGetAllPersonasHandler prueba el endpoint GET /personas
func TestGetAllPersonasHandler(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
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
	
	mockService := &mockPersonaService{
		personas:   []model.Persona{persona1, persona2},
		shouldFail: false,
	}
	
	handler := NewPersonaHandler(mockService)
	
	router := gin.Default()
	router.GET("/personas", handler.GetAll)
	
	req, _ := http.NewRequest("GET", "/personas", nil)
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusOK {
		t.Errorf("Se esperaba status 200, pero se obtuvo: %d", w.Code)
	}

	var response map[string][]model.Persona
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Error al decodificar respuesta: %v", err)
	}

	personas := response["data"]
	if len(personas) != 2 {
		t.Errorf("Se esperaban 2 personas, pero se obtuvieron: %d", len(personas))
	}
}

// TestCreatePersonaHandler prueba el endpoint POST /personas
func TestCreatePersonaHandler(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
	mockService := &mockPersonaService{
		personas:   []model.Persona{},
		shouldFail: false,
	}
	
	handler := NewPersonaHandler(mockService)
	
	router := gin.Default()
	router.POST("/personas", handler.Create)
	
	newPersona := model.Persona{
		Nombre:   "Carlos Ruiz",
		Email:    "carlos@test.com",
		AreaID:   1,
	}
	
	jsonData, _ := json.Marshal(newPersona)
	req, _ := http.NewRequest("POST", "/personas", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusCreated {
		t.Errorf("Se esperaba status 201, pero se obtuvo: %d", w.Code)
	}

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Errorf("Error al decodificar respuesta: %v", err)
	}

	data := response["data"].(map[string]interface{})
	nombre := data["nombre"].(string)
	email := data["email"].(string)
	id := uint(data["ID"].(float64))
	
	if nombre != "Carlos Ruiz" {
		t.Errorf("Se esperaba 'Carlos Ruiz', pero se obtuvo: %s", nombre)
	}
	
	if email != "carlos@test.com" {
		t.Errorf("Se esperaba 'carlos@test.com', pero se obtuvo: %s", email)
	}

	if id == 0 {
		t.Error("Se esperaba que se asignara un ID a la persona")
	}
}

// TestCreatePersonaHandlerInvalidJSON prueba validación de JSON inválido
func TestCreatePersonaHandlerInvalidJSON(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
	mockService := &mockPersonaService{
		personas:   []model.Persona{},
		shouldFail: false,
	}
	
	handler := NewPersonaHandler(mockService)
	
	router := gin.Default()
	router.POST("/personas", handler.Create)
	
	invalidJSON := []byte(`{"nombre": "Test", "email": }`)
	req, _ := http.NewRequest("POST", "/personas", bytes.NewBuffer(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusBadRequest {
		t.Errorf("Se esperaba status 400, pero se obtuvo: %d", w.Code)
	}
}

// TestCreatePersonaHandlerServiceError prueba errores del servicio
func TestCreatePersonaHandlerServiceError(t *testing.T) {
	// Arrange
	gin.SetMode(gin.TestMode)
	
	mockService := &mockPersonaService{
		shouldFail: true,
	}
	
	handler := NewPersonaHandler(mockService)
	
	router := gin.Default()
	router.POST("/personas", handler.Create)
	
	newPersona := model.Persona{
		Nombre:   "Test User",
		Email:    "test@test.com",
		AreaID:   1,
	}
	
	jsonData, _ := json.Marshal(newPersona)
	req, _ := http.NewRequest("POST", "/personas", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	// Act
	router.ServeHTTP(w, req)

	// Assert
	if w.Code != http.StatusBadRequest {
		t.Errorf("Se esperaba status 400, pero se obtuvo: %d", w.Code)
	}
}
