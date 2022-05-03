package pod

import (
	"fmt"
	"io"

	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/logging"
	v1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/tools/remotecommand"
)

type CommHandler interface {
	io.Reader
	io.Writer
	remotecommand.TerminalSizeQueue
}

// implements CommHandler
type SessionHandler struct {
	websocket *websocket.Conn
	sizeChan  chan remotecommand.TerminalSize
	doneChan  chan struct{}
}

type Message struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

const END = "\u0004"

func (t SessionHandler) Read(p []byte) (int, error) {
	var msg Message
	err := t.websocket.ReadJSON(&msg)
	if err != nil {
		return copy(p, END), err
	}

	switch msg.Type {
	case "stdin":
		return copy(p, msg.Data), nil
	default:
		return copy(p, END), fmt.Errorf("unknown message type '%s'", msg.Type)
	}
}

func (t SessionHandler) Write(p []byte) (int, error) {
	msg := Message{
		Type: "stdout",
		Data: string(p),
	}

	if err := t.websocket.WriteJSON(msg); err != nil {
		return 0, err
	}
	return len(p), nil
}

func (t SessionHandler) Next() *remotecommand.TerminalSize {
	select {
	case size := <-t.sizeChan:
		return &size
	case <-t.doneChan:
		return nil
	}
}

func BeginExec(K8 *kubernetes.K8Client, namespace string, name string, containerName string, commHandler CommHandler) error {
	req := K8.K8.CoreV1().RESTClient().Post().Resource("pods").Name(name).Namespace(namespace).SubResource("exec")
	req.VersionedParams(&v1.PodExecOptions{
		Container: containerName,
		Command:   []string{"bash"},
		Stdin:     true,
		Stdout:    true,
		Stderr:    true,
		TTY:       true,
	}, scheme.ParameterCodec)

	exec, err := remotecommand.NewSPDYExecutor(K8.Config, "POST", req.URL())

	if err != nil {
		return err
	}

	err = exec.Stream(remotecommand.StreamOptions{
		Stdin:             commHandler,
		Stdout:            commHandler,
		Stderr:            commHandler,
		TerminalSizeQueue: commHandler,
		Tty:               true,
	})

	if err != nil {
		return err
	}
	return nil

}

func StreamPodTerminal(K8 *kubernetes.K8Client, namespace string, name string, containerName string, c *websocket.Conn) error {
	logging.INFOf("opening terminal for pod %s/%s", namespace, name)
	session := SessionHandler{
		websocket: c,
		sizeChan:  make(chan remotecommand.TerminalSize),
		doneChan:  make(chan struct{}),
	}
	for {
		err := BeginExec(K8, namespace, name, containerName, session)
		if err != nil {
			c.Close()
			return err
		}
	}

}
