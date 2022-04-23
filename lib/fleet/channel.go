package fleet

import (
	"strconv"

	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type FleetChannel struct {
	List  chan map[string]FleetObject
	Error chan error
}

func (pmc *FleetChannel) Get() map[string]FleetObject {
	data := <-pmc.List
	return data
}

func (pmc *FleetChannel) GetError() error {
	return <-pmc.Error
}

func GetPodMetaChannel(K8 *kubernetes.K8Client, namespace string, options metaV1.ListOptions, ds *types.DataSelector) *FleetChannel {
	channel := &FleetChannel{
		List:  make(chan map[string]FleetObject, 1),
		Error: make(chan error, 1),
	}

	go func() {
		pods := channels.GetPodListChannel(K8.K8, namespace, options, 1)
		podList, err := pod.CompareOnChannel(pods, ds)
		if err != nil {
			channel.Error <- err
			return
		}

		list := map[string]FleetObject{}
		for _, m := range podList.Items {
			data := *BuildObjectFromPod(m)
			list[data.Meta.UID] = data
			// list = append(list, *BuildObjectFromPod(m))
		}

		channel.List <- list
		channel.Error <- err
	}()
	return channel

}

func GetContainerChannel(K8 *kubernetes.K8Client, namespace string, options metaV1.ListOptions, ds *types.DataSelector) *FleetChannel {
	channel := &FleetChannel{
		List:  make(chan map[string]FleetObject, 1),
		Error: make(chan error, 1),
	}

	go func() {
		pods := channels.GetPodListChannel(K8.K8, namespace, options, 1)
		podList := <-pods.List
		err := <-pods.Error
		if err != nil {
			channel.Error <- err
			return
		}

		podComps := pod.ToComparable(podList)
		ds.Execute(podComps)
		podList = pod.FromComparable(ds.Items)

		conts := <-GetContainerChannelFromPodList(*podList).List

		channel.List <- conts
		channel.Error <- nil
	}()
	return channel
}

func GetContainerChannelFromPodList(pods v1.PodList) *FleetChannel {
	channel := &FleetChannel{
		List:  make(chan map[string]FleetObject, 1),
		Error: make(chan error, 1),
	}

	go func() {
		list := map[string]FleetObject{}

		for _, p := range pods.Items {
			for c, _ := range p.Spec.Containers {
				cont := p.Spec.Containers[c]
				var state v1.ContainerState
				if len(p.Spec.Containers) == len(p.Status.ContainerStatuses) {
					state = p.Status.ContainerStatuses[c].State
				}

				list[string(p.UID)+"-"+cont.Name] = buildContainerFleetObject(p, cont, state)

				for i := 0; i < 0; i++ {
					str := strconv.Itoa(i)
					fom := FleetObjectMeta{
						UID:  string(p.UID) + "-" + cont.Name + str,
						Name: cont.Name,
						Details: map[string]string{
							"image": cont.Image,
						},
					}
					list[fom.UID] = FleetObject{
						Meta:      fom,
						Status:    getContainerStatus(state),
						Children:  nil,
						Dimension: ContainerDimName,
					}
				}
			}
		}

		channel.List <- list
		channel.Error <- nil
	}()
	return channel

}
