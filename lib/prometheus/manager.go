package prometheus

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes"
)

type PrometheusManager struct {
	K8    kubernetes.Interface
	Ready bool
}

// type API interface {
// 	CoreV1() corev1.CoreV1Interface
// }

func New(K8 kubernetes.Interface) *PrometheusManager {
	res := K8.CoreV1().RESTClient().Get().
		Namespace("fleet").
		Resource("services").
		Name("prometheus:web").
		SubResource("proxy").
		Suffix("-/ready").
		// SetHeader("Accept", "text/plain; charset=utf-8").
		Do(context.TODO())

	var sc int
	res.StatusCode(&sc)
	ready := true
	if sc != 200 {
		fmt.Println("failed")
		ready = false
	}

	return &PrometheusManager{
		Ready: ready,
		K8:    K8,
	}
}

func (pm *PrometheusManager) DoQuery(c *fiber.Ctx) (map[string]interface{}, error) {
	result := &runtime.Unknown{}
	err := pm.K8.CoreV1().RESTClient().Get().
		Namespace("fleet").
		Resource("services").
		Name("prometheus:web").
		SubResource("proxy").
		Suffix("api/v1/query").
		Param("query", c.Query("query")).
		Param("time", c.Query("time")).
		Param("timeout", c.Query("timeout")).
		Do(context.TODO()).
		Into(result)

	if err != nil {
		return nil, err
	}

	var res map[string]interface{}
	err = json.Unmarshal(result.Raw, &res)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (pm *PrometheusManager) DoQueryRange(c *fiber.Ctx) (map[string]interface{}, error) {
	result := &runtime.Unknown{}
	err := pm.K8.CoreV1().RESTClient().Get().
		Namespace("fleet").
		Resource("services").
		Name("prometheus:web").
		SubResource("proxy").
		Suffix("api/v1/query_range").
		Param("query", c.Query("query")).
		Param("start", c.Query("start")).
		Param("end", c.Query("end")).
		Param("step", c.Query("step")).
		Param("timeout", c.Query("timeout")).
		Do(context.TODO()).
		Into(result)

	if err != nil {
		return nil, err
	}

	var res map[string]interface{}
	err = json.Unmarshal(result.Raw, &res)
	if err != nil {
		return nil, err
	}

	return res, nil
}
