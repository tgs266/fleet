package deployment

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	"github.com/tgs266/fleet/lib/logging"
	"github.com/tgs266/fleet/lib/shared"
	v1a "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

const SELECTOR_LABEL = "fleet-selector"

func Restart(K8 *kubernetes.K8Client, namespace string, name string) error {
	deployment, err := getInternal(K8, namespace, name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	if deployment.Spec.Template.ObjectMeta.Annotations == nil {
		deployment.Spec.Template.ObjectMeta.Annotations = make(map[string]string, 0)
	}
	deployment.Spec.Template.ObjectMeta.Annotations["kubectl.kubernetes.io/restartedAt"] = time.Now().Format(time.RFC3339)
	_, err = K8.K8.AppsV1().Deployments(namespace).Update(context.Background(), deployment, metaV1.UpdateOptions{})
	return errors.ParseInternalError(err)
}

func Delete(K8 *kubernetes.K8Client, namespace string, name string) error {
	logging.INFOf("deleting deployment %s/%s", namespace, name)
	return K8.K8.AppsV1().Deployments(namespace).Delete(context.Background(), name, metaV1.DeleteOptions{})
}

func CreateDeployment(K8 *kubernetes.K8Client, dep DeploymentCreation) error {
	logging.INFOf("creating deployment %s/%s", dep.Namespace, dep.Name)
	containers := []v1.Container{}

	for _, spec := range dep.ContainerSpecs {
		ports := []v1.ContainerPort{}
		for _, port := range spec.Ports {
			ports = append(ports, v1.ContainerPort{
				ContainerPort: int32(port.ContainerPort),
				HostPort:      int32(port.HostPort),
				HostIP:        port.HostIP,
				Protocol:      v1.Protocol(port.Protocol),
			})
		}

		containers = append(containers, v1.Container{
			Name:  spec.Name,
			Image: spec.Image.Name + ":" + spec.Image.Tag,
			Ports: ports,
			Resources: v1.ResourceRequirements{
				Limits: v1.ResourceList{
					v1.ResourceCPU:    *resource.NewMilliQuantity(int64(spec.CPULimit), resource.DecimalSI),
					v1.ResourceMemory: *resource.NewQuantity(int64(spec.MemLimit), resource.DecimalSI),
				},
				Requests: v1.ResourceList{
					v1.ResourceCPU:    *resource.NewMilliQuantity(int64(spec.CPURequests), resource.DecimalSI),
					v1.ResourceMemory: *resource.NewQuantity(int64(spec.MemRequests), resource.DecimalSI),
				},
			},
		})
	}

	selectorVal := uuid.New().String()

	deployment := &v1a.Deployment{
		ObjectMeta: metaV1.ObjectMeta{
			Name:      dep.Name,
			Namespace: dep.Namespace,
			Labels:    map[string]string{SELECTOR_LABEL: selectorVal},
		},
		Spec: v1a.DeploymentSpec{
			Replicas: shared.Int32Ptr(int32(dep.Replicas)),
			Selector: &metaV1.LabelSelector{
				MatchLabels: map[string]string{
					SELECTOR_LABEL: selectorVal,
				},
			},
			Template: v1.PodTemplateSpec{
				ObjectMeta: metaV1.ObjectMeta{
					Labels: map[string]string{
						SELECTOR_LABEL: selectorVal,
					},
				},
				Spec: v1.PodSpec{
					Containers: containers,
				},
			},
		},
	}

	_, e := K8.K8.AppsV1().Deployments(dep.Namespace).Create(context.TODO(), deployment, metaV1.CreateOptions{})
	if e != nil {
		return errors.ParseInternalError(e)
	}
	return nil
	// SaveSpec(d)
}

func UpdateDeployment(K8 *kubernetes.K8Client, namespace, name string, dep *v1a.Deployment) error {
	logging.INFOf("updating deployment %s/%s", namespace, name)

	_, e := K8.K8.AppsV1().Deployments(dep.Namespace).Update(context.TODO(), dep, metaV1.UpdateOptions{})
	if e != nil {
		return errors.ParseInternalError(e)
	}
	return nil
	// SaveSpec(d)
}

func ScaleDeployment(K8 *kubernetes.K8Client, namespace, name string, newCount int) error {
	logging.INFOf("scaling deployment %s/%s to %d replicas", namespace, name, newCount)

	dep, err := getInternal(K8, namespace, name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	dep.Spec.Replicas = shared.Int32Ptr(int32(newCount))

	_, e := K8.K8.AppsV1().Deployments(namespace).Update(context.TODO(), dep, metaV1.UpdateOptions{})
	if e != nil {
		return errors.ParseInternalError(e)
	}
	return nil
	// SaveSpec(d)
}

func UpdateContainerSpec(K8 *kubernetes.K8Client, namespace string, name string, specName string, containerSpec container.ContainerSpec) error {
	logging.INFOf("updating container spec %s/%s/%s", namespace, name, specName)
	deployment, err := getInternal(K8, namespace, name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	idx := -1
	for i, container := range deployment.Spec.Template.Spec.Containers {
		if container.Name == specName {
			idx = i
			break
		}
	}

	if idx == -1 {
		return errors.NewResourceNotFoundError("container-spec", specName)
	}

	v1Ports := []v1.ContainerPort{}
	v1Envs := []v1.EnvVar{}

	for _, p := range containerSpec.Ports {
		v1Ports = append(v1Ports, v1.ContainerPort{
			Protocol:      v1.Protocol(p.Protocol),
			HostPort:      int32(p.HostPort),
			HostIP:        p.HostIP,
			ContainerPort: int32(p.ContainerPort),
		})
	}

	for _, e := range containerSpec.EnvVars {
		v1Envs = append(v1Envs, v1.EnvVar{
			Name:  e.Name,
			Value: e.Value,
		})
	}

	deployment.Spec.Template.Spec.Containers[idx].Image = containerSpec.Image.Name + ":" + containerSpec.Image.Tag
	deployment.Spec.Template.Spec.Containers[idx].Name = containerSpec.Name
	deployment.Spec.Template.Spec.Containers[idx].Ports = v1Ports
	deployment.Spec.Template.Spec.Containers[idx].Env = v1Envs

	if deployment.Spec.Template.Spec.Containers[idx].Resources.Requests == nil {
		deployment.Spec.Template.Spec.Containers[idx].Resources.Requests = make(v1.ResourceList)
	}

	if deployment.Spec.Template.Spec.Containers[idx].Resources.Limits == nil {
		deployment.Spec.Template.Spec.Containers[idx].Resources.Limits = make(v1.ResourceList)
	}

	deployment.Spec.Template.Spec.Containers[idx].Resources.Requests[v1.ResourceCPU] = *resource.NewMilliQuantity(int64(containerSpec.CPURequests), resource.DecimalSI)
	deployment.Spec.Template.Spec.Containers[idx].Resources.Requests[v1.ResourceMemory] = *resource.NewQuantity(int64(containerSpec.MemRequests), resource.DecimalSI)

	deployment.Spec.Template.Spec.Containers[idx].Resources.Limits[v1.ResourceCPU] = *resource.NewMilliQuantity(int64(containerSpec.CPULimit), resource.DecimalSI)
	deployment.Spec.Template.Spec.Containers[idx].Resources.Limits[v1.ResourceMemory] = *resource.NewQuantity(int64(containerSpec.MemLimit), resource.DecimalSI)

	_, err = K8.K8.AppsV1().Deployments(namespace).Update(context.Background(), deployment, metaV1.UpdateOptions{})
	return errors.ParseInternalError(err)
}
