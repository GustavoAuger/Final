package consul

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/hashicorp/consul/api"
)

type Client struct {
	client *api.Client
}

func NewClient(addr string) (*Client, error) {
	config := api.DefaultConfig()
	config.Address = addr

	client, err := api.NewClient(config)
	if err != nil {
		return nil, err
	}

	return &Client{client: client}, nil
}

func (c *Client) RegisterService(serviceName string, port int) error {
	serviceID := serviceName + "-1"
	hostname, _ := os.Hostname()
	if hostname == "" {
		hostname = "localhost"
	}

	registration := &api.AgentServiceRegistration{
		ID:      serviceID,
		Name:    serviceName,
		Port:    port,
		Address: hostname,
		Check: &api.AgentServiceCheck{
			HTTP:                           "http://" + hostname + ":" + strconv.Itoa(port) + "/api/v1/health",
			Interval:                       "10s",
			Timeout:                        "5s",
			DeregisterCriticalServiceAfter: "30s",
		},
	}

	return c.client.Agent().ServiceRegister(registration)
}

func (c *Client) DeregisterService(serviceID string) error {
	return c.client.Agent().ServiceDeregister(serviceID)
}

func (c *Client) DiscoverService(serviceName string) (string, error) {
	// Primero intentamos con el DNS de Consul
	serviceEntry, _, err := c.client.Health().Service(serviceName, "", true, &api.QueryOptions{})
	if err != nil {
		return "", err
	}

	if len(serviceEntry) == 0 {
		return "", nil
	}

	// Tomamos el primer servicio sano que encontremos
	service := serviceEntry[0].Service
	return "http://" + service.Address + ":" + strconv.Itoa(service.Port), nil
}

// WaitForService espera a que un servicio esté disponible en Consul
func (c *Client) WaitForService(serviceName string, timeout time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			_, err := c.DiscoverService(serviceName)
			if err == nil {
				return nil
			}
			log.Printf("Esperando por el servicio %s...", serviceName)
		}
	}
}
