package types

import (
	"reflect"
	"strings"

	"github.com/tgs266/fleet/lib/errors"
)

type ComparableType interface {
	Get(name Property) Comparable
}

type Comparable interface {
	Compare(Comparable) int
	GTE(Comparable) bool
	LTE(Comparable) bool
}

type ComparableString string
type ComparableInt64 int64

func getComparable(v interface{}) Comparable {
	t := reflect.TypeOf(v)
	switch t.Name() {
	case "string":
		return ComparableString(v.(string))
	case "int64":
		return ComparableInt64(v.(int64))
	case "int32":
		return ComparableInt64(v.(int64))
	case "int":
		return ComparableInt64(v.(int64))
	}

	panic(errors.NewComparableTypeNotSupported(t.Name()))
}

func (c ComparableString) Compare(other Comparable) int {
	o := other.(ComparableString)
	return strings.Compare(string(c), string(o))
}

func (c ComparableString) GTE(other Comparable) bool {
	o := other.(ComparableString)
	return string(c) >= string(o)
}

func (c ComparableString) LTE(other Comparable) bool {
	o := other.(ComparableString)
	return string(c) <= string(o)
}

func (c ComparableInt64) Compare(other Comparable) int {
	o := other.(ComparableInt64)
	if int64(c) < int64(o) {
		return -1
	} else if int64(c) == int64(0) {
		return 0
	} else {
		return 1
	}
}

func (c ComparableInt64) GTE(other Comparable) bool {
	o := other.(ComparableInt64)
	return int64(c) >= int64(o)
}

func (c ComparableInt64) LTE(other Comparable) bool {
	o := other.(ComparableInt64)
	return int64(c) <= int64(o)
}

type SortBy struct {
	Property  Property
	Ascending bool
}
