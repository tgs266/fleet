package secret

import (
	"github.com/tgs266/fleet/lib/types"
	core "k8s.io/api/core/v1"
)

type secretComparable struct {
	secret core.Secret
}

func (comp secretComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.secret.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.secret.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.secret.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(secrets *core.SecretList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, secret := range secrets.Items {
		comps = append(comps, secretComparable{secret: secret})
	}
	return comps
}

func FromComparable(secrets []types.ComparableType) *core.SecretList {
	list := []core.Secret{}
	for _, secret := range secrets {
		list = append(list, secret.(secretComparable).secret)
	}
	return &core.SecretList{
		Items: list,
	}
}
