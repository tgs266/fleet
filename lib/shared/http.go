package shared

func GetNamespace(ns string) string {
	if ns == "_all_" {
		return ""
	}
	return ns
}
