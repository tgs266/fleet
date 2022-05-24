package helm

import (
	"sync"
)

type HelmCache struct {
	Charts []*Chart
}

var mu = &sync.Mutex{}

func (c *HelmCache) setCharts(charts []*Chart) {
	mu.Lock()
	c.Charts = charts
	mu.Unlock()
}

func (c *HelmCache) appendChart(chart *Chart) {
	mu.Lock()
	c.Charts = append(c.Charts, chart)
	mu.Unlock()
}

func (c *HelmCache) isEmpty() bool {
	return len(c.Charts) == 0
}
