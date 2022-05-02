package secret

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	core "k8s.io/api/core/v1"
)

type SecretMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	Namespace   string            `json:"namespace"`
	CreatedAt   uint              `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
	Immutable   bool              `json:"immutable"`
}

type Secret struct {
	SecretMeta `json:",inline"`
	Data       map[string][]byte `json:"data"`
}

func BuildSecretMeta(secret *core.Secret) SecretMeta {
	immutable := false
	if secret.Immutable != nil {
		immutable = *secret.Immutable
	}
	return SecretMeta{
		UID:         string(secret.UID),
		Name:        secret.Name,
		Namespace:   secret.Namespace,
		CreatedAt:   uint(secret.CreationTimestamp.UnixMilli()),
		Labels:      secret.Labels,
		Annotations: common.CleanAnnotations(secret.Annotations),
		Immutable:   immutable,
	}
}

func BuildSecret(secret *core.Secret) *Secret {
	return &Secret{
		SecretMeta: BuildSecretMeta(secret),
		Data:       secret.Data,
	}
}
