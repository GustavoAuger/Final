package ofertaclient

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Client struct {
	baseURL string
}

// NewClient crea un nuevo cliente que se conecta directamente al servicio de ofertas
func NewClient() *Client {
	// Usamos el nombre del servicio en la red de Docker
	return &Client{
		baseURL: "http://oferta-service:8082/api/v1/ofertas",
	}
}

// GetOfertaByID obtiene una oferta por su ID directamente del servicio de ofertas
func (c *Client) GetOfertaByID(id int) (map[string]interface{}, error) {
	// Construimos la URL usando el servicio de ofertas directamente
	url := fmt.Sprintf("%s/%d", c.baseURL, id)
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error al hacer la petición al servicio de ofertas: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("error al obtener oferta: %s", string(body))
	}

	var oferta map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&oferta); err != nil {
		return nil, fmt.Errorf("error al decodificar la respuesta de oferta: %v", err)
	}

	return oferta, nil
}
