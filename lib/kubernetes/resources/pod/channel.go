package pod

import (
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type PodMetaChannel struct {
	List  chan []PodMeta
	Error chan error
}

func GetPodMetaChannel(K8 *kubernetes.K8Client, namespace string, options metaV1.ListOptions, ds *types.DataSelector) *PodMetaChannel {
	channel := &PodMetaChannel{
		List:  make(chan []PodMeta, 1),
		Error: make(chan error, 1),
	}

	go func() {
		pods := channels.GetPodListChannel(K8.K8, namespace, options, 1)
		metas, err := ChannelToMeta(*pods, ds)
		channel.List <- metas
		channel.Error <- err
	}()
	return channel

}
