package prometheus

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/logging"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/rest"
)

type PrometheusManager struct {
	RestClient rest.Interface
	Ready      bool
}

type PrometheusQueryRequest struct {
	Query   string `json:"query"`
	Time    string `json:"time"`
	Timeout string `json:"timeout"`
}

type PrometheusQueryRangeRequest struct {
	Query   string `json:"query"`
	Start   string `json:"start"`
	End     string `json:"end"`
	Step    string `json:"step"`
	Timeout string `json:"timeout"`
}

const METRICS_NS = "fleet-metrics"
const SERVICE_NAME = "prometheus:web"

func (self *PrometheusManager) getBaseRequest() *rest.Request {
	return self.RestClient.Get().
		Namespace(METRICS_NS).
		Resource("services").
		Name(SERVICE_NAME).
		SubResource("proxy")
}

func New(restClient rest.Interface) *PrometheusManager {

	client := &PrometheusManager{
		RestClient: restClient,
	}

	res := client.getBaseRequest().Suffix("-/ready").Do(context.TODO())

	var sc int
	res.StatusCode(&sc)
	client.Ready = true
	if sc != 200 {
		logging.WARN("could not connect to prometheus, ", res.Error())
		client.Ready = false
	}

	return client
}

func (pm *PrometheusManager) DoQuery(c *fiber.Ctx) (map[string]map[string]interface{}, error) {

	var body map[string]PrometheusQueryRequest

	if c.Method() == "POST" {
		err := c.BodyParser(&body)
		if err != nil {
			return nil, err
		}
	} else {
		body = map[string]PrometheusQueryRequest{
			"query": {
				Query:   c.Query("query"),
				Time:    c.Query("time"),
				Timeout: c.Query("timeout"),
			},
		}
	}

	results := make(map[string]map[string]interface{}, len(body))
	channels := make(map[string]chan map[string]interface{}, len(body))
	errChannels := make(map[string]chan error, len(body))

	for i, b := range body {
		channels[i] = make(chan map[string]interface{}, 1)
		errChannels[i] = make(chan error, 1)
		go pm.doSingleQueryRequest(b, channels[i], errChannels[i])
	}

	for i, _ := range body {
		err := <-errChannels[i]
		if err != nil {
			return nil, errors.CreateError(500, fmt.Sprintf("requests %s failed with error '%s'", i, err.Error()))
		} else {
			results[i] = <-channels[i]
		}
	}

	return results, nil
}

func (pm *PrometheusManager) doSingleQueryRequest(r PrometheusQueryRequest, channel chan map[string]interface{}, err chan error) {
	result := &runtime.Unknown{}

	errresp := pm.getBaseRequest().
		Suffix("api/v1/query").
		Param("query", r.Query).
		Param("time", r.Time).
		Param("timeout", r.Timeout).
		Do(context.TODO()).
		Into(result)

	if errresp != nil {
		err <- errresp
		channel <- nil
		return
	}

	var res map[string]interface{}
	errresp = json.Unmarshal(result.Raw, &res)
	if errresp != nil {
		err <- errresp
		channel <- nil
		return
	}

	err <- nil
	channel <- res
}

func (pm *PrometheusManager) DoQueryRange(c *fiber.Ctx) (map[string]map[string]interface{}, error) {
	var body map[string]PrometheusQueryRangeRequest

	if c.Method() == "POST" {
		err := c.BodyParser(&body)
		if err != nil {
			return nil, err
		}
	} else {
		body = map[string]PrometheusQueryRangeRequest{
			"query": {
				Query:   c.Query("query"),
				Timeout: c.Query("timeout"),
				Start:   c.Query("start", fmt.Sprintf("%d", time.Now().UnixMilli())),
				End:     c.Query("end", fmt.Sprintf("%d", time.Now().Add(-30*time.Minute).UnixMilli())),
				Step:    c.Query("step", "60s"),
			},
		}
	}

	now := time.Now()

	results := make(map[string]map[string]interface{}, len(body))
	channels := make(map[string]chan map[string]interface{}, len(body))
	errChannels := make(map[string]chan error, len(body))

	for i, b := range body {
		channels[i] = make(chan map[string]interface{}, 1)
		errChannels[i] = make(chan error, 1)
		go pm.doSingleQueryRangeRequest(now, b, channels[i], errChannels[i])
	}

	for i, _ := range body {
		err := <-errChannels[i]
		if err != nil {
			return nil, errors.CreateError(500, fmt.Sprintf("requests %s failed with error '%s'", i, err.Error()))
		} else {
			results[i] = <-channels[i]
		}
	}

	return results, nil
}

func (pm *PrometheusManager) doSingleQueryRangeRequest(now time.Time, r PrometheusQueryRangeRequest, channel chan map[string]interface{}, errChannel chan error) {
	result := &runtime.Unknown{}

	if r.Start == "" {
		r.Start = fmt.Sprintf("%d", now.Add(-60*time.Minute).Unix())
	}

	if r.End == "" {
		r.End = fmt.Sprintf("%d", now.Unix())
	}

	if r.Step == "" {
		r.Step = "60s"
	}

	err := pm.getBaseRequest().
		Suffix("api/v1/query_range").
		Param("query", r.Query).
		Param("start", r.Start).
		Param("end", r.End).
		Param("step", r.Step).
		Param("timeout", r.Timeout).
		Do(context.TODO()).
		Into(result)

	if err != nil {
		errChannel <- err
		channel <- nil
		return
	}

	var res map[string]interface{}
	err = json.Unmarshal(result.Raw, &res)
	if err != nil {
		errChannel <- err
		channel <- nil
		return
	}

	errChannel <- nil
	channel <- res
}

func (pm *PrometheusManager) GetAlerts() (map[string]interface{}, error) {
	result := &runtime.Unknown{}

	err := pm.getBaseRequest().
		Suffix("api/v1/alerts").
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
