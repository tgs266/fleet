package shared

func CleanNamespace(ns string) string {
	if ns == "undefined" {
		return ""
	}
	if ns == "" {
		return "default"
	}
	return ns
}
