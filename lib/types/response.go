package types

type PaginationResponse struct {
	Items  interface{} `json:"items"`
	Total  int         `json:"total"`
	Offset int         `json:"offset"`
	Count  int         `json:"count"`
}
