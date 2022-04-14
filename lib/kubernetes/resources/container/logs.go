package container

import (
	"bufio"
	"context"
	"io"
	"strings"

	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/logging"
	"github.com/tgs266/fleet/lib/shared"
	v1 "k8s.io/api/core/v1"
)

func StreamPodContainerLogs(K8 *kubernetes.K8Client, namespace string, name string, containerName string, c *websocket.Conn) {
	logging.INFOf("opening log stream for container %s/%s/%s", namespace, name, containerName)

	podReq := K8.K8.CoreV1().Pods(namespace).GetLogs(name, &v1.PodLogOptions{
		TailLines: shared.Int64Ptr(20),
		Follow:    true,
		Container: containerName,
	})
	podLogs, err := podReq.Stream(context.TODO())
	if err != nil {
		panic(errors.ParseInternalError(err))
	}
	defer podLogs.Close()

	lastLine := ""
	reader := bufio.NewReaderSize(podLogs, 16)
	for {
		data, isPrefix, err := reader.ReadLine()
		if err == io.EOF {
			break
		}
		if err != nil {
			return
		}

		lines := strings.Split(string(data), "\r")

		length := len(lines)

		if len(lastLine) > 0 {
			lines[0] = lastLine + lines[0]
			lastLine = ""
		}

		if isPrefix {
			lastLine = lines[length-1]
			lines = lines[:(length - 1)]
		}

		for _, line := range lines {
			if err := c.WriteMessage(websocket.TextMessage, []byte(line)); err != nil {
				if strings.Contains(err.Error(), "An established connection was aborted by the software") {
					logging.INFOf("closing log stream for container %s/%s/%s", namespace, name, containerName)
					return
				}
				panic(errors.ParseInternalError(err))
			}
		}
	}
}
