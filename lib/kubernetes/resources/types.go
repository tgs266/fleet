package resources

type GenericStatus string

const (
	RUNNING_STATUS    = GenericStatus("Running")
	PENDING_STATUS    = GenericStatus("Pending")
	WAITING_STATUS    = GenericStatus("Waiting") // specifically for containers
	TERMINATED_STATUS = GenericStatus("Terminated")
	UNKNOWN_STATUS    = GenericStatus("Unknown")
)

type ResourceStatus struct {
	GenericStatus GenericStatus `json:"genericStatus"`
	Reason        string        `json:"reason"`
}
