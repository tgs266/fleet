package git

import (
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
)

func Commit(username string, manager *GitManager, spec runtime.Object, message string) {
	innerObj, err := runtime.DefaultUnstructuredConverter.ToUnstructured(spec)
	if err != nil {
		return
	}
	u := unstructured.Unstructured{Object: innerObj}

	kind := u.GetKind()
	name := u.GetName()

	if manager == nil {
		return
	}

	repo, err := manager.GetRepository(kind, name)
	if err != nil {
		return
	}

	repo.Commit(username, spec, message)
}
