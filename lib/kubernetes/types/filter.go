package types

import (
	"reflect"

	"github.com/tgs266/fleet/lib/errors"
)

type Operator string
type Filters []Filter

const (
	EqualOperator              = "eq"
	NotEqualOperator           = "neq"
	GreaterThanOperator        = "gt"
	LessThanOperator           = "lt"
	GreaterThanOrEqualOperator = "gte"
	LessThanOrEqualOperator    = "lte"
)

func getOperator(op string) Operator {
	switch op {
	case EqualOperator:
		return EqualOperator
	case NotEqualOperator:
		return NotEqualOperator
	case GreaterThanOperator:
		return GreaterThanOperator
	case LessThanOperator:
		return LessThanOperator
	case GreaterThanOrEqualOperator:
		return GreaterThanOrEqualOperator
	case LessThanOrEqualOperator:
		return LessThanOrEqualOperator
	}
	panic(errors.NewOperatorNotSupported(op))
}

func (o Operator) Test(v1 Comparable, v2 Comparable) bool {

	v1Type := reflect.TypeOf(v1)
	v2Type := reflect.TypeOf(v2)

	if v1Type.Name() != v2Type.Name() {
		panic(errors.NewOperatorTypeMismatchError(string(o), v1Type.Name(), v2Type.Name()))
	}

	compV := v1.Compare(v2)
	switch o {
	case EqualOperator:
		return compV == 0
	case NotEqualOperator:
		return compV != 0
	case LessThanOperator:
		return compV == -1
	case GreaterThanOperator:
		return compV == 1
	case GreaterThanOrEqualOperator:
		return v1.GTE(v2)
	case LessThanOrEqualOperator:
		return v1.LTE(v2)
	}

	return false
}

type Filter struct {
	Property Property   `json:"property"`
	By       Comparable `json:"by"`
	Operator Operator   `json:"operator"`
}

var EmptyFilters = []Filter{}
var SystemNamespaceFilter = Filter{
	Property: NamespaceProperty,
	By:       ComparableString("kube-system"),
	Operator: Operator("neq"),
}

func (f Filter) Match(other Comparable) bool {
	return f.Operator.Test(f.By, other)
}

func (f Filters) Execute(list []ComparableType) []ComparableType {
	newList := []ComparableType{}
	if len(f) == 0 {
		return list
	}
	for _, v := range list {
		for _, f := range f {
			if f.Match(v.Get(f.Property)) {
				newList = append(newList, v)
			}
		}
	}
	return newList
}
