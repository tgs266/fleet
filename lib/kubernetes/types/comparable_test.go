package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestComparableString(t *testing.T) {
	testCases := []struct {
		name     string
		v1       Comparable
		v2       Comparable
		operator Operator
		expected bool
	}{
		{
			name:     "test1",
			v1:       ComparableString("a"),
			v2:       ComparableString("b"),
			operator: EqualOperator,
			expected: false,
		},
		{
			name:     "test2",
			v1:       ComparableString("a"),
			v2:       ComparableString("b"),
			operator: GreaterThanOperator,
			expected: false,
		},
		{
			name:     "test3",
			v1:       ComparableString("b"),
			v2:       ComparableString("b"),
			operator: GreaterThanOrEqualOperator,
			expected: true,
		},
		{
			name:     "test4",
			v1:       ComparableString("b"),
			v2:       ComparableString("b"),
			operator: NotEqualOperator,
			expected: false,
		},
		{
			name:     "test4",
			v1:       ComparableString("c"),
			v2:       ComparableString("b"),
			operator: LessThanOrEqualOperator,
			expected: false,
		},
		{
			name:     "test4",
			v1:       ComparableString("b"),
			v2:       ComparableString("c"),
			operator: LessThanOperator,
			expected: true,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			assert.Equal(t, test.operator.Test(test.v1, test.v2), test.expected)
		})
	}
}
