package repository

import (
	"backend/internal/model"
	"gorm.io/gorm"
)

type AreaRepository interface {
	Create(area *model.Area) error
	GetAll() ([]model.Area, error)
	GetByID(id uint) (*model.Area, error)
	Update(area *model.Area) error
	Delete(id uint) error
	GetAreasConConteo() ([]model.AreaConConteo, error)
}

type areaRepository struct {
	db *gorm.DB
}

func NewAreaRepository(db *gorm.DB) AreaRepository {
	return &areaRepository{db: db}
}

func (r *areaRepository) Create(area *model.Area) error {
	return r.db.Create(area).Error
}

func (r *areaRepository) GetAll() ([]model.Area, error) {
	var areas []model.Area
	err := r.db.Find(&areas).Error
	return areas, err
}

func (r *areaRepository) GetByID(id uint) (*model.Area, error) {
	var area model.Area
	err := r.db.First(&area, id).Error
	return &area, err
}

func (r *areaRepository) Update(area *model.Area) error {
	return r.db.Save(area).Error
}

func (r *areaRepository) Delete(id uint) error {
	return r.db.Delete(&model.Area{}, id).Error
}

func (r *areaRepository) GetAreasConConteo() ([]model.AreaConConteo, error) {
	var results []model.AreaConConteo
	err := r.db.Model(&model.Area{}).
		Select("areas.id, areas.nombre, areas.descripcion, COUNT(personas.id) as personas").
		Joins("LEFT JOIN personas ON personas.area_id = areas.id AND personas.deleted_at IS NULL").
		Group("areas.id, areas.nombre, areas.descripcion").
		Find(&results).Error
	return results, err
}
