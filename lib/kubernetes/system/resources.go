package system

import (
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
)

type SystemMemory struct {
	Free  int `json:"free"`
	Total int `json:"total"`
}

type SystemCPU struct {
	Cores int `json:"cores"`
}

type SystemResources struct {
	Memory SystemMemory `json:"memory"`
	CPU    SystemCPU    `json:"cpu"`
}

func GetSystemResources() SystemResources {
	v, _ := mem.VirtualMemory()
	sm := SystemMemory{
		Free:  int(v.Free),
		Total: int(v.Total),
	}

	c, _ := cpu.Counts(true)
	sc := SystemCPU{
		Cores: c,
	}
	return SystemResources{
		Memory: sm,
		CPU:    sc,
	}
}
