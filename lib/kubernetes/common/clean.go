package common

func CleanAnnotations(annotations map[string]string) map[string]string {
	if _, ok := annotations["kubectl.kubernetes.io/last-applied-configuration"]; ok {
		delete(annotations, "kubectl.kubernetes.io/last-applied-configuration")
	}
	return annotations
}
